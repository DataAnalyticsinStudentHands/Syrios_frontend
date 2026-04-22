/**
 * CoinUtils.jsx — Post Vite Updates (2026)
 *
 * Purpose:
 * Provides helper utilities for CoinSort positioning, gaussian variation,
 * and coin data adaptation.
 *
 * Refactor Summary:
 * 1. Preserved Existing Behavior
 *    - Graphing, gaussian deviation, and pile placement logic remain unchanged
 *
 * 2. Hybrid Shape Compatibility
 *    - `SimplyMappedCoin` supports both:
 *        • legacy relation-shaped values
 *        • adapted string-based CoinSort values
 *
 * Notes:
 * - This module does not fetch API data directly
 * - No Strapi normalization changes are required here
 */

export function DefaultCoinPileGraphingStategy(coin) {
  let y = Math.random();

  const CoinSortGraphingFormula = (x) => {
    return -4 * Math.pow(x - 0.5, 4) + 1.5 * Math.pow(x - 0.5, 2) + 0.2;
  };

  let x = Math.random() * CoinSortGraphingFormula(y);

  if (coin.id % 2 === 0) {
    x = 1 - x;
  }

  return {
    x,
    y,
  };
}

export function RandnBm() {
  let u = 0, v = 0;

  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5;

  if (num > 1 || num < 0) return RandnBm();
  return num;
}

export function GaussianDeviationOnValue(val, deviation) {
  let min = val - deviation;
  let max = val + deviation;
  return RandnBm() * (max - min) + min;
}

export function SimplyMappedCoin(coin, index) {
  const a = coin?.attributes ?? {};

  const governing_power =
    typeof a.governing_power === 'string'
      ? a.governing_power
      : a.governing_power?.data?.attributes?.governing_power;

  const material =
    typeof a.material === 'string'
      ? a.material
      : a.material?.data?.attributes?.name;

  const issuing_authority =
    typeof a.issuing_authority === 'string'
      ? a.issuing_authority
      : a.issuing_authority?.data?.attributes?.name;

  return {
    props_index: index,
    id: coin.id,
    from_date: a.from_date ?? a.from_year ?? null,
    material,
    issuing_authority,
    governing_power,
    size: a.diameter ?? null,
  };
}

export function CoinPileLocations(arr_length) {
  const deviation = 0.1;
  const bottom_start_point = 0.1;
  const bottom_end_point = 1;
  const side_start_point = 0.1;
  const side_end_point = 0.8;

  let num_piles_bottom = 0;
  let num_piles_on_sides = 0;

  if (arr_length % 3 === 0) {
    num_piles_on_sides = arr_length / 3;
    num_piles_bottom = arr_length / 3;
  } else if (arr_length % 3 === 1) {
    num_piles_on_sides = Math.floor(arr_length / 3);
    num_piles_bottom = Math.ceil(arr_length / 3);
  } else {
    num_piles_bottom = Math.ceil(arr_length / 3) + 1;
    num_piles_on_sides = Math.floor(arr_length / 3);
  }

  if (arr_length === 2) {
    num_piles_bottom = 0;
    num_piles_on_sides = 1;
  } else if (arr_length === 1) {
    num_piles_bottom = 1;
    num_piles_on_sides = 0;
  }

  let bottom_points = [];
  for (
    let i = bottom_start_point;
    i < bottom_end_point && num_piles_bottom !== 0;
    i += (bottom_end_point - bottom_start_point) / num_piles_bottom
  ) {
    bottom_points.push({ x: i, y: GaussianDeviationOnValue(0.8, deviation) });
  }

  let left_side_points = [];
  let right_side_points = [];
  for (
    let i = side_start_point;
    i < side_end_point && num_piles_on_sides !== 0;
    i += (side_end_point - side_start_point) / num_piles_on_sides
  ) {
    left_side_points.push({ x: GaussianDeviationOnValue(0.15, deviation), y: i });
    right_side_points.push({ x: GaussianDeviationOnValue(0.95, deviation), y: i });
  }

  right_side_points = right_side_points.reverse();

  return left_side_points.concat(bottom_points).concat(right_side_points);
}