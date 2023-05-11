import { readdirSync } from "node:fs";

const verifieeContents = readdirSync("verifiee", { withFileTypes: true });

for (const entry of verifieeContents) {
  if (entry.isFile() && entry.name === "donut") {
    process.exit(1);
  }
}
