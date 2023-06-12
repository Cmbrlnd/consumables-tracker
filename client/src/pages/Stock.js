import classes from "./Stock.module.css";
import { useEffect, useState } from "react";
import Axios from "axios";
import Nav from "../UI/Nav";
import Card from "../UI/Card";
import Modal from "../UI/Modal";

const Stock = () => {
    const [consumables, setConsumables] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");

    useEffect(() => {
        // Fetch the consumables data from the server when the component mounts
        Axios.get("http://localhost:3001/get-consumables")
            .then((res) => {
                setConsumables(res.data); // Set the fetched consumables data to the consumables state
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const sendEmail = () => {
        // Send an email by making a request to the server
        Axios.get("http://localhost:3001/send-email")
            .then((res) => {
                console.log(res.data); // Log the response data from the server
                openModal("Email sent successfully"); // Open the modal with the success message
            })
            .catch((err) => {
                console.log(err); // Log any error that occurred during the email sending process
                openModal("Error sending email"); // Open the modal with the error message
            });
    };

    const openModal = (content) => {
        setModalContent(content); // Set the content of the modal
        setShowModal(true); // Show the modal by setting the showModal state to true
    };

    const closeModal = () => {
        setShowModal(false); // Close the modal by setting the showModal state to false
    };

    return (
        <main className={classes.stock}>
            <Nav title="Stock" />
            <Card height="65%" width="100%">
                <div className={classes.cardContainer}>
                    <div className={classes.grid}>
                        <div className={classes.gridHeader}>
                            <div>Type</div>
                            <div>Make</div>
                            <div>Model</div>
                            <div>Min Qty</div>
                            <div>Max Qty</div>
                            <div>Current Qty</div>
                        </div>
                        {consumables.map((consumable) => (
                            <div
                                className={`${classes.gridRow} ${consumable.currentQty <= consumable.minQty
                                    ? classes.highlighted
                                    : ""
                                    }`}
                                key={consumable._id}
                            >
                                <div>{consumable.type}</div>
                                <div>{consumable.make}</div>
                                <div>{consumable.model}</div>
                                <div className={classes.number}>{consumable.minQty}</div>
                                <div className={classes.number}>{consumable.maxQty}</div>
                                <div className={classes.number}>{consumable.currentQty}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
            <button className={classes.submitBtn} onClick={sendEmail}>Send Stock Report</button>
            {showModal && (
                <Modal show={showModal} onClose={closeModal}>
                    <div className={classes.modalDiv}>
                        <p>{modalContent}</p>
                        <button
                            className={classes.modalBtn}
                            onClick={() => {
                                setShowModal(false);
                            }}
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}

        </main>
    )
}

export default Stock;