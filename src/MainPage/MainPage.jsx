import MainLayout from "../Components/MainLayout";
import ContentLayout from "../Components/ContentLayout";
import SideLayout from "../Components/SideLayout";

import "./MainPage.scss";

const MainPage = () => {
  const data = [
    { name: "Item-1", id: 1 },
    { name: "Item-2", id: 2 },
    { name: "Item-3", id: 3 },
    { name: "Item-4", id: 4 },
  ];

  return (
    <MainLayout>
      <div
        className="row gx-3 main-page__container"
        style={{ height: "inherit" }}
      >
        <SideLayout list={data} />
        <ContentLayout />
      </div>
    </MainLayout>
  );
};

export default MainPage;
