import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classes from "./EditConsumable.module.css";
import Card from "../UI/Card";
import Nav from "../UI/Nav";
import Axios from "axios";
import Modal from "../UI/Modal";

const EditConsumable = () => {
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    let { model } = useParams();
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    // Fetch the consumable data for the specified model on component mount
    useEffect(() => {
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

    // Update the consumableData object when input values change
    const handleChange = (event) => {
        const { name, value } = event.target;
        setConsumableData({ ...consumableData, [name]: value });
    };

    // Show the delete confirmation modal
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    // Handle the deletion of the consumable
    const handleDeleteConfirm = () => {
        Axios.delete(`http://localhost:3001/delete-consumable/${model}`)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Consumable deleted!");
                    // Optionally, you can redirect to a different page after deletion
                    goBack();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Edit the consumable
    const editConsumable = () => {
        for (const key of Object.keys(consumableData)) {
            var val = consumableData[key];
            if (val === "" || val < 0) {
                setValidation(false);
                return;
            }
        }
        Axios.put("http://localhost:3001/edit-consumable", {
            id: consumableData._id,
            type: consumableData.type,
            make: consumableData.make,
            model: consumableData.model,
            minQty: Number(consumableData.minQty),
            maxQty: Number(consumableData.maxQty),
            currentQty: Number(consumableData.currentQty),
        })
            .then((res) => {
                if (res.status === 200) {
                    console.log("Consumable edited!");
                    setUpdateSuccess(true);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <main className={classes.add}>
            <Nav title="Edit" />
            <Card height="70%">
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
                <div className={classes.btnContainer}>
                    <button className={classes.submitBtn} onClick={editConsumable}>
                        Submit
                    </button>
                    <button className={`${classes.submitBtn} ${classes.deleteBtn}`} onClick={handleDeleteClick}>
                        Delete
                    </button>
                </div>


            </Card>
            {updateSuccess && (
                // Show a modal when the updateSuccess state is true
                <Modal
                    onClose={() => {
                        setUpdateSuccess(false);
                        goBack();
                    }}
                >
                    <div className={classes.modalDiv}>
                        <p>Consumable edited successfully!</p>
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
                // Show a modal when the validation state is false
                <Modal
                    onClose={() => {
                        setValidation(true);
                    }}
                >
                    <div className={classes.modalDiv}>
                        <p>Please input a value for all fields and make sure not to use any negative numbers!</p>
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
            {showDeleteModal && (
                // Show a modal when the showDeleteModal state is true
                <Modal onClose={() => setShowDeleteModal(false)}>
                    <div className={classes.modalDiv}>
                        <p>Are you sure you want to delete this consumable?</p>
                        <div className={classes.btnContainer}>
                            <button className={classes.modalBtnDel} onClick={handleDeleteConfirm}>
                                Delete
                            </button>
                            <button className={classes.modalBtn} onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </main>
    );
};

export default EditConsumable;
