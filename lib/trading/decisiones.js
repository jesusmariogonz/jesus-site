/* Bitácora de decisiones (ADR) del proyecto de trading algorítmico,
   traducida del repo algo_trading_platform (docs/adr/0001-0019) para
   publicarse en /pulso-mercado/trading/bitacora. Cada entrada resume
   el ADR real correspondiente — nunca se agrega una cifra, fecha o
   hallazgo que no esté documentado en el ADR original. Las que
   quedaron "superseded" se mantienen (no se borran decisiones
   pasadas), marcadas como tal. */

export const DECISIONES = [
  {
    id: "0001",
    titulo: "Proveedor de datos y broker para la Fase 0",
    estado: "Aceptado",
    resumen:
      "eToro no ofrece API pública de trading retail, así que se descartó. Se eligió yfinance (gratuito) para datos de investigación/backtest, Alpaca como broker objetivo para cuando exista ejecución real, y la librería ta en vez de TA-Lib para indicadores técnicos.",
  },
  {
    id: "0002",
    titulo: "Dónde vive el dashboard privado",
    estado: "Propuesto",
    resumen:
      "El motor de trading (Python/Postgres) y jgonzalez.app (Next.js/Vercel) son dos sistemas separados que se comunican por API, nunca un monolito — Vercel serverless no sostiene procesos de larga duración ni cron confiable para jobs pesados.",
  },
  {
    id: "0003",
    titulo: "Definición de los 4 buckets y regla de escalamiento",
    estado: "Aceptado (parcial)",
    resumen:
      "Definió el reparto original por horizonte/riesgo (Largo Plazo, Mediano Plazo, Riesgo Alto, Muy Alta Volatilidad) y una regla de escalamiento de Riesgo Alto condicionada al rendimiento total del portafolio — esa regla quedó documentada pero sin implementar automáticamente, para no fabricar un número de rendimiento sin valuación real de portafolio.",
  },
  {
    id: "0004",
    titulo: "Bucket Muy Alta Volatilidad (criptomonedas)",
    estado: "Aceptado, con hallazgo negativo",
    resumen:
      "Se construyó el bucket de cripto (datos vía Kraken, benchmark BTC en vez de SPY) pero el backtest con las mismas reglas de acciones dio resultados negativos en la mayoría de los símbolos (BTC -46.9% en Trend Following; SOL -54%, XRP -59% en Momentum/Breakout) — se documentó el hallazgo sin ocultarlo, en vez de forzar el bucket a verse bien.",
  },
  {
    id: "0005",
    titulo: "Quant Portfolios: 3 productos con identidad propia",
    estado: "Superseded por ADR 0009",
    resumen:
      "Se construyó un segundo modelo paralelo (Conservative Alpha / Balanced Growth / Aggressive Momentum) con su propio Risk Engine, para compararlo contra el modelo de buckets. Se conserva como registro histórico aunque el código ya no existe en el repo.",
  },
  {
    id: "0006",
    titulo: "Elimina el bucket Muy Alta Volatilidad (cripto)",
    estado: "Aceptado",
    resumen:
      "En las 3 ventanas de tiempo probadas, eliminar cripto mejoró el resultado total sin excepción (ej. +29.92% con cripto vs. +34.10% sin cripto, en 34 meses). El 10% de capital se repartió equitativamente entre los 3 buckets restantes (43.33/33.33/23.33).",
  },
  {
    id: "0007",
    titulo: "Trailing stop + cash ocioso invertido en el benchmark",
    estado: "Aceptado",
    resumen:
      "El stop pasó de fijo en el precio de entrada a recalcularse cada día (solo sube). El cash sin posición se invierte en SPY en vez de quedarse parado — el cambio de mayor impacto medido en todo el proyecto: +0.23% a +17.75% en una ventana de 22 meses.",
  },
  {
    id: "0008",
    titulo: "Risk Engine real (circuit breakers) en los 3 buckets",
    estado: "Aceptado",
    resumen:
      "Se llevó la misma mecánica de los Quant Portfolios a los buckets: límite de pérdida diaria (bloquea nuevas compras el resto del día) y umbral de drawdown de revisión (suspende el bucket completo hasta reautorización manual, sin liquidar nada).",
  },
  {
    id: "0009",
    titulo: "Elimina los Quant Portfolios",
    estado: "Aceptado",
    resumen:
      "La comparación planeada entre ambos modelos nunca se completó — se decidió eliminar los Quant Portfolios una vez que el modelo de buckets recibió las mismas mejoras (trailing stop, cash-en-benchmark, circuit breakers reales) que ya tenían.",
  },
  {
    id: "0010",
    titulo: "Amplía el universo de los 3 buckets",
    estado: "Aceptado",
    resumen:
      "De 32 a 117 símbolos en dos rondas: 99 → 235 → 309 operaciones cerradas, +30.50% → +31.14% → +32.22% de retorno. Un trailing stop más ancho en Riesgo Alto y un filtro de régimen de mercado se probaron y se descartaron (ambos empeoraron el resultado).",
  },
  {
    id: "0011",
    titulo: "Fricción real en el motor + amplía Riesgo Alto a 45 símbolos",
    estado: "Aceptado",
    resumen:
      "Se agregó comisión + slippage real (0.05%+0.05%) al motor de paper trading, que antes operaba sin fricción a diferencia del backtest formal. Con Riesgo Alto ampliado a 45 símbolos: +32.76% neto en 336 operaciones — cifra superada después por ADR 0015/0016.",
  },
  {
    id: "0012",
    titulo: "Aumenta el riesgo por operación + sizing sobre equity actual",
    estado: "Aceptado, con corrección de datos",
    resumen:
      "Riesgo por operación subió (1%→2% en Largo/Mediano, 2%→3% en Riesgo Alto) y el sizing pasó a calcularse sobre equity actual, no capital fijo. Se encontró y corrigió un problema real de reproducibilidad: yfinance revisa precios ajustados entre descargas, así que comparar variantes requiere una descarga única y congelada. Cifra corregida: +11.41% → +22.07% de retorno, 7.44% → 13.63% de drawdown.",
  },
  {
    id: "0013",
    titulo: "Descarta semiconductores/defensa; oro como cash holder queda pendiente",
    estado: "Aceptado (descarte) / Pendiente (oro)",
    resumen:
      "Agregar TSM, SMH, GD, NOC, LHX al universo bajó el retorno sin reducir el drawdown — descartado. Oro (GLD) como destino del cash ocioso sí mostró un trade-off real (menos drawdown, menos retorno) pero se dejó como decisión pendiente del apetito de riesgo del usuario.",
  },
  {
    id: "0014",
    titulo: "Cash ocioso: blend 50% SPY / 50% oro (GLD)",
    estado: "Aceptado",
    resumen:
      "Se eligió un punto intermedio entre 100% SPY y 100% GLD. Durante el despliegue se encontró y corrigió un bug real: reinterpretar bench_shares guardado en acciones de SPY como unidades del nuevo índice sintético sin migrar hizo que el equity de Riesgo Alto se desplomara -75% en un tick, sin que pasara nada en el mercado — corregido preservando el valor en dólares exacto.",
  },
  {
    id: "0015",
    titulo: "Validación oficial de la configuración actual de producción",
    estado: "Aceptado — reemplaza cifras de ADR 0011-0013",
    resumen:
      "Varios números de retorno reportados en ADRs anteriores correspondían a configuraciones o momentos de descarga distintos, generando confusión. Cifra oficial única con datos congelados: +31.07% neto en 36 meses (≈9.44% anual compuesto), 13.83% de drawdown máximo, 216 operaciones.",
  },
  {
    id: "0016",
    titulo: "Amplía el universo de Largo Plazo de 13 a 26 ETFs",
    estado: "Aceptado — reemplaza cifra de ADR 0015",
    resumen:
      "Largo Plazo era el bucket más débil (+8.40%) pese a recibir más capital. Al ampliar su universo con diversidad real (internacional, renta fija de distintos tipos, commodities): Largo Plazo +8.40% → +15.17%, y por primera vez en el proyecto el drawdown total bajó junto con el retorno (+31.07%→+34.00%, 13.83%→12.91%).",
  },
  {
    id: "0017",
    titulo: "Red de seguridad para saltos de equity sospechosos",
    estado: "Aceptado",
    resumen:
      "Tras el bug de ADR 0014, se agregó un test de regresión que verifica que bench_shares preserve su valor en dólares, y una alerta en tiempo de ejecución que marca (sin bloquear el pipeline) cualquier cambio de equity superior a 25% en un solo día — un umbral muy por encima de cualquier movimiento real de mercado documentado en el proyecto.",
  },
  {
    id: "0018",
    titulo: "Descarta Donchian Breakout y Risk Parity",
    estado: "Aceptado (descarte)",
    resumen:
      "Ambos candidatos empeoraron el retorno sin mejorar el drawdown. Donchian compitió por el mismo cupo de símbolos que Momentum/Breakout y le ganó la mayoría de las entradas, diluyendo la estrategia que ya funcionaba. Risk Parity sobre-asignó a Largo Plazo (el bucket más débil) por confundir baja volatilidad con buena relación riesgo/retorno — en el camino se encontró y corrigió un bug de rebalanceo que inflaba el resultado a +103,254% antes de la corrección.",
  },
  {
    id: "0019",
    titulo: "Agrega Mean Reversion RSI(2) como 4to bucket (35%)",
    estado: "Superseded por ADR 0027",
    resumen:
      "A diferencia de Donchian/Risk Parity, se midió primero aislado: correlación de 0.142 con el resto del sistema, evidencia real de diversificación. Probando distintos pesos de capital (15/25/35/50%), 35% fue el punto óptimo medido: +43.61% de retorno con 11.75% de drawdown. Durante la migración de capital real se encontró y corrigió un bug que suspendió los 3 buckets existentes por un falso positivo de drawdown. Esta decisión se revirtió después (ver ADR 0026/0027) cuando una validación más rigurosa encontró que no sostenía su propia evidencia.",
  },
  {
    id: "0020",
    titulo: "El blend SPY/GLD se avanza incrementalmente, no se recompone",
    estado: "Aceptado",
    resumen:
      "El índice sintético del cash ocioso (blend 50% SPY / 50% oro) se recalculaba desde cero cada corrida, lo que lo exponía a revisiones retroactivas de precios de yfinance — una revisión así distorsionó el índice un ~25.6% completo en un solo día. Se corrigió para avanzar el precio del blend de forma incremental (día sobre día), nunca recomponiendo el histórico completo.",
  },
  {
    id: "0021",
    titulo: "yfinance trata `end` como exclusivo: el cierre de hoy nunca se descargaba",
    estado: "Aceptado",
    resumen:
      "Bug anterior a todo lo demás documentado en estos ADRs: la descarga de datos nunca incluía el cierre del día en curso, sin importar a qué hora corriera la rutina — la corrida de la tarde llevaba meses comportándose igual que la de la mañana, un día atrás, sin que nada lo señalara. Corregido ajustando el rango de fechas de la descarga.",
  },
  {
    id: "0022",
    titulo: "Adapter real de IBKR vía IBC",
    estado: "Aceptado",
    resumen:
      "Construye la integración real (no simulada) contra Interactive Brokers, usando IBC para automatizar el login de IB Gateway sin intervención manual — la base técnica para el motor de paper trading en vivo (ADR 0023).",
  },
  {
    id: "0023",
    titulo: "Motor de paper trading EN VIVO, en paralelo al simulado",
    estado: "Aceptado",
    resumen:
      "Agrega un segundo motor que manda órdenes reales a la cuenta paper de IBKR (fill real, no precio de cierre asumido), reusando la misma lógica de señales que el motor simulado, con estado completamente separado para no mezclar históricos. Corre en paralelo al motor simulado que alimenta esta página — son dos sistemas distintos validando lo mismo desde ángulos diferentes.",
  },
  {
    id: "0024",
    titulo: "Corrige la distorsión de ~25.6% heredada del bug de ADR 0020",
    estado: "Aceptado",
    resumen:
      "El fix de ADR 0020 evitó que el bug volviera a pasar, pero no reparó el daño ya escrito en el estado de producción — dos buckets mostraban -23.75% de retorno el mismo día que debían estar cerca de 0%. Se reconstruyó el equity correcto usando el único punto de anclaje verificado (capital inicial) y el precio del blend ya corregido: el retorno real de ese período resultó ser +3.08%, no -23.75%.",
  },
  {
    id: "0025",
    titulo: "Barrido de 11+ estrategias nuevas: se descarta Bollinger %B",
    estado: "Aceptado (descarte)",
    resumen:
      "De un catálogo de ~12 estrategias candidatas probadas aisladas, Bollinger %B destacó en el backtest de muestra completa (+104.87%). Un walk-forward rolling de 5 ventanas expuso el problema real: 2 de 5 ventanas perdieron dinero fuera de muestra (Sharpe OOS promedio 1.076, con una ventana en -0.81). Se descartó por inconsistencia temporal, no por el número agregado.",
  },
  {
    id: "0026",
    titulo: "Alerta: Mean Reversion RSI(2) no sostiene walk-forward rolling",
    estado: "Alerta — resuelta en ADR 0027",
    resumen:
      "Al auditar Mean Reversion RSI(2) (ya corriendo con capital real) con la misma metodología que acababa de descartar Bollinger %B, el resultado fue peor: Sharpe OOS promedio -0.032, 2 de 5 ventanas con pérdida, y ningún peso de asignación mejoró el portafolio de control. Se encontró además que el +47.90% del backtest original no era reproducible (+19.09% al repetirlo). Se dejó la alerta documentada sin tocar producción hasta investigar la causa.",
  },
  {
    id: "0027",
    titulo: "Elimina Mean Reversion RSI(2), restaura los 3 buckets originales",
    estado: "Aceptado — configuración vigente",
    resumen:
      "Resolución de la alerta de ADR 0026: se elimina el bucket Mean Reversion de ambos motores (simulado y en vivo) y se restaura el split original 43.33/33.33/23.33 entre los 3 buckets de siempre. El código de la estrategia se conserva sin borrar, por si aparece evidencia mejor en el futuro, pero no se usa en producción con la evidencia actual.",
  },
];

export const DECISIONES_ULTIMA_ACTUALIZACION = "Basado en docs/adr/0001 a 0027 de algo_trading_platform.";
