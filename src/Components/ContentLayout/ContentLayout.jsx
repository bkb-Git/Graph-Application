import { useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import GraphView from "../GraphView";

import "./ContentLayout.scss";

const ContentLayout = () => {
  const [graphAdded, setGraphAdded] = useState(false);
  const history = useHistory();

  const handleAddGraph = () => {
    setGraphAdded(true);
    history.push("/default");
  };

  const renderAddGraphButton = () => {
    return (
      <button
        type="button"
        class="btn btn-outline-primary add-graph-button"
        onClick={handleAddGraph}
      >
        <i class="bi-plus-lg"></i>
      </button>
    );
  };

  const renderContentClassList = () => {
    if (graphAdded) {
      return "container bg-transparent content-layout__card content-layout__card--graph-added";
    }
    return "container bg-transparent content-layout__card";
  };

  const renderContentLayoutClassList = () => {
    if (graphAdded) {
      return "col col-lg-10 content-layout";
    }
    return "col col-lg-10 content-layout content-layout--no-graph";
  };

  const renderContent = () => {
    return (
      <Switch>
        <Route exact path="/" render={() => renderAddGraphButton()} />
        <Route exact path="/:option" component={GraphView} />
      </Switch>
    );
  };

  return (
    <div className={renderContentLayoutClassList()}>
      <div className={renderContentClassList()}>{renderContent()}</div>
    </div>
  );
};

export default ContentLayout;
