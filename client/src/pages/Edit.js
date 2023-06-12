import classes from "./Edit.module.css";
import Card from "../UI/Card";
import Nav from "../UI/Nav";
import { useEffect, useState } from "react";
import Axios from "axios";
import ConsumableSearch from "../components/ConsumableSearch";

const Edit = () => {
  const [consumables, setConsumables] = useState([]);
  const [consumableModelSearch, setConsumableModelSearch] = useState("");
  
  // Fetch consumables from the server on component mount
  useEffect(() => {
    Axios.get("http://localhost:3001/get-consumables")
      .then((res) => {
        setConsumables(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main className={classes.search}>
      <Nav title="Edit" />
      <div className={classes.searchContainers2}>
        <Card height="100%" width="40%" isMinWidth={true}>
          <ConsumableSearch
            consumableSearch={consumableModelSearch}
            setConsumableSearch={setConsumableModelSearch}
            consumables={consumables}
            title="Search consumable model"
            listProperty={"model"}
            edit={true}
          />
        </Card>
      </div>
    </main>
  );
};

export default Edit;
