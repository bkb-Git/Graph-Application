import MainPage from "../MainPage";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";

const App = () => {
  return (
    <Router>
      <MainPage />
    </Router>
  );
};

export default App;
