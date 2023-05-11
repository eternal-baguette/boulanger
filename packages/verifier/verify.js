import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const verifieeContents = readdirSync(resolve("verifiee"), {
  withFileTypes: true,
});

for (const entry of verifieeContents) {
  if (entry.isFile() && entry.name === "donut") {
    process.exit(1);
  }
}
