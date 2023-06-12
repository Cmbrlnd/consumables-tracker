import classes from "./Home.module.css";
import { Link } from "react-router-dom";

import Card from "../UI/Card";

const Home = () => {
  return (
    <main className={classes.home}>
      <div className={classes.topRow}>
        <Link to="/search">
          <Card height="100%" width="100%">
            <h1 className={classes.header}>Search</h1>
          </Card>
        </Link>
        <Link to="/add">
          <Card height="100%" width="100%">
          <h1 className={classes.header}>Add</h1>
          </Card>
        </Link>
        <Link to="/edit">
          <Card height="100%" width="100%">
          <h1 className={classes.header}>Edit</h1>
          </Card>
        </Link>
      </div>
      <div className={classes.bottomRow}>
        <Link to="/stock" className={classes.stockReport}>
          <Card height="100%" width="100%">
          <h1 className={classes.header}>Stock Report</h1>
          </Card>
        </Link>
      </div>
    </main>
  );
};

export default Home;
