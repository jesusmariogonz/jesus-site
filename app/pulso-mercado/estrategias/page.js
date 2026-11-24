import Link from "next/link";
import { absUrl } from "@/lib/site";
import { EXPERIMENTOS, getExperimento } from "@/lib/research/experimentos";
import {
  ESTRATEGIAS_TRADING,
  ESTRATEGIAS_CANDIDATAS,
  COLOR_ESTADO_ESTRATEGIA,
  ETIQUETA_ESTADO_ESTRATEGIA,
} from "@/lib/strategies/catalog";

export const metadata = {
  title: "Strategy Lab — Pulso de Mercado",
  description:
    "El catálogo único de todas las estrategias que Pulso de Mercado ha probado: las que están en producción, las que se descartaron con evidencia, y las candidatas de investigación que todavía no se promueven a nada.",
  alternates: { canonical: "/pulso-mercado/estrategias" },
  openGraph: {
    type: "website",
    url: absUrl("/pulso-mercado/estrategias"),
    title: "Strategy Lab — Pulso de Mercado",
  },
};

function Badge({ estado }) {
  return (
    <span
      className="exp-badge"
      style={{
        color: COLOR_ESTADO_ESTRATEGIA[estado],
        borderColor: COLOR_ESTADO_ESTRATEGIA[estado],
        background: `color-mix(in srgb, ${COLOR_ESTADO_ESTRATEGIA[estado]} 12%, var(--surface))`,
      }}
    >
      {ETIQUETA_ESTADO_ESTRATEGIA[estado]}
    </span>
  );
}

export default function StrategyLabPage() {
  const produccion = ESTRATEGIAS_TRADING.filter((s) => s.estado === "EN_PRODUCCION");
  const descartadas = ESTRATEGIAS_TRADING.filter((s) => s.estado === "DESCARTADA");

  return (
    <section className="section">
      <div className="container horizonte-page activo-page">
        <span className="pulsodash-eyebrow">
          <Link href="/pulso-mercado">Pulso de Mercado</Link> · Strategy Lab
        </span>
        <h1>Strategy Lab</h1>
        <p className="activo-descripcion">
          Un solo lugar que une las dos mitades del proyecto: las estrategias que{" "}
          <Link href="/pulso-mercado/trading">Trading Algorítmico</Link> ya opera o descartó con
          evidencia real, y las candidatas que <Link href="/pulso-mercado/research">Research Lab</Link>{" "}
          sigue investigando. No hay un "score" único todavía — eso requeriría trackear métricas
          que hoy no se calculan de forma sistemática para cada candidata; esta página solo cita el
          estado y la evidencia tal como ya están documentados en su fuente. Se completa conforme se
          publiquen más experimentos y decisiones, no de golpe.
        </p>

        <div className="activo-bloque">
          <h2>Cómo se mueve una estrategia</h2>
          <p className="activo-descripcion">
            Cuatro etapas, no tres portafolios. Ninguna estrategia salta directo de un hallazgo de
            investigación a capital de producción — y hoy la mayoría de las candidatas de este
            catálogo están apenas en la primera etapa:
          </p>
          <div className="strategy-pipeline">
            <div className="strategy-pipeline-paso">
              <span className="strategy-pipeline-emoji">🔵</span>
              <strong>Research</strong>
              <span>Un experimento de <Link href="/pulso-mercado/research">Research Lab</Link> encuentra (o descarta) una señal.</span>
            </div>
            <span className="strategy-pipeline-flecha">→</span>
            <div className="strategy-pipeline-paso">
              <span className="strategy-pipeline-emoji">🟡</span>
              <strong>Strategy candidate</strong>
              <span>El hallazgo se formaliza como una regla de entrada/salida concreta, todavía sin capital.</span>
            </div>
            <span className="strategy-pipeline-flecha">→</span>
            <div className="strategy-pipeline-paso strategy-pipeline-paso--pendiente">
              <span className="strategy-pipeline-emoji">⚪</span>
              <strong>Paper Lab</strong>
              <span>Cartera virtual independiente, con su propio capital, benchmark y métricas — todavía no existe como infraestructura separada.</span>
            </div>
            <span className="strategy-pipeline-flecha">→</span>
            <div className="strategy-pipeline-paso">
              <span className="strategy-pipeline-emoji">🟢</span>
              <strong>Production</strong>
              <span>Capital real de <Link href="/pulso-mercado/trading">Trading Algorítmico</Link> (LP-001 / MP-001 / RA-001).</span>
            </div>
          </div>
          <p className="activo-descripcion" style={{ marginTop: 14 }}>
            Hoy no existe un "Paper Lab" separado con carteras virtuales independientes por
            candidata — construirlo con datos inventados sería peor que no tenerlo. Lo más
            parecido que existe ahora es la validación forward de EXP-005 (ver su reporte): un
            recheck estadístico automático sobre el bucket congelado, no una cartera con capital
            propio. Esta sección se actualizará en cuanto esa infraestructura exista de verdad.
          </p>
        </div>

        <div className="activo-bloque">
          <h2>En producción</h2>
          <p className="activo-descripcion">
            Las {produccion.length} estrategias que hoy deciden las operaciones reales (paper
            trading) del sistema — cada una documentada en su ADR de origen.
          </p>
          <div className="prose" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estrategia</th>
                  <th>Bucket</th>
                  <th>Origen</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {produccion.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>
                      <Link href={s.href}>{s.nombre}</Link>
                      <br />
                      <span style={{ color: "var(--text-dim)", fontSize: ".85rem" }}>{s.resumen}</span>
                    </td>
                    <td>{s.bucket}</td>
                    <td>{s.origen}</td>
                    <td><Badge estado={s.estado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="activo-bloque">
          <h2>Probadas y descartadas</h2>
          <p className="activo-descripcion">
            No se borran: cada una se midió con la misma metodología que las vigentes y se
            descartó por evidencia, no por intuición. Su código se conserva, por si aparece
            evidencia mejor en el futuro.
          </p>
          <div className="prose" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estrategia</th>
                  <th>Origen</th>
                  <th>Por qué se descartó</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {descartadas.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td><Link href={s.href}>{s.nombre}</Link></td>
                    <td>{s.origen}</td>
                    <td style={{ fontSize: ".85rem" }}>{s.evidencia}</td>
                    <td><Badge estado={s.estado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="activo-bloque">
          <h2>Candidatas de investigación</h2>
          <p className="activo-descripcion">
            Hallazgos de <Link href="/pulso-mercado/research">Research Lab</Link> que podrían, en
            el futuro, promoverse a producción — ninguno lo ha hecho todavía. Un hallazgo
            "validado" no se convierte automáticamente en estrategia: necesita además superar los
            controles de riesgo y la validación walk-forward que ya exige el motor de trading.
          </p>
          <div className="prose" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Experimento</th>
                  <th>Candidata</th>
                  <th>Etapa</th>
                  <th>Veredicto</th>
                </tr>
              </thead>
              <tbody>
                {ESTRATEGIAS_CANDIDATAS.map((c) => {
                  const exp = getExperimento(c.expSlug);
                  if (!exp) return null;
                  return (
                    <tr key={c.expSlug}>
                      <td>
                        <Link href={`/pulso-mercado/research/${exp.slug}`}>{exp.id}</Link>
                      </td>
                      <td>{c.nombre}</td>
                      <td style={{ fontSize: ".85rem" }}>{c.etapa}</td>
                      <td>
                        <span className={`exp-estado exp-estado--${exp.estado.toLowerCase()}`}>
                          {exp.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="activo-descripcion" style={{ marginTop: 14 }}>
            EXP-004 (Short Pressure) todavía está en fase de construcción de sus módulos de cómputo
            en pulso-research-lab — sin un veredicto real todavía, no aparece aquí hasta que lo
            tenga, para no listar una candidata sin evidencia detrás.
          </p>
        </div>

        <p style={{ marginTop: 32 }}>
          <Link href="/pulso-mercado">← Volver a Pulso de Mercado</Link>
        </p>
      </div>
    </section>
  );
}
