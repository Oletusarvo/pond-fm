import Handlebars from "handlebars";
import { readFile } from "fs/promises";
import path from "path";
import { readFileSync } from "fs";

export async function loadTemplateSource(filename: string) {
  const templateSource = await readFile(path.join(process.cwd(), filename), {
    encoding: "utf-8",
  });

  return templateSource;
}

export async function applyInlineCss(templateConfig: any) {
  const cssSource = readFileSync(path.join(process.cwd(), "./src/html-templates/styles/main.css"), {
    encoding: "utf-8",
  });
  return {
    ...templateConfig,
    inlineStyle: `<style>${cssSource}</style>`,
  };
}
