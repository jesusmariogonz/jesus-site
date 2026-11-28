import Link from "next/link";

/* Reporte semanal completo de trading (una página por viernes). Las cifras
   las genera `src/reports/resumen_semanal.py` (repo del motor); la narrativa
   y las notas por activo las agrega la rutina del viernes con fuentes. Aquí
   solo se presenta lo que trae el JSON — nada se calcula ni se inventa. */

const color = (n) => (n > 0 ? "#16a34a" : n < 0 ? "#dc2626" : undefined);
const signo = (n) => (n > 0 ? "+" : "");
const usd = (n) => (n === null || n === undefined ? "—" : `${n < 0 ? "-" : signo(n)}$${Math.abs(n).toFixed(2)}`);
const pct = (n) => (n === null || n === undefined ? "—" : `${signo(n)}${n.toFixed(2)}%`);

function fechaCorta(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d)
    .toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })
    .replace(" de ", " ");
}

function fechaDiaMes(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-MX", { day: "numeric", month: "short" }).replace(" de ", "-");
}

function Celda({ n, formato }) {
  return <td style={{ color: color(n), whiteSpace: "nowrap" }}>{formato(n)}</td>;
}

function Tabla({ children }) {
  return (
    <div className="prose" style={{ overflowX: "auto" }}>
      <table>{children}</table>
    </div>
  );
}

function TablaDias({ dias }) {
  return (
    <Tabla>
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
    </Tabla>
  );
}

function TablaActivos({ activos }) {
  const ordenados = [...activos].sort((a, b) => b.pnl_total_usd - a.pnl_total_usd);
  return (
    <Tabla>
      <thead>
        <tr>
          <th>Activo</th><th>P&amp;L desde la compra</th><th>Desde entrada</th><th>Semana</th><th>Último día</th>
          <th>Compra</th><th>Precio compra</th><th>Hoy / venta</th><th>Bucket</th>
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
            <Celda n={a.cambio_semana_pct} formato={pct} />
            <Celda n={a.cambio_ultimo_dia_pct} formato={pct} />
            <td>{fechaDiaMes(a.fecha_entrada)}</td>
            <td>${a.precio_entrada.toFixed(2)}</td>
            <td>${a.precio_actual_o_salida.toFixed(2)}</td>
            <td>{a.bucket}</td>
          </tr>
        ))}
      </tbody>
    </Tabla>
  );
}

function Cerradas({ activos }) {
  const cerradas = activos.filter((a) => a.estado === "cerrada");
  if (!cerradas.length) return null;
  return (
    <ul style={{ marginTop: 8 }}>
      {cerradas.map((a) => (
        <li key={`${a.bucket}-${a.symbol}`}>
          <strong>{a.symbol}</strong> ({a.bucket}): comprada a ${a.precio_entrada.toFixed(2)} el {fechaDiaMes(a.fecha_entrada)},
          vendida a ${a.precio_actual_o_salida.toFixed(2)} el {fechaDiaMes(a.fecha_salida)}:{" "}
          <span style={{ color: color(a.pnl_total_usd) }}>
            {usd(a.pnl_total_usd)} ({pct(a.pnl_total_pct)})
          </span>
          .
        </li>
      ))}
    </ul>
  );
}

function LineaBuckets({ motor }) {
  if (!motor.buckets?.length) return null;
  return (
    <p>
      <strong>Equity:</strong>{" "}
      {motor.buckets.map((b, i) => (
        <span key={b.bucket}>
          {i > 0 ? ", " : ""}
          {b.bucket} ${b.equity.toFixed(2)} ({pct(b.retorno_acumulado_pct)}){b.suspendido ? " — suspendido" : ""}
        </span>
      ))}
      {motor.benchmark && (
        <span>
          ; benchmark diversificado ${motor.benchmark.equity.toFixed(2)} ({pct(motor.benchmark.retorno_acumulado_pct)})
        </span>
      )}
      .{" "}
      Semana:{" "}
      <span style={{ color: color(motor.pnl_semana_usd) }}>
        {usd(motor.pnl_semana_usd)} ({pct(motor.pnl_semana_pct)})
      </span>
      .
    </p>
  );
}

function DetalleDiario({ dias }) {
  const conActivos = dias.filter((d) => d.activos?.length);
  if (!conActivos.length) return null;
  return (
    <details style={{ marginTop: 8 }}>
      <summary>Ver activo por activo, día por día</summary>
      {conActivos.map((d) => (
        <div key={d.fecha} style={{ marginTop: 10 }}>
          <strong>{fechaCorta(d.fecha)}</strong>
          <Tabla>
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
          </Tabla>
        </div>
      ))}
    </details>
  );
}

function MotorSemanal({ motor }) {
  const esRW = motor.id === "reverse_winners";
  return (
    <div className="activo-bloque">
      <h2>{motor.nombre}</h2>
      {esRW ? (
        <>
          <p>
            <strong>Semana:</strong>{" "}
            <span style={{ color: color(motor.pnl_semana_usd) }}>{usd(motor.pnl_semana_usd)}</span>.{" "}
            {motor.n_posiciones_abiertas} posiciones abiertas, efectivo ${motor.efectivo.toFixed(2)}. Se compró al cierre
            del día de la primera señal y no hay ventas hasta {motor.primeras_ventas_estimadas}, así que el P&amp;L
            de las compras recientes todavía es $0.00.
          </p>
          <TablaDias dias={motor.dias} />
          {motor.dias.some((d) => d.compradas > 0) && (
            <details style={{ marginTop: 8 }}>
              <summary>Ver las compras de la semana</summary>
              {motor.dias.filter((d) => d.compradas > 0).map((d) => (
                <p key={d.fecha}><strong>{fechaCorta(d.fecha)} ({d.compradas}):</strong> {d.tickers_comprados.join(", ")}</p>
              ))}
            </details>
          )}
        </>
      ) : (
        <>
          <LineaBuckets motor={motor} />
          <TablaDias dias={motor.dias} />
          <h3 style={{ margin: "16px 0 4px" }}>Activos comprados: ganancias y pérdidas</h3>
          <TablaActivos activos={motor.activos_semana} />
          <Cerradas activos={motor.activos_semana} />
          <DetalleDiario dias={motor.dias} />
        </>
      )}
    </div>
  );
}

function Candidatos({ candidatos }) {
  const { compra, vigilar_venta: vigilar } = candidatos;
  return (
    <div className="activo-bloque">
      <h2>Candidatos para la próxima semana</h2>
      <p className="pulsodash-vacio">
        Para echarles un ojo; no son órdenes ni recomendaciones. Nada se ejecuta solo por estar aquí.
      </p>
      <h3 style={{ margin: "10px 0 4px" }}>Posibles compras (señal de entrada activa y sin posición)</h3>
      {compra.length === 0 ? (
        <p className="pulsodash-vacio">Ninguna señal de entrada activa.</p>
      ) : (
        <Tabla>
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
        </Tabla>
      )}
      <h3 style={{ margin: "14px 0 4px" }}>Posibles ventas (señal de salida o a 3% o menos de su stop)</h3>
      {vigilar.length === 0 ? (
        <p className="pulsodash-vacio">Ninguna posición cerca de su stop.</p>
      ) : (
        <Tabla>
          <thead>
            <tr><th>Activo</th><th>Motor</th><th>Bucket</th><th>Cierre</th><th>Stop</th><th>Distancia al stop</th><th>Señal de salida</th></tr>
          </thead>
          <tbody>
            {vigilar.map((v) => (
              <tr key={`${v.motor}-${v.bucket}-${v.symbol}`}>
                <td>{v.symbol}</td>
                <td>{v.motor === "vivo" ? "IBKR" : "Paper"}</td>
                <td>{v.bucket}</td>
                <td>${v.cierre}</td>
                <td>${v.stop}</td>
                <td>{v.distancia_al_stop_pct}%</td>
                <td>{v.senal_de_salida ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </Tabla>
      )}
    </div>
  );
}

export default function ResumenSemanalCompleto({ resumen }) {
  const { mercado, motores, candidatos, notas_activos: notas } = resumen;
  const simbolos = [...new Set(motores.flatMap((m) => (m.activos_semana || []).map((a) => a.symbol)))].filter(
    (s) => notas[s]
  );
  return (
    <>
      <div className="activo-bloque">
        <h2>Qué pasó en el mercado</h2>
        <ul>
          {mercado.narrativa.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
        <Tabla>
          <thead>
            <tr><th>Día</th><th>S&amp;P 500</th><th>Nasdaq</th><th>Small caps</th><th>Oro</th><th>Qué pasó</th></tr>
          </thead>
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
        </Tabla>
        <p className="pulsodash-vacio">
          Referencias: SPY, QQQ, IJR y GLD. Cada día se compara con el cierre anterior.
        </p>
      </div>

      {motores.map((m) => <MotorSemanal key={m.id} motor={m} />)}

      <div className="activo-bloque">
        <h2>Qué explica cada activo, y qué no pude confirmar</h2>
        {simbolos.length ? (
          <ul>
            {simbolos.map((s) => <li key={s}><strong>{s}:</strong> {notas[s]}</li>)}
          </ul>
        ) : (
          <p className="pulsodash-vacio">Todavía no hay notas por activo para esta semana.</p>
        )}
      </div>

      <Candidatos candidatos={candidatos} />

      <div className="activo-bloque">
        <h2>Fuentes</h2>
        {mercado.fuentes.length ? (
          <ul>
            {mercado.fuentes.map((f) => (
              <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer">{f.titulo}</a></li>
            ))}
          </ul>
        ) : (
          <p className="pulsodash-vacio">Sin fuentes registradas.</p>
        )}
        <p className="pulsodash-vacio" style={{ marginTop: 12 }}>
          Generado el{" "}
          {new Date(resumen.generado).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Mexico_City" })}.
          Varias fuentes de noticias son agregadores con cifras que difieren entre sí; para precios exactos conviene
          confirmarlos en Yahoo Finance o un cierre oficial. Información, no recomendación de inversión; donde no hay
          causa confirmada, se dice.
        </p>
      </div>
    </>
  );
}
