import { Route, Routes } from "react-router-dom";
import Menu from "./components/Menu";
import "./App.css";
import SplitMePage from "./pages/SplitMePage";
import RedPage from "./pages/RedPage";

function App() {
  return (
    <div>
      <header>
        <Menu />
      </header>
      <Routes>
        <Route path="/" element={<SplitMePage />} />
        <Route path="/red" element={<RedPage />} />
      </Routes>
    </div>
  );
}

export default App;
