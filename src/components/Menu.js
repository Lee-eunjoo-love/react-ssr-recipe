import { Link } from "react-router-dom";
import style from "./Menu.module.css";

const Menu = () => {
  return (
    <div className={`${style.menu}`}>
      <ul>
        <li>
          <Link to="/red">Red</Link>
        </li>
        <li>
          <Link to="/blue">Blue</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
