import { describe, expect, it } from "vitest";
import {
  flattenStrapiEntity,
  normalizeStrapiData,
  normalizeStrapiResponse,
} from "../normalize";

describe("Strapi response normalization", () => {
  it("flattens a single Strapi entity without changing nested relations", () => {
    const relation = {
      data: { id: 2, attributes: { name: "Antioch" } },
    };

    expect(
      flattenStrapiEntity({
        id: 1,
        attributes: { title: "Coin", mint: relation },
      })
    ).toEqual({
      id: 1,
      title: "Coin",
      mint: relation,
    });
  });

  it("passes through values that are already flat", () => {
    const value = { id: 1, title: "Already normalized" };
    expect(flattenStrapiEntity(value)).toBe(value);
    expect(flattenStrapiEntity(null)).toBeNull();
  });

  it("normalizes collections and preserves null", () => {
    expect(
      normalizeStrapiData([
        { id: 1, attributes: { title: "One" } },
        { id: 2, attributes: { title: "Two" } },
      ])
    ).toEqual([
      { id: 1, title: "One" },
      { id: 2, title: "Two" },
    ]);
    expect(normalizeStrapiData(null)).toBeNull();
  });

  it("preserves the Axios response and Strapi metadata", () => {
    const response = {
      status: 200,
      config: { url: "/api/example" },
      data: {
        data: { id: 1, attributes: { title: "Example" } },
        meta: { pagination: { page: 1, pageCount: 1 } },
      },
    };

    expect(normalizeStrapiResponse(response)).toEqual({
      status: 200,
      config: { url: "/api/example" },
      data: {
        data: { id: 1, title: "Example" },
        meta: { pagination: { page: 1, pageCount: 1 } },
      },
    });
  });

  it("leaves non-Strapi payloads untouched", () => {
    const response = { data: [{ title: "External API result" }] };
    expect(normalizeStrapiResponse(response)).toBe(response);
  });
});
