const fs = require("fs");
const loadPrompt = require("./loadPrompt");

// archivo legacy
const componentPath = process.argv[2];

if (!componentPath) {
  console.log("❌ Debes pasar la ruta del componente");
  process.exit(1);
}

// leer componente
const componentCode = fs.readFileSync(componentPath, "utf-8");

// cargar prompt
const prompt = loadPrompt(
  "./prompts/migration/prompt-1-migration.md",
  { COMPONENT_CODE: componentCode }
);

// output
console.log("\n=== PROMPT GENERADO ===\n");
console.log(prompt);
