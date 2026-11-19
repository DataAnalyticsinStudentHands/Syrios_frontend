import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("legacy public API client", () => {
  it.each([
    ["remote endpoint", "false", "http://localhost:1337/api", "https://example.com/api"],
    ["local endpoint", "true", "http://localhost:1337/api", "http://localhost:1337/api"],
    ["local fallback", "true", "", "https://example.com/api"],
  ])("uses the %s without exposing a configured legacy token", async (_label, localEnabled, localUrl, expectedBaseURL) => {
    vi.resetModules();
    const legacyToken = "obsolete-private-token-must-not-be-sent";
    vi.stubEnv("VITE_API_TOKEN", legacyToken);
    vi.stubEnv("VITE_API_URL", "https://example.com/api");
    vi.stubEnv("VITE_API_URL_LOCAL", localUrl);
    vi.stubEnv("VITE_ENABLE_LOCAL_API", localEnabled);
    vi.stubEnv("VITE_API_TIMEOUT_MS", "1250");

    const { makeRequest } = await import("./makeRequest");
    let request;
    await makeRequest.get("/public", {
      adapter: async (config) => {
        request = config;
        return { data: [], status: 200, statusText: "OK", headers: {}, config };
      },
    });

    expect(request.baseURL).toBe(expectedBaseURL);
    expect(request.url).toBe("/public");
    expect(request.timeout).toBe(1250);
    expect(request.headers.has("Authorization")).toBe(false);
    expect(request.withCredentials).toBe(false);
    expect(JSON.stringify(request)).not.toContain(legacyToken);
  });
});
