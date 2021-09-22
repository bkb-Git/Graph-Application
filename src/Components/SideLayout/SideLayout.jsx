import { useHistory } from "react-router";
import "./SideLayout.scss";

const SideLayout = (props) => {
  const { list } = props;
  const history = useHistory();

  const handleSelectedItem = (route) => {
    history.push(`/${route}`);
  };

  const selectionList = (
    <div className="list-group list-group-flush">
      {list.map((option) => (
        <button
          key={`${option.name}-item`}
          id={`list-${option.id}`}
          onClick={() => handleSelectedItem(option.name)}
          className="list-group-item list-group-item-action"
        >
          {option.name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="col col-lg-2 sidelayout ">
      <div className="card sidelayout__card" style={{ height: "100%" }}>
        <div className="card-body sidelayout__card__body">{selectionList}</div>
      </div>
    </div>
  );
};

export default SideLayout;
