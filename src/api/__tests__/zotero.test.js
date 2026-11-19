import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const legacyKey = "legacy-zotero-secret-must-stay-out-of-requests";
const legacyBearer = "legacy-api-token-must-stay-out-of-requests";
let adapter;
let zoteroRequest;

beforeEach(async () => {
  vi.resetModules();
  vi.stubEnv("VITE_ZOTERO_GROUP_ID", "12345");
  vi.stubEnv("VITE_ZOTERO_API_URL", "https://api.zotero.org");
  vi.stubEnv("VITE_ZOTERO_API_VERSION", "3");
  vi.stubEnv("VITE_ZOTERO_API_KEY", legacyKey);
  vi.stubEnv("VITE_API_TOKEN", legacyBearer);
  vi.stubEnv("VITE_API_RETRY_DELAY_MS", "1");

  const { default: axios } = await import("axios");
  const createClient = axios.create.bind(axios);
  adapter = vi.fn(async (config) => ({
    data: [],
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  }));
  vi.spyOn(axios, "create").mockImplementation((config) =>
    createClient({ ...config, adapter })
  );

  ({ default: zoteroRequest } = await import("../zotero"));
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

const expectPublicRequest = (request) => {
  expect(request.method).toBe("get");
  expect(request.baseURL).toBe("https://api.zotero.org");
  expect(request.headers.get("Zotero-API-Version")).toBe("3");
  expect(request.headers.has("Zotero-API-Key")).toBe(false);
  expect(request.headers.has("Authorization")).toBe(false);
  expect(request.withCredentials).toBe(false);
  expect(JSON.stringify(request)).not.toContain(legacyKey);
  expect(JSON.stringify(request)).not.toContain(legacyBearer);
};

describe("public Zotero bibliography", () => {
  it.each([
    ["bibliography", "getAllitems", [], "/groups/12345/items", { include: "bib", sort: "creator", limit: "1000" }],
    ["top-level items", "getItemsTop", [], "/groups/12345/items/top", undefined],
    ["item", "getOneItem", ["ABCD1234"], "/groups/12345/items/ABCD1234", undefined],
    ["item bibliography", "getOneItemBib", ["ABCD1234"], "/groups/12345/items/ABCD1234", { format: "bib" }],
    ["item children", "getOneItemChildren", ["ABCD1234"], "/groups/12345/items/ABCD1234/children", { format: "json" }],
  ])("loads %s without credentials even when legacy secrets remain configured", async (_label, method, args, url, params) => {
    await zoteroRequest[method](...args);

    expect(adapter).toHaveBeenCalledTimes(1);
    const [request] = adapter.mock.calls[0];
    expect(request.url).toBe(url);
    expect(request.params).toEqual(params);
    expectPublicRequest(request);
  });

  it("keeps retries unauthenticated after a transient Zotero failure", async () => {
    adapter.mockImplementationOnce(async (config) => {
      const error = new Error("temporary Zotero outage");
      error.config = config;
      error.response = { status: 503 };
      throw error;
    });

    await zoteroRequest.getAllitems();

    expect(adapter).toHaveBeenCalledTimes(2);
    for (const [request] of adapter.mock.calls) {
      expectPublicRequest(request);
    }
  });
});
