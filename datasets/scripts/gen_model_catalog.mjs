// 由 datasets/property_mapping.csv 生成 admetx-web/lib/model-catalog.ts
// 用法: node gen_model_catalog.mjs <csv> <out.ts>
// 注意: CSV 字段内不得含逗号(本脚本按逗号朴素分列)。
import fs from "node:fs";

const CSV = process.argv[2];
const OUT = process.argv[3];
if (!CSV || !OUT) {
  console.error("用法: node gen_model_catalog.mjs <csv> <out.ts>");
  process.exit(1);
}

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const lines = fs.readFileSync(CSV, "utf8").trim().split(/\r?\n/);
const head = lines[0].split(",");
const col = (n) => head.indexOf(n);
const iProp = col("optadmet_prop"),
  iCat = col("category"),
  iType = col("task_type"),
  iHas = col("has_dataset"),
  iSrc = col("dataset_source"),
  iNotes = col("notes");

const seen = new Set();
const items = lines.slice(1).map((l) => {
  const r = l.split(",");
  let s = slug(r[iProp]);
  while (seen.has(s)) s += "-x"; // 保证 slug 唯一
  seen.add(s);
  return {
    slug: s,
    name: r[iProp],
    category: r[iCat],
    type: r[iType] === "regression" ? "regression" : "classification",
    status: r[iHas] === "yes" ? "dataset" : "placeholder",
    datasetSource: r[iSrc] || "",
    description: r[iNotes] || "",
  };
});

const ts = `// AUTO-GENERATED from datasets/property_mapping.csv — do not edit by hand.
// 重新生成: node datasets/scripts/gen_model_catalog.mjs datasets/property_mapping.csv admetx-web/lib/model-catalog.ts
export type ModelCard = {
  slug: string; name: string; category: string;
  type: 'classification' | 'regression';
  status: 'dataset' | 'placeholder'; datasetSource?: string; description: string;
};

export const MODELS: ModelCard[] = ${JSON.stringify(items, null, 2)};
`;

fs.writeFileSync(OUT, ts);
console.log(`wrote ${items.length} models -> ${OUT}`);
const nData = items.filter((m) => m.status === "dataset").length;
console.log(`  dataset=${nData} placeholder=${items.length - nData}`);
