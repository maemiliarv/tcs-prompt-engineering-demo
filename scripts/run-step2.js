const fs = require("fs");
const loadPrompt = require("./loadPrompt");

const componentPath = process.argv[2];

if (!componentPath) {
  console.log("❌ Debes pasar la ruta del componente migrado");
  process.exit(1);
}

// leer componente migrado
const componentCode = fs.readFileSync(componentPath, "utf-8");

// cargar prompt 2 (docs)
const prompt = loadPrompt(
  "./prompts/migration/prompt-2-docs.md",
  { COMPONENT_CODE: componentCode }
);

// output
console.log("\n=== PROMPT 2 (DOCUMENTACIÓN) ===\n");
console.log(prompt);