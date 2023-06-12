import classes from "./Nav.module.css";
import { useNavigate, Link } from "react-router-dom";

const Nav = (props) => {
  const navigate = useNavigate();

  return (
    <div className={classes.topRow}>
      <button className={classes.homeBtn} onClick={() => navigate(-1)}>
        Back
      </button>
      <h1 className={classes.header}>{props.title}</h1>
      <Link className={classes.homeBtn} to="/">
        Home
      </Link>
    </div>
  );
};

export default Nav;