import { readdirSync } from "node:fs";
import { join } from "node:path";

const verifieeContents = readdirSync(join(process.env.GITHUB_WORKSPACE, "verifiee"), {
  withFileTypes: true,
});

for (const entry of verifieeContents) {
  if (entry.isFile() && entry.name === "donut") {
    process.exit(1);
  }
}
