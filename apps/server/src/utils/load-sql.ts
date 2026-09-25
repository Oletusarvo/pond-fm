import { readFile } from "fs/promises";
import path from "path";
export async function loadSql(filename: string) {
  const filePath = path.join(process.cwd(), "./src/sql/", filename);
  const sql = await readFile(filePath, {
    encoding: "utf-8",
  });
  return sql;
}
