import { indicators } from "../../../Constants/indicators";
import { Country, Indicator } from "../../../Constants/keywords";

const SelectorCard = (props) => {
  const {
    handleSelect,
    region,
    progress,
    regionFetched,
    indicatorsFetched,
    handleGoBack,
  } = props;
  const { gdpTotalinUSD, totalPopulation } = indicators;

  const progressStep = { 1: "33", 2: "66" };

  const renderLoading = () => {
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

  const countrySelector = () => {
    if (regionFetched) {
      return (
        <div className="list-group">
          {region.map((country) => (
            <button
              key={`${country.name}-item`}
              id={`list-${country.id}`}
              onClick={() =>
                handleSelect({
                  selectedItem: { item: country.id, country: country.name },
                  type: Country,
                })
              }
              className="list-group-item list-group-item-action"
            >
              {country.name}
            </button>
          ))}
        </div>
      );
    }
    return renderLoading();
  };

  const indicatorSelector = () => {
    if (indicatorsFetched) {
      return (
        <div className="list-group">
          <button
            id="gdp-indicator"
            onClick={() =>
              handleSelect({
                selectedItem: {
                  item: gdpTotalinUSD,
                  indicatorTitle: "GDP in $USD",
                },
                type: Indicator,
              })
            }
            className="list-group-item list-group-item-action"
          >
            GDP in $USD
          </button>
          <button
            key="population-indicator"
            onClick={(e) =>
              handleSelect({
                selectedItem: {
                  item: totalPopulation,
                  indicatorTitle: "Population in Total",
                },
                type: Indicator,
              })
            }
            className="list-group-item list-group-item-action"
          >
            Population in total
          </button>
        </div>
      );
    }

    return renderLoading();
  };

  const renderSelector = () => {
    if (progress === 1) {
      return countrySelector();
    } else if (progress === 2) {
      return indicatorSelector();
    }
    return null;
  };

  const renderProgressBar = () => {
    const renderProgressTitle = () => {
      if (progress === 1) {
        return "Select Country";
      }
      return "Select Indicator";
    };
    return (
      <div class="progress">
        <div
          class="progress-bar"
          role="progressbar"
          style={{ width: `${progressStep[progress]}%` }}
          // eslint-disable-next-line jsx-a11y/aria-proptypes
          aria-valuenow={`${progressStep[progress]}`}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {renderProgressTitle()}
        </div>
      </div>
    );
  };

  const renderButtonBack = () => {
    if (progress === 2) {
      return (
        <div className="button-back col-2 justify-content-lg-start">
          <button
            type="button"
            onClick={handleGoBack}
            className="btn btn-md btn-outline-primary"
          >
            Back
          </button>
        </div>
      );
    }
    return null;
  };

  const renderClassName = () => {
    if (progress === 1) {
      return "card-body";
    }
    return "card-body card-body--with-button";
  };

  return (
    <div className="col card card-select-country">
      {renderProgressBar()}
      <div className={renderClassName()}>{renderSelector()}</div>
      {renderButtonBack()}
    </div>
  );
};

export default SelectorCard;
