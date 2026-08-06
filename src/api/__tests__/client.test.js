import { beforeEach, describe, expect, it, vi } from "vitest";
import apiClient from "../client";
import { clearCache } from "../cache";

const responseFor = (config, data) => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config,
});

const serverError = (config) => {
  const error = new Error("server error");
  error.config = config;
  error.response = {
    status: 500,
    data: null,
    headers: {},
    config,
  };
  return error;
};

describe("unified API client", () => {
  beforeEach(() => {
    clearCache();
    vi.restoreAllMocks();
  });

  it("normalizes only when the request opts in", async () => {
    const adapter = async (config) =>
      responseFor(config, {
        data: { id: 1, attributes: { title: "Normalized" } },
      });

    const normalized = await apiClient.get("/api/normalized-test", {
      adapter,
      meta: { normalize: true },
    });
    const raw = await apiClient.get("/api/raw-test", {
      adapter,
      meta: { normalize: false },
    });

    expect(normalized.data.data).toEqual({ id: 1, title: "Normalized" });
    expect(raw.data.data).toEqual({
      id: 1,
      attributes: { title: "Normalized" },
    });
  });

  it("serves repeated cached GET requests without a second network call", async () => {
    const adapter = vi.fn(async (config) =>
      responseFor(config, {
        data: { id: 1, attributes: { title: "Cached" } },
      })
    );
    const config = {
      adapter,
      meta: {
        useCache: true,
        cacheTtlMs: 60_000,
        normalize: true,
      },
    };

    const first = await apiClient.get("/api/cache-test", config);
    const second = await apiClient.get("/api/cache-test", config);

    expect(adapter).toHaveBeenCalledTimes(1);
    expect(second.data).toEqual(first.data);
  });

  it("retries transient GET failures", async () => {
    let attempts = 0;
    const adapter = async (config) => {
      attempts += 1;
      if (attempts === 1) throw serverError(config);
      return responseFor(config, { data: [] });
    };

    const response = await apiClient.get("/api/retry-test", { adapter });

    expect(response.status).toBe(200);
    expect(attempts).toBe(2);
  });

  it("does not retry writes that could be duplicated", async () => {
    let attempts = 0;
    const adapter = async (config) => {
      attempts += 1;
      throw serverError(config);
    };

    await expect(
      apiClient.post("/api/write-test", { data: { email: "test@example.com" } }, { adapter })
    ).rejects.toThrow("server error");
    expect(attempts).toBe(1);
  });

  it("keeps cache entries distinct by query parameters", async () => {
    const adapter = vi.fn(async (config) =>
      responseFor(config, { data: [{ id: config.params.page }] })
    );
    const meta = { useCache: true, cacheTtlMs: 60_000 };

    const pageOne = await apiClient.get("/api/pages", {
      adapter,
      params: { page: 1 },
      meta,
    });
    const pageTwo = await apiClient.get("/api/pages", {
      adapter,
      params: { page: 2 },
      meta,
    });

    expect(adapter).toHaveBeenCalledTimes(2);
    expect(pageOne.data.data[0].id).toBe(1);
    expect(pageTwo.data.data[0].id).toBe(2);
  });
});
