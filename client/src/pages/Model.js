import classes from "./Model.module.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../UI/Card";
import Nav from "../UI/Nav";
import Axios from "axios";
import Modal from "../UI/Modal";


const Model = () => {
  const [consumableData, setConsumableData] = useState({
    _id: "",
    type: "",
    make: "",
    model: "",
    minQty: "",
    maxQty: "",
    currentQty: 0,
  });

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [validation, setValidation] = useState(true);

  let { model } = useParams(); // Retrieve the "model" parameter from the URL
  const navigate = useNavigate(); // Initialize the navigate function from the useNavigate hook
  const goBack = () => navigate(-1); // Define a function to go back to the previous page

  useEffect(() => {
    // Fetch consumable data from the server when the "model" parameter changes
    Axios.get(`http://localhost:3001/get-consumable/${model}`)
      .then((res) => {
        setConsumableData({
          ...res.data,
          currentQty: Number(res.data.currentQty),
        });
      })
      .catch(() => {
        console.log("err");
      });
  }, [model]);

  const submitChanges = () => {
    //Check for invalid injection to consumable value (less than zero and not type of number)
    if (consumableData.currentQty < 0 || typeof consumableData.currentQty !== "number") {
      setValidation(false); // Set the validation state to false
      return;
    }
    Axios.put("http://localhost:3001/update-quantity", {
      id: consumableData._id,
      quantity: consumableData.currentQty
    }).then((res) => {
      if (res.status === 200) {
        console.log("Quantity updated!");
        setUpdateSuccess(true); // Set the updateSuccess state to true
      }
    }).catch(() =>
      console.log("error")
    )
  }

  return (
    <main className={classes.model}>
      <Nav title={model} />
      <Card height="75%" width="75%" isMinWidth={true}>
        <div className={classes.container}>
          <div className={classes.data}>
            <p className={classes.p}>Type</p>
            <p className={classes.p}>{consumableData.type}</p>
            <p className={classes.p}>Make</p>
            <p className={classes.p}>{consumableData.make}</p>
            <p className={classes.p}>Model</p>
            <p className={classes.p}>{consumableData.model}</p>
            <p className={classes.p}>Min Qty</p>
            <p className={classes.p}>{consumableData.minQty}</p>
            <p className={classes.p}>Max Qty</p>
            <p className={classes.p}>{consumableData.maxQty}</p>
          </div>
          <div className={classes.controls}>
            <h2>Current Qty</h2>
            <div className={classes.qtyControlsContainer}>
              <button
                className={classes.qtyControls}
                onClick={() => {
                  setConsumableData((consumableData) => ({
                    ...consumableData,
                    currentQty: consumableData.currentQty + 1,
                  }));
                }}
              >
                +
              </button>
              <p className={classes.currentQty}>{consumableData.currentQty}</p>
              <button
                className={classes.qtyControls}
                onClick={() => {
                  if (consumableData.currentQty > 0) {
                    setConsumableData((consumableData) => ({
                      ...consumableData,
                      currentQty: consumableData.currentQty - 1,
                    }));
                  }
                }}
              >
                -
              </button>
            </div>
            <button className={classes.submitBtn}
              onClick={submitChanges}>Submit</button>
          </div>
        </div>
      </Card>
      {updateSuccess && (
        // Render a modal if the updateSuccess state is true
        <Modal
          onClose={() => {
            setUpdateSuccess(false); // Reset the updateSuccess state to false
            goBack();
          }}
        >
          <div className={classes.modalDiv}>
            <p>Quantity updated successfully!</p>
            <button
              className={classes.modalBtn}
              onClick={() => {
                setUpdateSuccess(false); // Reset the updateSuccess state to false
                goBack();
              }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
      {!validation && (
        // Render a modal if the validation state is false
        <Modal
          onClose={() => {
            setValidation(true); // Reset the validation state to true
          }}
        >
          <div className={classes.modalDiv}>
            <p>Something went wrong with the submission, please try again.</p>
            <button
              className={classes.modalBtn}
              onClick={() => {
                setValidation(true); // Reset the validation state to true
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

export default Model;