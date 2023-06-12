import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Add.module.css";
import Card from "../UI/Card";
import Nav from "../UI/Nav";
import Axios from "axios";
import Modal from "../UI/Modal";

const Add = () => {
  const [consumableData, setConsumableData] = useState({
    type: "",
    make: "",
    model: "",
    minQty: "",
    maxQty: "",
    currentQty: "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [validation, setValidation] = useState(true);

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  //Update consumableData on input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setConsumableData({ ...consumableData, [name]: value });
    console.log(consumableData);
  };

  const addConsumable = () => {
    // Check if any required fields are empty
    for (const key of Object.keys(consumableData)) {
      var val = consumableData[key];
      if (val === "") {
        setValidation(false);
        return;
      }
    }
    // Send POST request to add consumable
    Axios.post("http://localhost:3001/add-consumable", {
      type: consumableData.type,
      make: consumableData.make,
      model: consumableData.model,
      minQty: Number(consumableData.minQty),
      maxQty: Number(consumableData.maxQty),
      currentQty: Number(consumableData.currentQty),
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("Consumable Added!");
          setUpdateSuccess(true);
        }
        console.log("Added consumable: ", res.data.model);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <main className={classes.add}>
      <Nav title="Add" />
      <Card height="70%" width="50%" isMinWidth={true}>
        <div className={classes.form}>
          <div className={classes.inputContainer}>
            <label className={classes.p}>Type</label>
            <input
              className={classes.input}
              value={consumableData.type}
              id="type"
              name="type"
              type="text"
              onChange={handleChange}
              required
            />
          </div>
          <div className={classes.inputContainer}>
            <label className={classes.p}>Make</label>
            <input
              className={classes.input}
              value={consumableData.make}
              id="make"
              name="make"
              type="text"
              onChange={handleChange}
              required
            />
          </div>
          <div className={classes.inputContainer}>
            <label className={classes.p}>Model</label>
            <input
              className={classes.input}
              value={consumableData.model}
              id="model"
              name="model"
              type="text"
              onChange={handleChange}
              required
            />
          </div>
          <div className={classes.inputContainer}>
            <label className={classes.p}>Min Qty</label>
            <input
              className={classes.input}
              value={consumableData.minQty}
              id="minQty"
              name="minQty"
              type="number"
              onChange={handleChange}
              required
            />
          </div>
          <div className={classes.inputContainer}>
            <label className={classes.p}>Max Qty</label>
            <input
              className={classes.input}
              value={consumableData.maxQty}
              id="maxQty"
              name="maxQty"
              type="number"
              onChange={handleChange}
              required
            />
          </div>
          <div className={classes.inputContainer}>
            <label className={classes.p}>Current Qty</label>
            <input
              className={classes.input}
              value={consumableData.currentQty}
              id="currentQty"
              name="currentQty"
              type="number"
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button className={classes.submitBtn} onClick={addConsumable}>
          Submit
        </button>
      </Card>
      {updateSuccess && (
        <Modal
          onClose={() => {
            setUpdateSuccess(false);
            goBack();
          }}
        >
          <div className={classes.modalDiv}>
            <p>Consumable added successfully!</p>
            <button
              className={classes.modalBtn}
              onClick={() => {
                setUpdateSuccess(false);
                goBack();
              }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
      {!validation && (
        <Modal
          onClose={() => {
            setValidation(true);
          }}
        >
          <div className={classes.modalDiv}>
            <p>Please input a value for all fields!</p>
            <button
              className={classes.modalBtn}
              onClick={() => {
                setValidation(true);
              }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
};

export default Add;
