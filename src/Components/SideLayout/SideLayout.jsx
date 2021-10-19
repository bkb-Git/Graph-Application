import { Offcanvas, Tab } from "bootstrap";
import { useHistory } from "react-router-dom";
import "./SideLayout.scss";

const SideLayout = (props) => {
  const { list, fetched, isTabletOrMobile } = props;
  const history = useHistory();

  const handleSelectedItem = (e, route) => {
    const triggeredTab = document.getElementById(e.target.id);
    const tab = new Tab(triggeredTab);
    tab.show();

    if (isTabletOrMobile) {
      const offCanvas = Offcanvas.getInstance(document.querySelector(".offcanvas"));

      offCanvas.hide();
    }

    history.push(`/${route}`);
  };

  const renderSelectionList = () => {
    return (
      <div className="list-group list-group-flush">
        {list.map((option) => (
          <button
            key={`${option.name}-item`}
            type="button"
            id={`list-${option.id}`}
            onClick={(e) => handleSelectedItem(e, option.id)}
            className="list-group-item list-group-item-action"
          >
            {option.name}
          </button>
        ))}
      </div>
    );
  };

  const renderLoading = () => {
    return (
      <div className="d-flex text-primary justify-content-center align-items-center" style={{ height: "100%" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  };

  const renderDisplay = () => {
    if (fetched) {
      return renderSelectionList();
    }
    return renderLoading();
  };

  const renderSideLayout = () => {
    if (isTabletOrMobile) {
      return (
        <>
          <div className="row" style={{ padding: "10px 10px 0 10px" }}>
            <div className="col-2 sidelayout-burger-button d-flex align-items-center justify-content-center">
              <button
                className="btn btn-outline-primary"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#sideLayoutCanvas"
                aria-controls="offcanvasExample"
              >
                <i className="bi bi-list" />
              </button>
            </div>

            <div className="col-10 sidelayout-header d-flex align-items-center">
              <h1 className="h3 text-center">Graph App</h1>
            </div>
          </div>
          <div
            className="offcanvas offcanvas-start"
            tabIndex="-1"
            id="sideLayoutCanvas"
            aria-labelledby="offcanvasExampleLabel"
          >
            <div className="offcanvas-header">
              <p className="h5 ">Select Region</p>
              <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
            </div>
            <div className="offcanvas-body">
              <div className="col-12 sidelayout ">
                <div className="card sidelayout__card" style={{ height: "100%" }}>
                  <div className="card-body sidelayout__card__body">{renderDisplay()}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
    return (
      <div className="col col-lg-2 col-md-2 col-sm-1 sidelayout ">
        <div className="card sidelayout__card" style={{ height: "100%" }}>
          <div className="card-body sidelayout__card__body">{renderDisplay()}</div>
        </div>
      </div>
    );
  };

  return <>{renderSideLayout()}</>;
};

export default SideLayout;
