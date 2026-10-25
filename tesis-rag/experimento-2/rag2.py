"""
Pipeline RAG para el Experimento 2 (H2 — derecho al olvido), con estado
dinámico de corpus: a diferencia del Experimento 1 (corpus estático),
aquí el corpus puede mutar entre trials porque simula una eliminación.

Dos condiciones, aplicadas sobre el mismo hecho eliminado:
  - Condición A (eliminación simple): se borra solo el documento base
    (`doc-id`). Los documentos derivados que citaban ese hecho quedan
    intactos y "obsoletos" — el hecho puede seguir siendo recuperable
    de forma indirecta a través de ellos.
  - Condición B (invalidación en cascada): se borra el documento base
    Y se redacta, en cada documento derivado que lo citaba, el párrafo
    que repite el hecho objetivo — reemplazándolo por un marcador de
    redacción — sin tocar el resto del documento derivado (incluyendo
    cualquier "hecho seguro" no relacionado).

El retrieval en sí (TF-IDF + top-k) es idéntico al del Experimento 1;
lo que cambia es que el corpus candidato se recalcula por trial según
la condición, en vez de ser fijo.
"""
from pathlib import Path
import frontmatter  # type: ignore
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

CORPUS_DIR = Path(__file__).parent.parent / "corpus"
TOP_K = 2
MARCADOR_REDACCION = "[contenido eliminado por política de retención — ya no disponible]"

_STOPWORDS_ES = [
    "de", "la", "el", "en", "y", "a", "los", "las", "un", "una", "que",
    "con", "por", "para", "su", "sus", "se", "del", "al", "o", "no",
    "es", "este", "esta", "eia", "corp", "entre", "cada", "más", "mas",
    "como", "todo", "toda", "todos", "todas", "sobre", "ser", "fue",
]


def _cargar_todo():
    docs = {}
    patrones = ["doc-*.md", "derivado-*.md"]
    for patron in patrones:
        for f in sorted(CORPUS_DIR.glob(patron)):
            post = frontmatter.load(f)
            docs[f.stem] = {
                "nivel": post.get("nivel"),
                "area": post.get("area"),
                "titulo": post.get("titulo"),
                "tipo": post.get("tipo", "base"),
                "fuente": post.get("fuente"),
                "contenido": post.content.strip(),
            }
    return docs


_CORPUS_ORIGINAL = _cargar_todo()


def _corpus_para_condicion(doc_id_eliminado, cascada, redacciones):
    """Devuelve una copia del corpus reflejando la eliminación.

    redacciones: dict {derivado_id: parrafo_objetivo_a_borrar} — solo se
    aplica si cascada=True.
    """
    corpus = {}
    for doc_id, doc in _CORPUS_ORIGINAL.items():
        if doc_id == doc_id_eliminado:
            continue  # documento base eliminado en ambas condiciones
        contenido = doc["contenido"]
        if cascada and doc_id in redacciones:
            contenido = contenido.replace(redacciones[doc_id], MARCADOR_REDACCION)
        nuevo = dict(doc)
        nuevo["contenido"] = contenido
        corpus[doc_id] = nuevo
    return corpus


def _construir_indice(corpus):
    doc_ids = list(corpus.keys())
    textos = [corpus[d]["contenido"] for d in doc_ids]
    vectorizer = TfidfVectorizer(
        strip_accents="unicode", lowercase=True, ngram_range=(1, 2),
        stop_words=_STOPWORDS_ES,
    )
    matriz = vectorizer.fit_transform(textos)
    return doc_ids, vectorizer, matriz


def retrieve(pregunta, corpus, k=TOP_K):
    doc_ids, vectorizer, matriz = _construir_indice(corpus)
    if not doc_ids:
        return []
    q_vec = vectorizer.transform([pregunta])
    sims = cosine_similarity(q_vec, matriz)[0]
    orden = sorted(range(len(doc_ids)), key=lambda j: sims[j], reverse=True)[:k]
    return [doc_ids[j] for j in orden]


def construir_contexto(doc_ids, corpus):
    partes = []
    for d in doc_ids:
        doc = corpus[d]
        partes.append(f"[Documento: {doc['titulo']} | nivel: {doc['nivel']}]\n{doc['contenido']}")
    return "\n\n---\n\n".join(partes)


def corpus_condicion_a(doc_id_eliminado):
    """Eliminación simple, sin cascada."""
    return _corpus_para_condicion(doc_id_eliminado, cascada=False, redacciones={})


def corpus_condicion_b(doc_id_eliminado, redacciones):
    """Eliminación + invalidación en cascada en los derivados dados."""
    return _corpus_para_condicion(doc_id_eliminado, cascada=True, redacciones=redacciones)


def corpus_original():
    return dict(_CORPUS_ORIGINAL)
