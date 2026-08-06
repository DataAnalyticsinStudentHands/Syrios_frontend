import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const baseURL =
  process.env.VITE_STRAPI_URL ||
  process.env.VITE_API_URL?.replace(/\/api\/?$/, "");

if (!baseURL) {
  throw new Error("VITE_STRAPI_URL or VITE_API_URL must be configured");
}

const client = axios.create({
  baseURL,
  timeout: Number(process.env.VITE_API_TIMEOUT_MS || 10000),
});

const checks = [
  ["About Us", "/api/about-us"],
  ["3D Coin", "/api/coin-3d"],
  ["Download", "/api/download"],
  ["Evidence", "/api/explore-the-evidence?populate=image_icon"],
  ["Glossary home", "/api/glossary-home"],
  ["Glossary list", "/api/glossaries?pagination[pageSize]=1"],
  ["Landing page", "/api/landing-page"],
  ["Research", "/api/research-home"],
  ["Toolbox", "/api/tool-box"],
  ["Video library", "/api/videos?pagination[pageSize]=1"],
  ["Coin collection page", "/api/coin-collection-page"],
  ["Coin catalog", "/api/coin-collections?pagination[pageSize]=1"],
  ["CoinSort config", "/api/coin-sort"],
  ["Governing powers", "/api/governing-powers?pagination[pageSize]=1"],
  ["References", "/api/references?pagination[pageSize]=1"],
  ["Story home", "/api/story-home"],
  ["Stories", "/api/stories?pagination[pageSize]=1"],
  ["Timeline background", "/api/timelines"],
  ["Timeline information", "/api/timeline-info"],
];

const failures = [];

for (const [name, url] of checks) {
  try {
    const response = await client.get(url);
    const data = response.data?.data;
    const shape = Array.isArray(data)
      ? `collection(${data.length})`
      : data == null
        ? "empty"
        : "single";

    console.log(`PASS  ${name.padEnd(24)} HTTP ${response.status} ${shape}`);
  } catch (error) {
    const status = error.response?.status || error.code || "ERROR";
    failures.push({ name, status });
    console.error(`FAIL  ${name.padEnd(24)} ${status}`);
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    `${failures.length} API smoke check(s) failed: ${failures
      .map(({ name, status }) => `${name} (${status})`)
      .join(", ")}`
  );
  process.exitCode = 1;
} else {
  console.log("");
  console.log(`All ${checks.length} read-only API smoke checks passed.`);
}
