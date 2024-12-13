import { NavLink } from "react-router-dom";
import classes from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={classes.navbar}>
      <NavLink
        to="/problems"
        className={({ isActive }) =>
          isActive ? `${classes.navLink} ${classes.active}` : classes.navLink
        }
      >
        Problems
      </NavLink>
      <NavLink
        to="/ide"
        className={({ isActive }) =>
          isActive ? `${classes.navLink} ${classes.active}` : classes.navLink
        }
      >
        IDE
      </NavLink>
      <NavLink
        to="/contest"
        className={({ isActive }) =>
          isActive ? `${classes.navLink} ${classes.active}` : classes.navLink
        }
      >
        Contest
      </NavLink>
    </nav>
  );
}
