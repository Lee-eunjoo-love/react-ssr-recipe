import { Route, Routes } from "react-router-dom";
import Menu from "./components/Menu";
import "./App.css";
import SplitMePage from "./pages/SplitMePage";
import loadable from "@loadable/component";
//import BluePage from "./pages/BluePage";
//import RedPage from "./pages/RedPage";
//import UsersPage from "./pages/UsersPage";

const BluePage = loadable(() => import("./pages/BluePage"), {
  fallback: <div>loading ...</div>,
});
const RedPage = loadable(() => import("./pages/RedPage"), {
  fallback: <div>loading ...</div>,
});
const UsersPage = loadable(() =>
  import("./pages/UsersPage", { fallback: <div>loading ...</div> })
);

function App() {
  return (
    <div>
      <header>
        <Menu />
      </header>
      <Routes>
        <Route path="/" element={<SplitMePage />} />
        <Route path="/blue" element={<BluePage />} />
        <Route path="/red" element={<RedPage />} />
        <Route path="/users/*" element={<UsersPage />} />
      </Routes>
    </div>
  );
}

export default App;
