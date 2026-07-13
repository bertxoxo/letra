import { readFileSync, writeFileSync } from "fs";
let f = readFileSync("src/components/home/LetterTicker.tsx", "utf8");
f = f.replace(`          {card.category && (\n            <span className="lt-card-tag">{card.category}</span>\n          )}\n        </div>`, `        </div>`);
f = f.replace(`  .lt-card-tag {\n    font-size: 0.6rem;\n    letter-spacing: 0.12em;\n    text-transform: uppercase;\n    color: #aaa;\n    margin-top: 6px;\n  }`, `  .lt-card-top-row {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    margin-bottom: 8px;\n  }\n  .lt-card-tag {\n    font-size: 0.6rem;\n    letter-spacing: 0.12em;\n    text-transform: uppercase;\n    color: #aaa;\n  }`);
writeFileSync("src/components/home/LetterTicker.tsx", f, "utf8");
console.log("Done");
