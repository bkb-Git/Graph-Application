import "./GraphCard.scss";

const GraphCard = (props) => {
  const { data, graphList, addGraph, setGraphList } = props;

  const handleAddGraphHere = () => {
    const modifiedGraphList = graphList;
    const graphIndex = modifiedGraphList.findIndex((obj) => obj.id === data.id);
    modifiedGraphList.splice(graphIndex, 1, { ...data, country: "Botswana" });

    setGraphList([...modifiedGraphList]);
    addGraph();
  };

  const handleDeleteGraph = () => {
    const modifiedGraphList = graphList;
    const graphIndex = modifiedGraphList.findIndex((obj) => obj.id === data.id);
    modifiedGraphList.splice(graphIndex, 1, { id: data.id });

    if (
      !modifiedGraphList[modifiedGraphList.length - 1].country &&
      !modifiedGraphList[modifiedGraphList.length - 2].country
    ) {
      modifiedGraphList.pop();
    }

    setGraphList([...modifiedGraphList]);
  };

  const renderEmptyGraphCard = () => {
    return (
      <div className="col bg-transparent card graph-card graph-card--empty justify-content-center align-items-center">
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

  const renderCardActions = () => {
    return (
      <>
        <button
          type="button"
          onClick={handleDeleteGraph}
          class="btn-close"
          aria-label="Close"
        />
      </>
    );
  };

  const renderGraphCard = () => {
    return (
      <div className="col card graph-card">
        <div className="graph-card__actions">{renderCardActions()}</div>
        <h1 className="h1">{data.country}</h1>
        Card with Data
      </div>
    );
  };

  return <>{data.country ? renderGraphCard() : renderEmptyGraphCard()}</>;
};

export default GraphCard;
