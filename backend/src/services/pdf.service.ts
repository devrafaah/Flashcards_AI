import { PDFParse } from 'pdf-parse'

export async function extrairTextoPDF(buffer: Buffer): Promise<string> {
  const data = new PDFParse(new Uint8Array(buffer));
  const result = await data.getText();
  return result.text;
}