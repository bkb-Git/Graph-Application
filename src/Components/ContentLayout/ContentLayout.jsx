import { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import usePrevious from "../../libs/helpers/usePrevious";

import GraphViews from "../GraphViews";

import "./ContentLayout.scss";

const ContentLayout = (props) => {
  const { defaultId, isDesktopOrLaptop } = props;
  const [graphAdded, setGraphAdded] = useState(false);
  const history = useHistory();

  const prevDisplayState = usePrevious(isDesktopOrLaptop);

  useEffect(() => {
    setGraphAdded(true);
  }, [history.location]);

  useEffect(() => {
    if (isDesktopOrLaptop !== prevDisplayState && graphAdded) {
      return setGraphAdded(false);
    }

    if (graphAdded) {
      const contentLayoutEl = document.querySelector(".content-layout");
      const contentEl = document.querySelector(".content-layout__card");

      contentEl.classList.add("content-layout__card--graph-added");
      return contentLayoutEl.classList.remove("content-layout--no-graph");
    }
    return null;
  }, [graphAdded, isDesktopOrLaptop, prevDisplayState]);

  const handleAddGraph = () => {
    history.push(`/${defaultId}`);
  };

  const renderAddGraphButton = () => {
    return (
      <figure
        className="figure d-flex flex-column float-start justify-content-between align-items-center"
        style={{ height: "55%" }}
      >
        {isDesktopOrLaptop ? <h1 className="display-3 text-primary">Graph App</h1> : null}
        <figcaption className="figure-caption lead text-center">
          Select region on the left or click the button below to get started.
        </figcaption>
        <button type="button" className="btn btn-outline-primary add-graph-button" onClick={handleAddGraph}>
          <i className="bi-plus-lg" />
        </button>
      </figure>
    );
  };

  const renderContent = () => {
    return (
      <Switch>
        <Route exact path="/" render={() => renderAddGraphButton()} />
        <Route exact path="/:option">
          <GraphViews isDesktopOrLaptop={isDesktopOrLaptop} />
        </Route>
      </Switch>
    );
  };

  const renderContentLayout = () => {
    if (isDesktopOrLaptop) {
      return (
        <div className="col col-xl-10 col-lg-10 col-md-10 col-sm-12 content-layout content-layout--no-graph">
          <div className="container bg-transparent content-layout__card">{renderContent()}</div>
        </div>
      );
    }
    return (
      <div className="row content-layout content-layout--no-graph">
        <div className="container bg-transparent content-layout__card">{renderContent()}</div>
      </div>
    );
  };

  return <>{renderContentLayout()}</>;
};

export default ContentLayout;
