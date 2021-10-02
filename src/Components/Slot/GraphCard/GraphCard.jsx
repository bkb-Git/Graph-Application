import { useEffect, useState } from "react";
import { Modal, Tooltip } from "bootstrap";

import {
  dateAscendingOrder,
  // eslint-disable-next-line no-unused-vars
  dateDescendingOrder,
  // eslint-disable-next-line no-unused-vars
  valueAscendingOrder,
  // eslint-disable-next-line no-unused-vars
  valueDescendingOrder,
} from "../../../Constants/keywords";

import { WBIndicatorByCountry } from "../../../Constants/worldBankAPIs";
import D3Graph from "./D3Graph";

const GraphCard = (props) => {
  const { deleteCard, data, graphCardId, slotDimensions } = props;
  const [fetched, setFetched] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [graphCardDimensions, setGraphCardDimensions] = useState({
    height: 0,
    width: 0,
  });
  const [orderData, setOrderData] = useState({
    page: 0,
    order: dateAscendingOrder,
  });

  const { countryCode, indicator, countryTitle, indicatorTitle } = data;

  useEffect(() => {
    fetch(WBIndicatorByCountry(countryCode, indicator))
      .then((response) => response.json())
      .then((data) => {
        if (data !== null) {
          setGraphData(
            data[1].map((item) => {
              return {
                date: item.date,
                value: item.value,
                indicator: item.indicator.value,
              };
            })
          );
          return setFetched(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [countryCode, indicator]);

  useEffect(() => {
    if (fetched) {
      const prevButton = document.getElementById(
        `${graphCardId}-button-nav-prev`
      );
      const nextButton = document.getElementById(
        `${graphCardId}-button-nav-next`
      );

      const buttonTooltip = () => {
        new Tooltip(prevButton, {
          title: "Previous",
          animation: true,
          placement: "left",
          trigger: "hover focus",
        });

        return new Tooltip(nextButton, {
          title: "Next",
          animation: true,
          placement: "right",
          trigger: "hover focus",
        });
      };

      const cardHeaderEl = document.getElementById(`cardHeader-${graphCardId}`);

      setGraphCardDimensions({
        width: slotDimensions.slotWidth,
        height: slotDimensions.slotHeight - cardHeaderEl.offsetHeight,
      });

      return buttonTooltip();
    }
  }, [fetched, graphCardId, slotDimensions, setGraphCardDimensions]);

  useEffect(() => {}, [graphCardId]);

  const handleGraphNavigation = (e) => {
    const navButtonClicked = e.currentTarget.id;
    const nextButton = `${graphCardId}-button-nav-next`;
    const prevButton = `${graphCardId}-button-nav-prev`;

    if (navButtonClicked === nextButton) {
      if (orderData.page < 2) {
        return setOrderData((prev) => ({ ...orderData, page: prev.page + 1 }));
      }
    } else if (navButtonClicked === prevButton) {
      if (orderData.page > 0) {
        return setOrderData((prev) => ({ ...orderData, page: prev.page - 1 }));
      }
    }
  };

  const handleToggleFullscreen = (e) => {
    const graphModal = new Modal(document.getElementById("myModal"), {
      backdrop: "static",
    });

    setOrderData({ ...orderData, page: 3 });

    setModalOpen(true);

    return graphModal.show();
  };

  const renderCardActions = () => {
    return (
      <>
        <button
          type="button"
          id={`${graphCardId}-button-nav-prev`}
          onClick={(e) => handleGraphNavigation(e)}
          className="btn graph-card__actions__button graph-card__actions__button--pageNav"
        >
          <i class="bi bi-arrow-left-square-fill" />
        </button>
        <button
          type="button"
          id={`${graphCardId}-button-nav-next`}
          onClick={(e) => handleGraphNavigation(e)}
          className="btn graph-card__actions__button graph-card__actions__button--pageNav"
        >
          <i class="bi bi-arrow-right-square-fill" />
        </button>
        <button
          type="button"
          onClick={handleToggleFullscreen}
          className="btn graph-card__actions__button graph-card__actions__button--fullscreen"
        >
          <i class="bi bi-fullscreen" />
        </button>
        <button
          type="button"
          className="btn graph-card__actions__button graph-card__actions__button--close"
          onClick={deleteCard}
        >
          <i class="bi bi-x-lg" />
        </button>
      </>
    );
  };

  const renderCardHeader = () => {
    return (
      <div
        id={`cardHeader-${graphCardId}`}
        class="card-header graph-card__header"
      >
        <span class="badge graph-card__badge bg-primary ">{countryTitle}</span>
        <h4 class="graph-card__heading text-center ">{indicatorTitle}</h4>
        <div className="graph-card__actions">{renderCardActions()}</div>
      </div>
    );
  };

  const renderContentLoading = () => {
    return (
      <div
        class="d-flex text-primary justify-content-center align-items-center"
        style={{ height: "100%" }}
      >
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  };

  const renderGraph = (inModal) => {
    return (
      <>
        {renderCardHeader()}
        <D3Graph
          dataForD3={graphData}
          indicatorInfo={indicator}
          inModal={inModal}
          orderData={orderData}
          dimensions={graphCardDimensions}
          axisLabels={{
            xAxisLabel: "date",
            yAxisLabel: "value",
            yValue: "value",
          }}
        />
      </>
    );
  };

  const renderModal = () => {
    return (
      <div className="modal fade " id="myModal">
        <div className="modal-dialog modal-xl graph-card__modal">
          <div className="modal-content">{renderGraph(modalOpen)}</div>
        </div>
      </div>
    );
  };

  return (
    <div id={graphCardId} className="col card graph-card">
      {fetched ? renderGraph() : renderContentLoading()}
      {fetched && renderModal()}
    </div>
  );
};

export default GraphCard;
