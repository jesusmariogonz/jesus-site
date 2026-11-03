import ExcelJS from "exceljs";
import paperTrading from "@/lib/paper-trading-snapshot.json";

/* Exporta a Excel el historial completo de paper trading, en USD
   (la moneda nativa del motor — ver lib/paper-trading-snapshot.json),
   sin la conversión a MXN que usa la página pública, para que las
   cifras sean exactamente las que exporta el motor, sin redondeos de
   una capa de visualización encima. Tres hojas:
   - Historial diario: un renglón por bucket por fecha procesada.
   - Operaciones cerradas: el historial completo de cierres.
   - Posiciones abiertas (hoy): snapshot de lo abierto al momento de
     generar el archivo — no existe un historial diario de QUÉ estaba
     abierto en fechas pasadas en el snapshot del motor, así que esta
     hoja es explícitamente "a hoy", no histórica. */

const BUCKET_LABELS = {
  largo_plazo: "Largo Plazo",
  mediano_plazo: "Mediano Plazo",
  riesgo_alto: "Riesgo Alto",
  mean_reversion: "Mean Reversion",
};

export async function GET() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "jgonzalez.app — Trading Algorítmico";
  workbook.created = new Date();

  const buckets = paperTrading?.buckets || {};

  // --- Hoja 1: Historial diario ---
  const hojaDiario = workbook.addWorksheet("Historial diario");
  hojaDiario.columns = [
    { header: "Fecha", key: "fecha", width: 12 },
    { header: "Bucket", key: "bucket", width: 16 },
    { header: "Equity (USD)", key: "equity", width: 14 },
    { header: "Cash (USD)", key: "cash", width: 14 },
    { header: "P&L no realizado (USD)", key: "unrealized_pnl", width: 20 },
    { header: "Posiciones abiertas", key: "open_count", width: 16 },
    { header: "Cerradas hoy", key: "closed_today", width: 12 },
    { header: "P&L realizado hoy (USD)", key: "realized_pnl_today", width: 20 },
    { header: "Retorno acumulado %", key: "cumulative_return_pct", width: 18 },
    { header: "Drawdown %", key: "drawdown_pct", width: 12 },
    { header: "Circuit breaker hoy", key: "breaker", width: 16 },
    { header: "Suspendido", key: "suspendido", width: 12 },
  ];
  Object.entries(buckets).forEach(([key, bucket]) => {
    (bucket.daily_history || []).forEach((h) => {
      hojaDiario.addRow({
        fecha: h.date,
        bucket: BUCKET_LABELS[key] || key,
        equity: h.equity,
        cash: h.cash,
        unrealized_pnl: h.unrealized_pnl,
        open_count: h.open_count,
        closed_today: h.closed_today,
        realized_pnl_today: h.realized_pnl_today,
        cumulative_return_pct: h.cumulative_return_pct,
        drawdown_pct: h.drawdown_pct,
        breaker: h.daily_loss_breaker_tripped ? "Sí" : "No",
        suspendido: h.suspended ? "Sí" : "No",
      });
    });
  });
  hojaDiario.getRow(1).font = { bold: true };

  // --- Hoja 2: Operaciones cerradas ---
  const hojaCerradas = workbook.addWorksheet("Operaciones cerradas");
  hojaCerradas.columns = [
    { header: "Símbolo", key: "symbol", width: 10 },
    { header: "Bucket", key: "bucket", width: 16 },
    { header: "Estrategia", key: "strategy", width: 24 },
    { header: "Fecha entrada", key: "entry_date", width: 14 },
    { header: "Precio entrada (USD)", key: "entry_price", width: 18 },
    { header: "Fecha salida", key: "exit_date", width: 14 },
    { header: "Precio salida (USD)", key: "exit_price", width: 18 },
    { header: "Acciones", key: "shares", width: 10 },
    { header: "P&L (USD)", key: "pnl", width: 12 },
    { header: "Rendimiento %", key: "pnl_pct", width: 14 },
    { header: "Motivo", key: "reason", width: 14 },
  ];
  Object.entries(buckets).forEach(([key, bucket]) => {
    (bucket.closed_positions || []).forEach((p) => {
      hojaCerradas.addRow({
        symbol: p.symbol,
        bucket: BUCKET_LABELS[key] || key,
        strategy: p.strategy,
        entry_date: p.entry_date,
        entry_price: p.entry_price,
        exit_date: p.exit_date,
        exit_price: p.exit_price,
        shares: p.shares,
        pnl: p.pnl,
        pnl_pct: p.pnl_pct,
        reason: p.reason === "stop_hit" ? "Stop" : "Señal",
      });
    });
  });
  hojaCerradas.getRow(1).font = { bold: true };

  // --- Hoja 3: Posiciones abiertas (snapshot de hoy) ---
  const hojaAbiertas = workbook.addWorksheet("Posiciones abiertas (hoy)");
  hojaAbiertas.columns = [
    { header: "Símbolo", key: "symbol", width: 10 },
    { header: "Bucket", key: "bucket", width: 16 },
    { header: "Estrategia", key: "strategy", width: 24 },
    { header: "Fecha entrada", key: "entry_date", width: 14 },
    { header: "Precio entrada (USD)", key: "entry_price", width: 18 },
    { header: "Precio actual (USD)", key: "current_price", width: 18 },
    { header: "Stop (USD)", key: "stop_price", width: 14 },
    { header: "Acciones", key: "shares", width: 10 },
    { header: "P&L no realizado (USD)", key: "unrealized_pnl", width: 20 },
    { header: "Rendimiento no realizado %", key: "unrealized_pnl_pct", width: 22 },
  ];
  Object.entries(buckets).forEach(([key, bucket]) => {
    (bucket.open_positions || []).forEach((p) => {
      hojaAbiertas.addRow({
        symbol: p.symbol,
        bucket: BUCKET_LABELS[key] || key,
        strategy: p.strategy,
        entry_date: p.entry_date,
        entry_price: p.entry_price,
        current_price: p.current_price ?? null,
        stop_price: p.stop_price,
        shares: p.shares,
        unrealized_pnl: p.unrealized_pnl ?? null,
        unrealized_pnl_pct: p.unrealized_pnl_pct ?? null,
      });
    });
  });
  hojaAbiertas.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  const fecha = paperTrading?.generated_at?.slice(0, 10) || new Date().toISOString().slice(0, 10);

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="trading-algoritmico-historial-${fecha}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
