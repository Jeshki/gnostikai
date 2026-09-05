import { readFileSync, unlinkSync } from "node:fs";

for (const file of process.argv.slice(2)) {
  const html = readFileSync(file, "utf8");
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
  const needle = ["Barbelo", "Yaldabaoth", "archons", "Derdekeas", "hidden sayings", "Pistis"].find((w) =>
    text.includes(w),
  );
  console.log("====", file, "chars", text.length, "hit", needle ?? "none");
  const i = text.search(/The teaching|Substance|Derdekeas|Barbelo|I, Zostrianos/);
  console.log(text.slice(i > -1 ? i : 400, (i > -1 ? i : 400) + 420));
  unlinkSync(file);
}
