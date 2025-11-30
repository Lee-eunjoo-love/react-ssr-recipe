import { Route, Routes } from "react-router-dom";
import Menu from "./components/Menu";
import "./App.css";
import SplitMePage from "./pages/SplitMePage";
import BluePage from "./pages/BluePage";
import RedPage from "./pages/RedPage";
import UsersPage from "./pages/UsersPage";

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
