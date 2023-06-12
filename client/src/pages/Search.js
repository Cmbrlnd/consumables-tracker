import classes from "./Search.module.css";
import Card from "../UI/Card";
import Nav from "../UI/Nav";
import { useEffect, useState } from "react";
import Axios from "axios";
import ConsumableSearch from "../components/ConsumableSearch";

const Search = () => {
  const [consumables, setConsumables] = useState([]);
  const [consumableModelSearch, setConsumableModelSearch] = useState("");
  const [consumableTypeSearch, setConsumableTypeSearch] = useState("");

  useEffect(() => {
    // Fetch the consumables data from the server when the component mounts
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
      <Nav title="Search" />
      <div className={classes.searchContainers}>
        <Card className={classes.searchCard} width="40%" isMinWidth={true}>
          <ConsumableSearch
            consumableSearch={consumableModelSearch}
            setConsumableSearch={setConsumableModelSearch}
            consumables={consumables}
            title="Search consumable model"
            listProperty={"model"}
          />
        </Card>
        <Card className={classes.searchCard} width="40%" isMinWidth={true}>
          <ConsumableSearch
            consumableSearch={consumableTypeSearch}
            setConsumableSearch={setConsumableTypeSearch}
            consumables={consumables}
            title="Search consumable type"
            listProperty={"type"}
          />
        </Card>
      </div>
    </main>
  );
};

export default Search;
