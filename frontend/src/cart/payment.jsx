



import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import PageTitle from "../components/pageTitle";
import "../styles/CartStyles/Payment.css";
import CheckOutPath from "./checkoutPath";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Payment = () => {
    const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));
    
    const { user } = useSelector((state) => state.user);
    const { shippingInfo } = useSelector((state) => state.cart);

    const completPayment = async (amount) => {
        try {
            if (!orderItem || !amount) {
                toast.error("Le montant total de la commande est invalide.");
                return;
            }

            if (!user?.email || !user?.name) {
                toast.error("Veuillez vous connecter pour procéder au paiement.", { position: "top-center" });
                return;
            }

            if (!shippingInfo?.phoneNumber) {
                toast.error("Veuillez renseigner vos informations de livraison.", { position: "top-center" });
                return;
            }

            const body = {
                user,
                shippingInfo,
                amount,
            };

            const { data: sessionData } = await axios.post(
                "/api/v1/create-checkout-session",
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true, 
                }
            );

            if (sessionData?.url) {
                window.location.href = sessionData.url;
            } else {
                toast.error("Impossible d'obtenir le lien de paiement depuis le serveur.");
                console.error("Données reçues sans URL :", sessionData);
            }

        } catch (err) {
            console.error("--- ERREUR FLUX DE PAIEMENT ---");
            console.error("Objet d'erreur complet :", err);
            console.error("Payload de réponse :", err.response?.data);
            console.error("Code de statut HTTP :", err.response?.status);

            const errorMessage = err.response?.data?.message || "Une erreur est survenue lors de l'initialisation du paiement.";
            toast.error(errorMessage, { position: "top-center" });
        }
    };

    return (
        <>
            <PageTitle title={"Process | Payment"} />
            <NavBar />
            <CheckOutPath activePath={2} />

            <div className="payment-container">
                <Link to={"/order/confirm"} className="payment-go-back">
                    Go Back
                </Link>

                <button
                    className="payment-btn"
                    onClick={() => completPayment(orderItem?.total)}
                    disabled={!orderItem?.total}
                >
                    Pay ({orderItem?.total ? `${orderItem.total.toFixed(2)} dh` : "0 dh"})
                </button>
            </div>

            <Footer />
        </>
    );
};

export default Payment;