import {
  BillionStr,
  dateAscendingOrder,
  dateDescendingOrder,
  MillionStr,
  noData,
  oneHundredThousandStr,
  TrillionStr,
  valueAscendingOrder,
  valueDescendingOrder,
} from "../../Constants/keywords";

import {
  currentAccountBalance,
  gdpTotalinUSD,
  netMigration,
  totalLabourForce,
  totalPopulation,
} from "../../Constants/indicators";
import {
  trillion,
  billion,
  million,
  oneHundredThousand,
} from "../../Constants/values";

const sortData = (data, setGraphData, orderData, inModal, indicatorInfo) => {
  const { order, page } = orderData;
  const index = { stop: 21, start: 0, next: 20 };
  let finalData;

  const handleValue = (value, divider) => {
    if (value === null) {
      return noData;
    } else if (divider) {
      return value / divider;
    }
    return value;
  };

  const convertGDPfigures = (finalData) => {
    const hasTrillion = finalData.find((record) => {
      const value = record.value;
      let finalValue;

      value < 0 ? (finalValue = value * -1) : (finalValue = value);

      return finalValue >= trillion;
    });

    if (hasTrillion) {
      const hasBillionValue = finalData.find((record) => {
        const value = record.value;
        let finalValue;

        value < 0 ? (finalValue = value * -1) : (finalValue = value);
        return finalValue < trillion && finalValue >= billion;
      });

      return finalData.map((record) => {
        return {
          ...record,
          value: handleValue(record.value, trillion),
          maxValue: TrillionStr,
          hasBillionFigure: hasBillionValue ? true : false,
        };
      });
    }

    const hasBillion = finalData.find((record) => {
      const value = record.value;
      let finalValue;

      value < 0 ? (finalValue = value * -1) : (finalValue = value);
      return finalValue >= billion;
    });

    if (hasBillion) {
      const hasMillionValue = finalData.find((record) => {
        const value = record.value;
        let finalValue;

        value < 0 ? (finalValue = value * -1) : (finalValue = value);

        return finalValue < billion && finalValue >= million;
      });

      return finalData.map((record) => {
        return {
          ...record,
          value: handleValue(record.value, billion),
          maxValue: BillionStr,
          hasMillionFigure: hasMillionValue ? true : false,
        };
      });
    }

    const hasMillion = finalData.find((record) => {
      const value = record.value;
      let finalValue;

      value < 0 ? (finalValue = value * -1) : (finalValue = value);
      return finalValue >= million;
    });

    if (hasMillion) {
      const figureLessThanMillion = finalData.find((record) => {
        const value = record.value;
        let finalValue;

        value < 0 ? (finalValue = value * -1) : (finalValue = value);
        return finalValue < million && finalValue !== 0;
      });

      return finalData.map((record) => {
        return {
          ...record,
          value: handleValue(record.value, million),
          maxValue: MillionStr,
          hasFigureLessThanMillion: figureLessThanMillion ? true : false,
        };
      });
    }

    return finalData;
  };

  const convertPopulationFigures = (finalData) => {
    const hasBillion = finalData.find((record) => {
      const value = record.value;
      let finalValue;

      value < 0 ? (finalValue = value * -1) : (finalValue = value);
      return finalValue >= billion;
    });

    if (hasBillion) {
      const hasMillionValue = finalData.find((record) => {
        const value = record.value;
        let finalValue;

        value < 0 ? (finalValue = value * -1) : (finalValue = value);

        return finalValue < billion && finalValue >= million;
      });

      return finalData.map((record) => {
        return {
          ...record,
          value: handleValue(record.value, billion),
          maxValue: BillionStr,
          hasMillionFigure: hasMillionValue ? true : false,
        };
      });
    }

    const hasMillion = finalData.find((record) => {
      const value = record.value;
      let finalValue;

      value < 0 ? (finalValue = value * -1) : (finalValue = value);
      return finalValue >= million;
    });

    if (hasMillion) {
      const figureLessThanMillion = finalData.find(
        (record) => record.value < million && record.value > 0
      );

      return finalData.map((record) => {
        return {
          ...record,
          value: handleValue(record.value, million),
          maxValue: MillionStr,
          hasFigureLessThanMillion: figureLessThanMillion ? true : false,
        };
      });
    }

    const hasOneHundredThousand = finalData.find((record) => {
      const value = record.value;
      let finalValue;

      value < 0 ? (finalValue = value * -1) : (finalValue = value);
      return finalValue >= oneHundredThousand;
    });

    if (hasOneHundredThousand) {
      const figureLessThanOneHundredThousand = finalData.find((record) => {
        const value = record.value;
        let finalValue;

        value < 0 ? (finalValue = value * -1) : (finalValue = value);
        return finalValue < oneHundredThousand && finalValue > 0;
      });

      return finalData.map((record) => {
        return {
          ...record,
          value: handleValue(record.value),
          maxValue: oneHundredThousandStr,
          hasFigureLessThanOneHundredThousand: figureLessThanOneHundredThousand
            ? true
            : false,
        };
      });
    } else {
      return finalData.map((record) => {
        return {
          ...record,
          value: handleValue(record.value),
          maxValue: oneHundredThousandStr,
          hasFigureLessThanOneHundredThousand: true,
        };
      });
    }
  };

  const convertDefaultFigures = (finalData) => {
    return finalData.map((record) => {
      return {
        ...record,
        value: handleValue(record.value),
      };
    });
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

  switch (indicatorInfo) {
    case currentAccountBalance:
    case gdpTotalinUSD:
      finalData = convertGDPfigures(finalData);
      break;

    case totalPopulation:
    case totalLabourForce:
    case netMigration:
      finalData = convertPopulationFigures(finalData);
      break;
    default:
      finalData = convertDefaultFigures(finalData);
      break;
  }

  return setGraphData(finalData);
};

export { sortData };
