import "./SideLayout.scss";

const SideLayout = (props) => {
  const { list } = props;

  // const handleSelectedItem = (e) => {
  //   console.log(e.target.id);
  //   const selectedElementNode = document.getElementById(e.target.id);
  //   selectedElementNode.classList.toggle("active");
  // };

  const selectionList = (
    <div className="list-group list-group-flush" role="tablist">
      {list.map((item) => (
        <button
          key={`${item}-item`}
          id={`list-${item}-list`}
          data-bs-toggle="list"
          role="tab"
          // onClick={handleSelectedItem}
          className="list-group-item list-group-item-action"
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div className="col col-lg-2 sidelayout ">
      <div className="card card-sidelayout">
        <div className="card-body card-sidelayout-body">{selectionList}</div>
      </div>
    </div>
  );
};

export default SideLayout;
