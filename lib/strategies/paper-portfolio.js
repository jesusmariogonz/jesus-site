/* Trae el snapshot del Paper Portfolio de EXP-005 directo del repo público
   pulso-research-lab (raw.githubusercontent.com) — sin credenciales
   cross-repo: el mismo patrón que ya usa /api/risk-meter con Yahoo Finance.
   El archivo lo genera y commitea `.github/workflows/exp005-paper-portfolio.yml`
   de ese repo, semanalmente. Si todavía no existe (primera corrida no se ha
   disparado o falló) o la fuente no responde, se devuelve null — la página
   que lo consuma decide cómo mostrar esa ausencia, nunca se inventa un dato. */

const URL_SNAPSHOT =
  "https://raw.githubusercontent.com/jesusmariogonz/pulso-research-lab/main/experiments/EXP-005-reverse-winners/run_paper_portfolio/paper_portfolio.json";

export async function getExp005PaperPortfolio() {
  try {
    const res = await fetch(URL_SNAPSHOT, { next: { revalidate: 21600 } }); // 6h
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.historial_diario?.length) return null;
    return data;
  } catch {
    return null;
  }
}
