import {
  BillionStr,
  dateAscendingOrder,
  dateDescendingOrder,
  MillionStr,
  TrillionStr,
  valueAscendingOrder,
  valueDescendingOrder,
} from "../../../../Constants/keywords";

import { indicators } from "../../../../Constants/indicators";
import { trillion, billion, million } from "../../../../Constants/values";

const sortData = (data, setGraphData, orderData, inModal, indicatorInfo) => {
  const { order, page } = orderData;
  const { gdpTotalinUSD, totalPopulation } = indicators;
  const index = { stop: 21, start: 0, next: 20 };
  let finalData;

  const convertGDPfigures = (finalData) => {
    const hasTrillion = finalData.find((record) => record.value >= trillion);

    if (hasTrillion) {
      const hasBillionValue = finalData.find(
        (record) => record.value < trillion && record.value >= billion
      );

      const hasBillionFigure = () => {
        if (!inModal) {
          return hasBillionValue ? true : false;
        }
      };

      return finalData.map((record) => {
        return {
          ...record,
          value: record.value / trillion,
          maxValue: TrillionStr,
          hasBillionFigure: hasBillionFigure(),
        };
      });
    }

    const hasBillion = finalData.find((record) => record.value >= billion);

    if (hasBillion) {
      const hasMillionValue = finalData.find(
        (record) => record.value < billion && record.value >= million
      );

      const hasMillionFigure = () => {
        if (!inModal) {
          return hasMillionValue ? true : false;
        }
      };

      return finalData.map((record) => {
        return {
          ...record,
          value: record.value / billion,
          maxValue: BillionStr,
          hasMillionFigure: hasMillionFigure(),
        };
      });
    }

    const hasMillion = finalData.find((record) => record.value >= million);

    if (hasMillion) {
      const figureLessThanMillion = finalData.find(
        (record) => record.value < million && record.value > 0
      );

      const hasFigureLessThanMillion = () => {
        if (!inModal) {
          return figureLessThanMillion ? true : false;
        }
      };

      return finalData.map((record) => {
        return {
          ...record,
          value: record.value / million,
          maxValue: MillionStr,
          hasFigureLessThanMillion: hasFigureLessThanMillion(),
        };
      });
    }

    return finalData;
  };

  const convertPopulationFigures = (finalData) => {
    const hasBillion = finalData.find((record) => record.value >= billion);

    if (hasBillion) {
      const hasMillionValue = finalData.find(
        (record) => record.value < billion && record.value >= million
      );

      const hasMillionFigure = () => {
        if (!inModal) {
          return hasMillionValue ? true : false;
        }
      };

      return finalData.map((record) => {
        return {
          ...record,
          value: record.value / billion,
          maxValue: BillionStr,
          hasMillionFigure: hasMillionFigure(),
        };
      });
    }
    return finalData;
  };

  switch (page) {
    case 0:
      finalData = data.slice(index.start, index.stop);
      break;
    case 1:
      finalData = data.slice(index.stop - 1, index.stop + index.next);
      break;
    case 2:
      finalData = data.slice(index.next * 2, index.stop + index.next * 2);
      break;
    default:
      finalData = data;
  }

  switch (order) {
    case dateAscendingOrder:
      finalData = finalData.sort((a, b) => a.date - b.date);
      break;
    case dateDescendingOrder:
      finalData = finalData.sort((a, b) => b.date - a.date);
      break;
    case valueAscendingOrder:
      finalData = finalData.sort((a, b) => a.value - b.value);
      break;
    case valueDescendingOrder:
      finalData = finalData.sort((a, b) => b.value - a.value);
      break;
    default:
      break;
  }

  if (indicatorInfo === gdpTotalinUSD) {
    finalData = convertGDPfigures(finalData);
  }

  if (indicatorInfo === totalPopulation) {
    finalData = convertPopulationFigures(finalData);
  }

  return setGraphData(finalData);
};

export { sortData };
