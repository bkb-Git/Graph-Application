import { useEffect, useState } from "react";
import { Chart, Country, Indicator } from "../../Constants/keywords";

import GraphCard from "./GraphCard";
import SelectorCard from "./SelectorCard";

import "./Slot.scss";

const Slot = (props) => {
  const { emptySlot, selectorCard, id, graphObj } = props;
  const { graphList, handleAddGraph, setGraphList } = emptySlot;
  const { regionCountriesFetched, regionalCountries } = selectorCard;

  const [selectionProgress, setSelectionProgress] = useState({ step: 0 });
  const [graphData, setGraphData] = useState({});
  const [indicatorsFetched, setIndicatorsFetched] = useState({
    fetched: false,
    error: false,
  });
  const [fetchError, setFetchError] = useState({ fetchError: false });

  useEffect(() => {
    if (selectionProgress.step === 2 && !indicatorsFetched.fetched) {
      fetch("https://api.worldbank.org/v2/indicator?format=json")
        .then((response) => response.json())
        .then((data) => {
          //TODO set indicators in a useState hook , and pass it down to the selectorCard
          // eslint-disable-next-line no-unused-vars
          const indicators = data[1].map((indicator) => {
            return { id: indicator.id, name: indicator.name };
          });

          return setIndicatorsFetched({ ...indicatorsFetched, fetched: true });
        })
        .catch((err) => setFetchError({ ...fetchError, errorMessage: err }));
    }
  }, [selectionProgress, indicatorsFetched, fetchError]);

  useEffect(() => {
    if (graphList.length === 1 && !graphObj.created) {
      setSelectionProgress({ step: 0 });
    }
  }, [graphList, graphObj]);

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
    } else if (type === Chart) {
      setGraphData({
        ...graphData,
        chart: item,
      });
    }

    return setSelectionProgress((prev) => ({ step: prev.step + 1 }));
  };

  const handleGoBack = () =>
    setSelectionProgress((prev) => ({ step: prev.step - 1 }));

  const renderError = () => {
    <div class="alert alert-danger" style={{ height: "100%" }} role="alert">
      {fetchError.errorMessage}
    </div>;
  };

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

  if (fetchError.fetchError) {
    return renderError();
  }

  if (selectionProgress.step === 4) {
    return (
      <GraphCard
        graphCardId={id}
        deleteCard={handleDeleteSlot}
        data={graphData}
      />
    );
  }
  return (
    <SelectorCard
      handleSelect={handleSelect}
      handleGoBack={handleGoBack}
      regionFetched={regionCountriesFetched}
      indicatorsFetched={indicatorsFetched.fetched}
      region={regionalCountries}
      progress={selectionProgress.step}
    />
  );
};

export default Slot;
