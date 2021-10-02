import { useEffect, useState } from "react";
import { Country, Indicator } from "../../Constants/keywords";

import GraphCard from "./GraphCard";
import SelectorCard from "./SelectorCard";

import "./Slot.scss";

const Slot = (props) => {
  const { emptySlot, selectorCard, id, graphObj } = props;
  const { graphList, handleAddGraph, setGraphList } = emptySlot;
  const { regionCountriesFetched, regionalCountries } = selectorCard;

  const [selectionProgress, setSelectionProgress] = useState({ step: 0 });
  const [graphData, setGraphData] = useState({});
  const [indicatorsFetched, setIndicatorsFetched] = useState(false);
  const [slotDimensions, setSlotDimensions] = useState({});

  useEffect(() => {
    if (selectionProgress.step === 2) {
      fetch("https://api.worldbank.org/v2/indicator?format=json")
        .then((response) => response.json())
        .then((data) => {
          //TODO set indicators in a useState hook , and pass it down to the selectorCard
          // eslint-disable-next-line no-unused-vars
          const indicators = data[1].map((indicator) => {
            return { id: indicator.id, name: indicator.name };
          });

          return setIndicatorsFetched(true);
        });
    }
  }, [selectionProgress]);

  useEffect(() => {
    if (graphList.length === 1 && !graphObj.created) {
      setSelectionProgress({ step: 0 });
    }
  }, [graphList, graphObj]);

  useEffect(() => {
    const slotElement = document.getElementById(`emptySlot-${id}`);
    const slotHeight = slotElement.offsetHeight;
    const slotWidth = slotElement.offsetWidth;
    setSlotDimensions({ slotHeight, slotWidth });
  }, [id]);

  const handleAddGraphHere = () => {
    const modifiedGraphList = graphList;
    const graphIndex = modifiedGraphList.findIndex(
      (obj) => obj.id === graphObj.id
    );
    modifiedGraphList.splice(graphIndex, 1, { ...graphObj, created: true });

    setGraphList([...modifiedGraphList]);
    handleAddGraph();
    setSelectionProgress((prev) => ({ step: prev.step + 1 }));
  };

  const handleDeleteSlot = () => {
    const modifiedGraphList = graphList;
    const graphIndex = modifiedGraphList.findIndex(
      (obj) => obj.id === graphObj.id
    );
    modifiedGraphList.splice(graphIndex, 1, { id: graphObj.id });

    if (
      !modifiedGraphList[modifiedGraphList.length - 1].created &&
      !modifiedGraphList[modifiedGraphList.length - 2].created
    ) {
      modifiedGraphList.pop();
    }

    setGraphList([...modifiedGraphList]);
    setSelectionProgress({ step: 0 });
  };

  const handleSelect = (props) => {
    const { selectedItem, type } = props;
    const { item } = selectedItem;

    if (type === Country) {
      setGraphData({
        ...graphData,
        countryCode: item,
        countryTitle: selectedItem.country,
      });
    } else if (type === Indicator) {
      setGraphData({
        ...graphData,
        indicator: item,
        indicatorTitle: selectedItem.indicatorTitle,
      });
    }

    return setSelectionProgress((prev) => ({ step: prev.step + 1 }));
  };

  const handleGoBack = () =>
    setSelectionProgress((prev) => ({ step: prev.step - 1 }));

  const renderEmptySlot = () => {
    return (
      <div
        id={`emptySlot-${id}`}
        className="col bg-transparent card graph-card graph-card--empty justify-content-center align-items-center"
      >
        <button
          type="button"
          class="btn btn-outline-primary graph-card--empty__add-graph-button"
          onClick={handleAddGraphHere}
        >
          <i class="bi-plus-lg"></i>
        </button>
      </div>
    );
  };

  if (!graphObj.created) {
    return renderEmptySlot();
  }
  if (selectionProgress.step === 3) {
    return (
      <GraphCard
        graphCardId={id}
        deleteCard={handleDeleteSlot}
        slotDimensions={slotDimensions}
        data={graphData}
      />
    );
  }
  return (
    <SelectorCard
      handleSelect={handleSelect}
      handleGoBack={handleGoBack}
      regionFetched={regionCountriesFetched}
      indicatorsFetched={indicatorsFetched}
      region={regionalCountries}
      progress={selectionProgress.step}
    />
  );
};

export default Slot;
