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

import { WBIndicatorByCountry } from "../../../WorldBank/worldBankAPIs";
import D3Graph from "./D3Graph";
import Loader from "../../Loader";

const GraphCard = (props) => {
  const { deleteCard, data, graphCardId } = props;
  const [fetched, setFetched] = useState({
    dataFetched: false,
    graphCardDimensionsFetched: false,
    cardHeaderDimensionsFetched: false,
  });
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

  // Fetch data
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
          return setFetched({ dimensionsFetched: false, dataFetched: true });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [countryCode, indicator]);

  //Retrieve Graph card dimensions
  useEffect(() => {
    const graphCard = document.getElementById(graphCardId);

    if (modalOpen) {
      if (!fetched.graphCardDimensionsFetched) {
        const modal = document.getElementById(`modal-${graphCardId}`)
          .childNodes[0];

        return setTimeout(() => {
          const width = modal.getBoundingClientRect().width;
          const height = modal.getBoundingClientRect().height;
          setGraphCardDimensions({
            width,
            height,
          });
          return setFetched({ ...fetched, graphCardDimensionsFetched: true });
        }, 200);
      }
    } else if (!fetched.graphCardDimensionsFetched) {
      return setTimeout(() => {
        const width = graphCard.getBoundingClientRect().width;
        const height = graphCard.getBoundingClientRect().height;

        setGraphCardDimensions({
          width,
          height,
        });
        return setFetched({ ...fetched, graphCardDimensionsFetched: true });
      }, 200);
    }
  }, [graphCardId, modalOpen, fetched]);

  //Set tooltip for action buttons
  useEffect(() => {
    if (fetched.dataFetched && !modalOpen) {
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
          delay: { show: 50, hide: 100 },
          trigger: "hover focus",
        });

        return new Tooltip(nextButton, {
          title: "Next",
          animation: true,
          placement: "right",
          delay: { show: 50, hide: 100 },
          trigger: "hover focus",
        });
      };

      return buttonTooltip();
    }
  }, [fetched, graphCardId, modalOpen]);

  const renderCardActions = () => {
    const handleToggleFullscreenOff = (e) => {
      setOrderData({ ...orderData, page: 0 });
      setFetched({
        ...fetched,
        graphCardDimensionsFetched: false,
        cardHeaderDimensionsFetched: false,
      });
      return setModalOpen(false);
    };

    const handleToggleFullscreenOn = (e) => {
      const graphModal = new Modal(
        document.getElementById(`modal-${graphCardId}`),
        {
          backdrop: "static",
        }
      );

      setOrderData({ ...orderData, page: 3 });
      setFetched({
        ...fetched,
        graphCardDimensionsFetched: false,
        cardHeaderDimensionsFetched: false,
      });

      setModalOpen(true);

      return graphModal.show();
    };

    const handleGraphNavigation = (e) => {
      const navButtonClicked = e.currentTarget.id;
      const nextButton = `${graphCardId}-button-nav-next`;
      const prevButton = `${graphCardId}-button-nav-prev`;

      if (navButtonClicked === nextButton) {
        if (orderData.page < 2) {
          return setOrderData((prev) => ({
            ...orderData,
            page: prev.page + 1,
          }));
        }
      } else if (navButtonClicked === prevButton) {
        if (orderData.page > 0) {
          return setOrderData((prev) => ({
            ...orderData,
            page: prev.page - 1,
          }));
        }
      }
    };

    const handleSetOrder = (e) => {
      const value = e.target.attributes.value.value;

      return setOrderData({ ...orderData, order: value });
    };

    const renderNavButtons = () => {
      if (!modalOpen) {
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
          </>
        );
      }
      return null;
    };

    const renderFullScreenButton = () => {
      if (!modalOpen) {
        return (
          <button
            type="button"
            onClick={handleToggleFullscreenOn}
            className="btn graph-card__actions__button graph-card__actions__button--fullscreen"
          >
            <i class="bi bi-fullscreen" />
          </button>
        );
      }
    };

    const renderCancelButton = () => {
      if (!modalOpen) {
        return (
          <button
            type="button"
            className="btn graph-card__actions__button graph-card__actions__button--close"
            onClick={modalOpen ? handleToggleFullscreenOff : deleteCard}
          >
            <i class="bi bi-x-lg" />
          </button>
        );
      }
      return (
        <button
          type="button"
          class="btn-close"
          onClick={handleToggleFullscreenOff}
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      );
    };

    const renderOrderButton = () => {
      return (
        <div className="dropdown">
          <button
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            id={`${graphCardId}-button-order`}
            className="btn btn-primary graph-card__actions__button  graph-card__actions__button--order"
          >
            <i class="bi bi-bar-chart-fill"></i>
          </button>
          <ul
            className="dropdown-menu dropdown-menu-dark dropdown-menu-start"
            aria-labelledby={`${graphCardId}-button-order`}
          >
            <li
              className="dropdown-item"
              value={dateAscendingOrder}
              onClick={(e) => handleSetOrder(e)}
            >
              Ascending Order
            </li>
            <li
              className="dropdown-item"
              value={dateDescendingOrder}
              onClick={(e) => handleSetOrder(e)}
            >
              Descending Order
            </li>
          </ul>
        </div>
      );
    };

    return (
      <>
        {renderOrderButton()}
        {renderNavButtons()}
        {renderFullScreenButton()}
        {renderCancelButton()}
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

  const renderGraph = () => {
    return (
      <D3Graph
        dataForD3={graphData}
        indicatorInfo={indicator}
        inModal={modalOpen}
        orderData={orderData}
        id={graphCardId}
        fetchedObj={{ fetched, setFetched }}
        dimensions={graphCardDimensions}
        axisLabels={{
          xAxisLabel: "date",
          yAxisLabel: "value",
          yValue: "value",
        }}
      />
    );
  };

  const renderCardContent = () => {
    return (
      <>
        {renderCardHeader()}
        {fetched.graphCardDimensionsFetched ? renderGraph() : <Loader />}
      </>
    );
  };

  const renderModal = () => {
    return (
      <div className="modal fade " id={`modal-${graphCardId}`}>
        <div className="modal-dialog modal-xl graph-card__modal">
          <div className="modal-content">
            {modalOpen && fetched.graphCardDimensionsFetched ? (
              renderCardContent()
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (fetched.dataFetched) {
      return (
        <>
          {!modalOpen ? renderCardContent() : <Loader />}
          {renderModal()}
        </>
      );
    }
    return <Loader />;
  };

  return (
    <div
      id={graphCardId}
      className={`col card graph-card graph-card-${graphCardId}`}
    >
      {renderContent()}
    </div>
  );
};

export default GraphCard;
