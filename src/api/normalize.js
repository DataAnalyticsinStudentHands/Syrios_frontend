/**
 * normalize.js — Post Vite Updates (2026)
 *
 * Purpose:
 * Provides shared response normalization helpers for Strapi responses.
 *
 * Goals:
 * - Reduce repeated `.data.data.attributes` access in components
 * - Preserve original Axios response when needed
 * - Support gradual rollout endpoint-by-endpoint
 *
 * Notes:
 * - Strapi v4 commonly wraps data as:
 *   response.data.data
 * - Single entities often include:
 *   response.data.data.attributes
 * - Collections often include:
 *   response.data.data[] with nested attributes
 *
 * Future Improvements:
 * - Add deeper media normalization
 * - Add relation flattening helpers
 * - Add optional legacy compatibility mode
 */

/**
 * Flatten a Strapi entity:
 * { id, attributes: { ... } } -> { id, ...attributes }
 */
export const flattenStrapiEntity = (entity) => {
  if (!entity || typeof entity !== "object") return entity;
  if (!("attributes" in entity)) return entity;

  return {
    id: entity.id,
    ...entity.attributes,
  };
};

/**
 * Normalize a Strapi data payload
 * Handles:
 * - single entity
 * - entity arrays
 * - null
 */
export const normalizeStrapiData = (data) => {
  if (data == null) return data;

  if (Array.isArray(data)) {
    return data.map(flattenStrapiEntity);
  }

  return flattenStrapiEntity(data);
};

/**
 * Normalize a full Axios Strapi response while preserving top-level metadata
 */
export const normalizeStrapiResponse = (response) => {
  const payload = response?.data;

  if (!payload || typeof payload !== "object" || !("data" in payload)) {
    return response;
  }

  return {
    ...response,
    data: {
      ...payload,
      data: normalizeStrapiData(payload.data),
    },
  };
};