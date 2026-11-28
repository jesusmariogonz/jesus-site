import Link from "next/link";
import resumen from "@/lib/resumen-semanal-trading.json";

/* Resumen semanal de todos los motores (reemplaza a "Salud del sistema").
   Las cifras las genera `src/reports/resumen_semanal.py` (repo del motor) y la
   rutina del viernes agrega la narrativa con fuentes en `mercado` y
   `notas_activos`; aquí solo se presenta lo que trae el JSON. */

const color = (n) => (n > 0 ? "#16a34a" : n < 0 ? "#dc2626" : undefined);
const signo = (n) => (n > 0 ? "+" : "");
const usd = (n) => (n === null || n === undefined ? "—" : `${signo(n)}$${n.toFixed(2)}`);
const pct = (n) => (n === null || n === undefined ? "—" : `${signo(n)}${n.toFixed(2)}%`);

function fechaCorta(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })
    .replace(" de ", " ");
}

function Celda({ n, formato }) {
  return <td style={{ color: color(n), whiteSpace: "nowrap" }}>{formato(n)}</td>;
}

function TablaDias({ dias }) {
  return (
    <div className="prose" style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr><th>Día</th><th>Equity</th><th>P&amp;L día</th><th>%</th></tr>
        </thead>
        <tbody>
          {dias.map((d) => (
            <tr key={d.fecha}>
              <td>{fechaCorta(d.fecha)}</td>
              <td>${d.equity.toFixed(2)}</td>
              <Celda n={d.pnl_dia_usd} formato={usd} />
              <Celda n={d.pnl_dia_pct} formato={pct} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TablaActivos({ activos }) {
  const ordenados = [...activos].sort((a, b) => b.pnl_total_usd - a.pnl_total_usd);
  return (
    <div className="prose" style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr>
            <th>Activo</th><th>P&amp;L desde la compra</th><th>%</th><th>Precio compra</th>
            <th>Hoy / venta</th><th>P&amp;L de la semana</th><th>Compra</th><th>Bucket</th>
          </tr>
        </thead>
        <tbody>
          {ordenados.map((a) => (
            <tr key={`${a.bucket}-${a.symbol}`}>
              <td>
                <Link href={`/pulso-mercado/trading/simbolo/${a.symbol}`} className="trading-symbol-link">{a.symbol}</Link>
                {a.estado === "cerrada" ? " (cerrada)" : ""}
              </td>
              <Celda n={a.pnl_total_usd} formato={usd} />
              <Celda n={a.pnl_total_pct} formato={pct} />
              <td>${a.precio_entrada.toFixed(2)}</td>
              <td>${a.precio_actual_o_salida.toFixed(2)}</td>
              <Celda n={a.pnl_semana_usd} formato={usd} />
              <td>{fechaCorta(a.fecha_entrada)}</td>
              <td>{a.bucket}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DetalleDiario({ dias }) {
  return (
    <details style={{ marginTop: 8 }}>
      <summary>Ver activo por activo, día por día</summary>
      {dias.filter((d) => d.activos?.length).map((d) => (
        <div key={d.fecha} style={{ marginTop: 10 }}>
          <strong>{fechaCorta(d.fecha)}</strong>
          <div className="prose" style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Activo</th><th>Acción</th><th>Cambio</th><th>P&amp;L</th></tr></thead>
              <tbody>
                {[...d.activos].sort((a, b) => b.pnl_usd - a.pnl_usd).map((a) => (
                  <tr key={`${a.bucket}-${a.symbol}`}>
                    <td>{a.symbol}</td>
                    <td>{a.accion}</td>
                    <Celda n={a.cambio_pct} formato={pct} />
                    <Celda n={a.pnl_usd} formato={usd} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </details>
  );
}

function MotorSemanal({ motor }) {
  const esRW = motor.id === "reverse_winners";
  return (
    <div style={{ marginTop: 20 }}>
      <h3 style={{ marginBottom: 6 }}>{motor.nombre}</h3>
      <TablaDias dias={motor.dias} />
      {esRW ? (
        <>
          <p className="pulsodash-vacio" style={{ marginTop: 8 }}>
            {motor.n_posiciones_abiertas} posiciones abiertas, efectivo ${motor.efectivo.toFixed(2)}. Se compró al cierre del
            27-nov (primer día con señales desde que el portafolio revisa a diario), así que el P&amp;L
            todavía es $0.00; no hay ventas hasta {motor.primeras_ventas_estimadas}.
          </p>
          {motor.dias.some((d) => d.compradas > 0) && (
            <details>
              <summary>Ver las {motor.n_posiciones_abiertas} compras</summary>
              <p>{motor.dias.filter((d) => d.compradas > 0).flatMap((d) => d.tickers_comprados).join(", ")}</p>
            </details>
          )}
        </>
      ) : (
        <>
          <h4 style={{ margin: "14px 0 4px" }}>Activos comprados: ganancias y pérdidas</h4>
          <TablaActivos activos={motor.activos_semana} />
          <DetalleDiario dias={motor.dias} />
        </>
      )}
    </div>
  );
}

function Candidatos({ candidatos }) {
  const { compra, vigilar_venta: vigilar } = candidatos;
  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 6 }}>Candidatos para la próxima semana</h3>
      <p className="pulsodash-vacio">Para echarles un ojo; no son órdenes ni recomendaciones. Nada se ejecuta solo por estar aquí.</p>
      <h4 style={{ margin: "10px 0 4px" }}>Posibles compras (señal de entrada activa y sin posición)</h4>
      {compra.length === 0 ? (
        <p className="pulsodash-vacio">Ninguna señal de entrada activa.</p>
      ) : (
        <div className="prose" style={{ overflowX: "auto" }}>
          <table>
            <thead><tr><th>Activo</th><th>Bucket</th><th>Precio</th><th>Stop</th><th>Por qué no entró</th></tr></thead>
            <tbody>
              {compra.map((c) => (
                <tr key={`${c.bucket}-${c.symbol}`}>
                  <td>{c.symbol}</td>
                  <td>{c.bucket}</td>
                  <td>${c.precio_entrada}</td>
                  <td>${c.stop}</td>
                  <td>{c.motivo_no_entro ? c.motivo_no_entro.replaceAll("_", " ") : "Entraría el lunes si hay efectivo"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <h4 style={{ margin: "14px 0 4px" }}>Posibles ventas (señal de salida o a 3% o menos de su stop)</h4>
      {vigilar.length === 0 ? (
        <p className="pulsodash-vacio">Ninguna posición cerca de su stop.</p>
      ) : (
        <div className="prose" style={{ overflowX: "auto" }}>
          <table>
            <thead><tr><th>Activo</th><th>Bucket</th><th>Cierre</th><th>Stop</th><th>Distancia al stop</th><th>Señal de salida</th></tr></thead>
            <tbody>
              {vigilar.map((v) => (
                <tr key={`${v.motor}-${v.bucket}-${v.symbol}`}>
                  <td>{v.symbol}</td>
                  <td>{v.bucket}</td>
                  <td>${v.cierre}</td>
                  <td>${v.stop}</td>
                  <td>{v.distancia_al_stop_pct}%</td>
                  <td>{v.senal_de_salida ? "Sí" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ResumenSemanalTrading() {
  const { semana, mercado, motores, candidatos, notas_activos: notas } = resumen;
  return (
    <div className="pulsodash-panel" style={{ marginBottom: 24 }}>
      <div className="pulsodash-panel-head">
        <span className="pulsodash-panel-title">
          Resumen semanal · {fechaCorta(semana.inicio)} al {fechaCorta(semana.fin)}
        </span>
      </div>

      <h3 style={{ margin: "12px 0 6px" }}>Qué pasó en el mercado</h3>
      <ul>
        {mercado.narrativa.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
      <div className="prose" style={{ overflowX: "auto" }}>
        <table>
          <thead><tr><th>Día</th><th>S&amp;P 500</th><th>Nasdaq</th><th>Small caps</th><th>Oro</th><th>Qué pasó</th></tr></thead>
          <tbody>
            {mercado.dias.map((d) => (
              <tr key={d.fecha}>
                <td>{fechaCorta(d.fecha)}</td>
                <Celda n={d.spy_pct} formato={pct} />
                <Celda n={d.qqq_pct} formato={pct} />
                <Celda n={d.ijr_pct} formato={pct} />
                <Celda n={d.gld_pct} formato={pct} />
                <td>{d.texto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="pulsodash-vacio">SPY, QQQ, IJR y GLD como referencia. Cada día se compara con el cierre anterior.</p>

      {motores.map((m) => <MotorSemanal key={m.id} motor={m} />)}

      <h3 style={{ margin: "24px 0 6px" }}>Qué pasó con cada activo</h3>
      <ul>
        {[...new Set(motores.flatMap((m) => (m.activos_semana || []).map((a) => a.symbol)))]
          .filter((sym) => notas[sym])
          .map((sym) => (
            <li key={sym}><strong>{sym}:</strong> {notas[sym]}</li>
          ))}
      </ul>

      <Candidatos candidatos={candidatos} />

      <details style={{ marginTop: 20 }}>
        <summary>Fuentes de la narrativa</summary>
        <ul>
          {mercado.fuentes.map((f) => (
            <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer">{f.titulo}</a></li>
          ))}
        </ul>
      </details>
      <p className="pulsodash-vacio" style={{ marginTop: 12 }}>
        Generado el {new Date(resumen.generado).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Mexico_City" })}.
        Se actualiza cada viernes al cierre del mercado. Información, no recomendación de inversión; las
        causas de cada movimiento son las que reportan las fuentes, y donde no hay causa confirmada se dice.
      </p>
    </div>
  );
}
