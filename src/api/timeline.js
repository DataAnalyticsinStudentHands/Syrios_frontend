import qs from "qs";
import apiClient from "./client";
import { CACHE_TTL, requestOptions } from "./request-options";

const timelinePopulate = [
  "zone",
  "zone.event",
  "zone.event.governing_powers",
  "zone.event.topics",
  "zone.coin",
  "zone.coin.reverse_file",
  "zone.coin.obverse_file",
  "zone.coin.type_category",
  "zone.coin.governing_power",
  "zone.coin_a",
  "zone.coin_a.reverse_file",
  "zone.coin_a.obverse_file",
  "zone.coin_a.type_category",
  "zone.coin_a.governing_power",
  "zone.coin_b",
  "zone.coin_b.reverse_file",
  "zone.coin_b.obverse_file",
  "zone.coin_b.type_category",
  "zone.coin_b.governing_power",
];

const timelineRequest = {
  background: () =>
    apiClient.get("/api/timelines", {
      meta: requestOptions.cached(CACHE_TTL.LONG),
    }),

  info: () => {
    const query = qs.stringify(
      { populate: timelinePopulate },
      { encodeValuesOnly: true }
    );

    return apiClient.get(`/api/timeline-info?${query}`, {
      meta: requestOptions.cached(CACHE_TTL.LONG),
    });
  },
};

export default timelineRequest;
