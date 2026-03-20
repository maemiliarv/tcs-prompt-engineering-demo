const fs = require("fs");
const loadPrompt = require("./loadPrompt");

const componentPath = process.argv[2];

if (!componentPath) {
  console.log("❌ Debes pasar la ruta del componente documentado");
  process.exit(1);
}

// leer componente documentado
const componentCode = fs.readFileSync(componentPath, "utf-8");

// cargar prompt 3 (tests)
const prompt = loadPrompt(
  "./prompts/migration/prompt-3-tests.md",
  { COMPONENT_CODE: componentCode }
);

// output
console.log("\n=== PROMPT 3 (TESTS) ===\n");
console.log(prompt);