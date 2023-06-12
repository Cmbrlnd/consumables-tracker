import classes from "./Types.module.css";
import Card from "../UI/Card";
import Nav from "../UI/Nav";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "axios";
import ConsumableSearch from "../components/ConsumableSearch";

const Types = () => {
    const [typeData, setTypeData] = useState([]);
    const [consumableModelSearch, setConsumableModelSearch] = useState("");
    let { type } = useParams(); // Get the "type" parameter from the URL path

    useEffect(() => {
        Axios.get(`http://localhost:3001/get-type/${type}`) // Fetch data from the server based on the "type" parameter
            .then((res) => {
                setTypeData(res.data); // Update the "typeData" state variable with the fetched data
            })
            .catch((err) => {
                console.log(err);
            });
    }, [type]);

    return (
        <main className={classes.search}>
            <Nav title={type} />
            <Card>
                <ConsumableSearch
                    consumableSearch={consumableModelSearch}
                    setConsumableSearch={setConsumableModelSearch}
                    consumables={typeData}
                    title="Search consumable model"
                    listProperty={"model"}
                />
            </Card>
        </main>
    );
}

export default Types;