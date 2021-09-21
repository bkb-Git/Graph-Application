import PlusCircled from ".././../../Assets/plus-circle.svg";
import "./ContentLayout.scss";

const ContentLayout = () => {
  return (
    <div className="col col-lg-10 content-layout">
      <div className="card card-content-layout">
        <div class="add-graph-button">
          <img src={PlusCircled} alt="add graph" />
        </div>
      </div>
    </div>
  );
};

export default ContentLayout;
