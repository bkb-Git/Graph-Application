import { Tab } from "bootstrap";
import { useHistory } from "react-router";
import "./SideLayout.scss";

const SideLayout = (props) => {
  const { list, fetched } = props;
  const history = useHistory();

  const handleSelectedItem = (e, route) => {
    const triggeredTab = document.getElementById(e.target.id);
    let tab = new Tab(triggeredTab);
    tab.show();

    history.push(`/${route}`);
  };

  const renderSelectionList = () => {
    return (
      <div className="list-group list-group-flush">
        {list.map((option) => (
          <button
            key={`${option.name}-item`}
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

  const renderDisplay = () => {
    if (fetched) {
      return renderSelectionList();
    }
    return renderLoading();
  };

  return (
    <div className="col col-lg-2 sidelayout ">
      <div className="card sidelayout__card" style={{ height: "100%" }}>
        <div className="card-body sidelayout__card__body">
          {renderDisplay()}
        </div>
      </div>
    </div>
  );
};

export default SideLayout;
