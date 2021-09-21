import "./SideLayout.scss";

const SideLayout = (props) => {
  const { list } = props;

  const selectionList = (
    <div className="list-group list-group-flush">
      {list.map((item) => (
        <button key={item} className="list-group-item list-group-item-action">
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div className="col col-lg-2 card ">
      <div className="card-body">{selectionList}</div>
    </div>
  );
};

export default SideLayout;
