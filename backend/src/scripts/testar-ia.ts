import "dotenv/config";
import { gerarFlashcards } from "../services/flashcard.service";

const textoTeste = `
  A fotossíntese é o processo pelo qual as plantas produzem seu próprio alimento.
  Ocorre nos cloroplastos, usando luz solar, água e dióxido de carbono.
  A reação geral é: 6CO2 + 6H2O + luz → C6H12O6 + 6O2.
  Existem dois estágios principais: as reações luminosas e o ciclo de Calvin.
`;

async function main() {
  console.log("Testando Claude + Zod Schema...");
  const resultado = await gerarFlashcards(textoTeste, "Fotossíntese");
  console.log(JSON.stringify(resultado, null, 2));
}

main().catch(console.error);