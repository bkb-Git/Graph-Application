const WBSources = "https://api.worldbank.org/v2/sources?format=json";
const WBRegions = "https://api.worldbank.org/v2/region?format=json";

const WBCountriesByRegion = (region) => `https://api.worldbank.org/V2/region/${region}/country?format=json`;

const WBIndicatorById = (indicatorId) => `https://api.worldbank.org/v2/indicator/${indicatorId}?format=json`;

const WBIndicatorByCountry = (country, indicator) =>
  `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?format=json`;

export { WBRegions, WBSources, WBCountriesByRegion, WBIndicatorByCountry, WBIndicatorById };
