// Default coin pile strategy gets a random y, and plots it with a random x as long as the x is within the integral of and non-negative:
// -4 * (x - 0.5)^4 + 1.5 * (x - 0.5)^2 + .2
// You can plot that in desmos.
export function DefaultCoinPileGraphingStategy(coin) {
    let y = Math.random();
    const CoinSortGraphingFormula = (x) => {
      return -4 * Math.pow(x - 0.5, 4) + 1.5 * Math.pow(x - 0.5, 2) + .2;
    };
    let x = Math.random() * CoinSortGraphingFormula(y);
  
    if (coin.id % 2 === 0) {
      x = 1 - x;
    } 
    return {
      x: x,
      y: y,
    };
  }


  // Randomly selects numbers from a Gaussian distribution between (0, 1)
  export function RandnBm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return RandnBm() // resample between 0 and 1
    return num
  }
  
  // This function adds Gaussian deviation to make the original value a little messier
  export function GaussianDeviationOnValue(val, deviation) {
    let min = val - deviation;
    let max = val + deviation;
    return RandnBm() * (max - min) + min;
  }

  // This function converts the data we recieve from strapi into a more easily parsed data format
export function SimplyMappedCoin(coin, index) {
    return {
      props_index: index,
      id: coin.id,
      from_date: coin.attributes.from_date,
      material: coin.attributes.material,
      issuing_authority: coin.attributes.issuing_authority,
      governing_power: coin.attributes.governing_power?.data?.attributes?.governing_power, // for some reason, it be bugging with governing_power. The ?. operator fixes it
      size: coin.attributes.diameter
    };
  }

  
// This evenly distrubutes the pile locations along the left, bottom, and right side of the CoinPile div.
export function CoinPileLocations(arr_length) {
    const deviation = .1;
    const bottom_start_point = .1;
    const bottom_end_point = 1;
    const side_start_point = .1;
    const side_end_point = .8;
  
    // Get the number of piles we need per side.
    // Left and Right side must have the same number of piles.
    let num_piles_bottom = 0, num_piles_on_sides = 0;
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
  
    // This goes left to right plotting evenly spaced points
    let bottom_points = [];
    for (let i = bottom_start_point; i < bottom_end_point && num_piles_bottom !== 0; i += (bottom_end_point - bottom_start_point) / num_piles_bottom) {
      bottom_points.push({x: i, y: GaussianDeviationOnValue(.8, deviation)});
    }
  
    // This goes top to bottom plotting evenly spaced points
    let left_side_points = [];
    let right_side_points = [];
    for (let i = side_start_point; i < side_end_point && num_piles_on_sides !== 0; i += (side_end_point - side_start_point) / num_piles_on_sides) {
      left_side_points.push({ x: GaussianDeviationOnValue(.15, deviation), y: i });
      right_side_points.push({ x: GaussianDeviationOnValue(.95, deviation), y: i });
    }
    right_side_points = right_side_points.reverse();
  
    return left_side_points.concat(bottom_points).concat(right_side_points);
  }
  