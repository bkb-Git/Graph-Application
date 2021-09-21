import ContentLayout from "./ContentLayout";
import SideLayout from "./SideLayout";

import "./Layout.scss";

const Layout = (props) => {
  const { children, selectionList } = props;

  return (
    <div className="container-fluid">
      <div className="row">
        <SideLayout list={selectionList} />
        <ContentLayout />
      </div>
      {children}
    </div>
  );
};

export default Layout;
