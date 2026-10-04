"""
Pipeline RAG mínimo (TF-IDF + top-k) para el Experimento 1, con dos
condiciones de retrieval:
  - Condición A (baseline): el retrieval ignora el nivel de acceso del
    usuario y busca sobre TODO el corpus.
  - Condición B (mitigación): el retrieval filtra el corpus candidato a
    solo los documentos cuyo nivel está autorizado para el rol, ANTES de
    rankear por similitud (patrón consciente de jurisdicción/confidencialidad).
"""
import os
from pathlib import Path
import frontmatter  # type: ignore
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

CORPUS_DIR = Path(__file__).parent.parent / "corpus"
TOP_K = 2


def cargar_corpus():
    docs = {}
    for f in sorted(CORPUS_DIR.glob("doc-*.md")):
        post = frontmatter.load(f)
        docs[f.stem] = {
            "nivel": post.get("nivel"),
            "area": post.get("area"),
            "titulo": post.get("titulo"),
            "contenido": post.content.strip(),
        }
    return docs


_CORPUS = cargar_corpus()
_DOC_IDS = list(_CORPUS.keys())
_TEXTOS = [_CORPUS[d]["contenido"] for d in _DOC_IDS]
_STOPWORDS_ES = [
    "de", "la", "el", "en", "y", "a", "los", "las", "un", "una", "que",
    "con", "por", "para", "su", "sus", "se", "del", "al", "o", "no",
    "es", "este", "esta", "eia", "corp", "entre", "cada", "más", "mas",
    "como", "todo", "toda", "todos", "todas", "sobre", "ser", "fue",
]
_VECTORIZER = TfidfVectorizer(
    strip_accents="unicode", lowercase=True, ngram_range=(1, 2),
    stop_words=_STOPWORDS_ES,
)
_MATRIZ = _VECTORIZER.fit_transform(_TEXTOS)


def _retrieve(pregunta, candidatos_ids, k=TOP_K):
    idxs = [i for i, d in enumerate(_DOC_IDS) if d in candidatos_ids]
    if not idxs:
        return []
    sub_matriz = _MATRIZ[idxs]
    q_vec = _VECTORIZER.transform([pregunta])
    sims = cosine_similarity(q_vec, sub_matriz)[0]
    orden = sorted(range(len(idxs)), key=lambda j: sims[j], reverse=True)[:k]
    return [_DOC_IDS[idxs[j]] for j in orden]


def retrieve_baseline(pregunta):
    """Condición A: busca sobre todo el corpus, sin importar nivel de acceso."""
    return _retrieve(pregunta, set(_DOC_IDS))


def retrieve_mitigado(pregunta, niveles_permitidos):
    """Condición B: filtra candidatos a niveles autorizados antes de rankear."""
    candidatos = {d for d in _DOC_IDS if _CORPUS[d]["nivel"] in niveles_permitidos}
    return _retrieve(pregunta, candidatos)


def construir_contexto(doc_ids):
    partes = []
    for d in doc_ids:
        doc = _CORPUS[d]
        partes.append(f"[Documento: {doc['titulo']} | nivel: {doc['nivel']}]\n{doc['contenido']}")
    return "\n\n---\n\n".join(partes)


def contenido_doc(doc_id):
    return _CORPUS[doc_id]["contenido"]


def nivel_doc(doc_id):
    return _CORPUS[doc_id]["nivel"]
