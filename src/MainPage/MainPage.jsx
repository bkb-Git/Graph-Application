import Layout from "../Components/Layout";
import "./MainPage.scss";

const MainPage = () => {
  const data = ["Item 1", "Item 2", "Item 3", "Item 4"];

  return <Layout selectionList={data}></Layout>;
};

export default MainPage;
