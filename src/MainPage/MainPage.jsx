import { useEffect, useState } from "react";

import MainLayout from "../Components/MainLayout";
import ContentLayout from "../Components/ContentLayout";
import SideLayout from "../Components/SideLayout";

import { WBRegions } from "../WorldBank/worldBankAPIs";
import "./MainPage.scss";

const MainPage = () => {
  const [sideOptions, setSideOptions] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    fetch(WBRegions)
      .then((response) => response.json())
      .then((data) => {
        setSideOptions(data[1]);
        return setFetched(true);
      });
  }, []);

  const sideOptionsList = sideOptions.map((option) => {
    return { name: option.name, id: option.code };
  });

  return (
    <MainLayout>
      <div
        id="main-page-layout"
        className="row gx-3 main-page__container"
        style={{ height: "inherit" }}
      >
        <SideLayout fetched={fetched} list={sideOptionsList} />
        <ContentLayout defaultId={fetched && sideOptionsList[0].id} />
      </div>
    </MainLayout>
  );
};

export default MainPage;
