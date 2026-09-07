import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import aboutUsRequest from "../about-us";
import { clearCache } from "../cache";
import apiClient, { LOCAL_STRAPI_ENABLED, LOCAL_STRAPI_URL } from "../client";
import coin3DRequest from "../coin-3d";
import coinCollectionsRequest from "../coin-collections";
import coinSortRequest from "../coin-sort";
import downloadRequest from "../download";
import evidenceRequest from "../evidence";
import glossaryRequest from "../glossary";
import landingRequest from "../landing";
import referenceRequest from "../reference";
import researchRequest from "../research";
import storyRequest from "../story";
import submissionRequest from "../submissions";
import timelineRequest from "../timeline";
import toolboxRequest from "../toolbox";
import videoLibraryRequest from "../video-library";

const originalAdapter = apiClient.defaults.adapter;
const requests = [];

const adapter = vi.fn(async (config) => {
  requests.push(config);
  return {
    data: {
      data: {
        id: 1,
        attributes: { title: "Mock Strapi response" },
      },
      meta: {},
    },
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  };
});

const lastRequest = () => requests.at(-1);

beforeEach(() => {
  requests.length = 0;
  adapter.mockClear();
  clearCache();
  apiClient.defaults.adapter = adapter;
});

afterAll(() => {
  apiClient.defaults.adapter = originalAdapter;
});

describe("Strapi endpoint contracts", () => {
  const readCases = [
    ["About Us", () => aboutUsRequest.aboutUsFind(), /^\/api\/about-us$/],
    ["3D Coin", () => coin3DRequest.coin3DFind(), /^\/api\/coin-3d$/],
    ["Download", () => downloadRequest.downloadFind(), /^\/api\/download$/],
    [
      "Evidence",
      () => evidenceRequest.evidenceFind(),
      /^\/api\/explore-the-evidence\?/,
    ],
    ["Glossary home", () => glossaryRequest.glossaryHomeFind(), /^\/api\/glossary-home$/],
    ["Glossary list", () => glossaryRequest.glossaryFind(), /^\/api\/glossaries\?/],
    [
      "Glossary search",
      () => glossaryRequest.glossarySearch("coin"),
      /^\/api\/glossaries\?/,
    ],
    [
      "Glossary term",
      () => glossaryRequest.glossaryFindByTerm("coin"),
      /^\/api\/glossaries\?/,
    ],
    ["Landing page", () => landingRequest.landingdFind(), /^\/api\/landing-page$/],
    ["Research", () => researchRequest.researchFind(), /^\/api\/research-home$/],
    ["Toolbox", () => toolboxRequest.toolboxFind(), /^\/api\/tool-box$/],
    ["Video library", () => videoLibraryRequest.videoFind(), /^\/api\/videos$/],
    [
      "Coin collection page",
      () => coinCollectionsRequest.coinCollectionPage(),
      /^\/api\/coin-collection-page\?/,
    ],
    [
      "Coin detail",
      () => coinCollectionsRequest.fetchOne(7),
      /^\/api\/coin-collections\/7\?/,
    ],
    [
      "Coin catalog",
      () => coinCollectionsRequest.coinCollection(),
      /^\/api\/coin-collections\?/,
    ],
    [
      "Coin map catalog",
      () => coinCollectionsRequest.fetchLocatedForMap(),
      /^\/api\/coin-collections\?/,
    ],
    [
      "CoinSort catalog",
      () => coinCollectionsRequest.fetchAllForCoinSort(),
      /^\/api\/coin-collections\?/,
    ],
    [
      "CoinSort config",
      () => coinCollectionsRequest.fetchCoinSortConfig(),
      /^\/api\/coin-sort\?populate=\*$/,
    ],
    [
      "Governing powers",
      () => coinCollectionsRequest.fetchGoverningPowers(),
      /^\/api\/governing-powers$/,
    ],
    ["Legacy CoinSort list", () => coinSortRequest.coinFectAll(), /^\/api\/coins\?/],
    ["Legacy CoinSort spotlight", () => coinSortRequest.coinStotlight(), /^\/api\/coins\?/],
    ["Legacy CoinSort config", () => coinSortRequest.coinSortFind(), /^\/api\/coin-sort$/],
    ["References", () => referenceRequest.referenceFind(), /^\/api\/references$/],
    ["Reference detail", () => referenceRequest.referenceFindone(9), /^\/api\/references\/9$/],
    ["Story home", () => storyRequest.storyHomeFind(), /^\/api\/story-home$/],
    ["Stories", () => storyRequest.storyFind(), /^\/api\/stories\?env=/],
    ["Story detail", () => storyRequest.storyFindOne(5), /^\/api\/stories\/5$/],
    ["Timeline background", () => timelineRequest.background(), /^\/api\/timelines$/],
    ["Timeline information", () => timelineRequest.info(), /^\/api\/timeline-info\?/],
  ];

  it.each(readCases)("%s keeps its GET route", async (_name, call, expectedUrl) => {
    await call();
    expect(lastRequest().method).toBe("get");
    expect(lastRequest().url).toMatch(expectedUrl);
  });

  it.each([
    ["contact", () => submissionRequest.contact({ email: "contact@example.com" }), "/api/user-contact-us"],
    ["download", () => submissionRequest.download({ email: "download@example.com" }), "/api/user-download"],
    ["subscription", () => submissionRequest.subscription({ email: "subscribe@example.com" }), "/api/user-subscription"],
  ])("%s submissions keep the Strapi data envelope", async (_name, call, url) => {
    await call();
    const request = lastRequest();
    expect(request.method).toBe("post");
    expect(request.url).toBe(url);
    expect(JSON.parse(request.data)).toEqual({
      data: expect.objectContaining({ email: expect.stringContaining("@example.com") }),
    });
  });

  it("keeps local-only functions gated or pointed at the configured local base", async () => {
    const localCalls = [
      () => aboutUsRequest.aboutUsFindLocal(),
      () => coin3DRequest.coin3DFindLocal(),
      () => downloadRequest.downloadFindLocal(),
      () => evidenceRequest.evidenceFindLocal(),
      () => glossaryRequest.glossaryFindLocal(),
      () => glossaryRequest.glossaryFindByTermLocal("coin"),
      () => landingRequest.landingFindLocal(),
      () => researchRequest.researchFindLocal(),
      () => toolboxRequest.toolboxFindLocal(),
      () => videoLibraryRequest.videoFindLocal(),
    ];

    for (const call of localCalls) {
      if (LOCAL_STRAPI_ENABLED) {
        await call();
        expect(lastRequest().baseURL).toBe(LOCAL_STRAPI_URL);
      } else {
        await expect(call()).rejects.toThrow("Local Strapi endpoint is disabled");
      }
    }
  });
});
