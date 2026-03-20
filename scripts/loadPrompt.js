const fs = require("fs");

function loadPrompt(path, replacements) {
  let content = fs.readFileSync(path, "utf-8");

  for (const key in replacements) {
    content = content.replace(`{{${key}}}`, replacements[key]);
  }

  return content;
}

module.exports = loadPrompt;