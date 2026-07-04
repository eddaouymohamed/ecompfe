
import axios from "axios";
import PageTitle from "../components/pageTitle";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import Loader from "../components/loder";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/CartStyles/PaymentSuccess.css";
import { createOrder, removeErrors, removeSuccess } from "../features/order/orderSlice";
import { clearCart } from "../features/cart/cartSlice";

export default function PaymentSucces() {
  const [isVerified, setIsVerified] = useState(false);
  const [verificationErr, setVerificationErr] = useState(null);
  const [search] = useSearchParams();
  const session_id = search.get("session_id");
  const user = JSON.parse(localStorage.getItem("user"));
  const { loading, success, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  // Vérification du paiement
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data } = await axios.post(
          "/api/v1/payment/verification",
          { session_id },
          { headers: { "Content-Type": "application/json" } }
        );
        const { success, emailSent } = data;
        if (success) {
          setIsVerified(true);
          toast.success(
            emailSent
              ? `Payment verified, email sent to ${user.email}`
              : "Payment verified",
            { position: "top-center", autoClose: 30000 }
          );
        } else {
          setVerificationErr("Payment verification failed. Please refresh or retry.");
        }
      } catch (err) {
        setVerificationErr("Error verifying payment.");
        toast.error(err.message || "Payment verification error", {
          position: "top-center",
          autoClose: 30000,
        });
      }
    };
    verifyPayment();
  }, [session_id, user]);

  // Création de la commande
  useEffect(() => {
    if (isVerified) {
      const createOrderData = async () => {
        try {
          const shippingInfo = JSON.parse(localStorage.getItem("shippingInfo"));
          const cartItems = JSON.parse(localStorage.getItem("cartItems"));
          const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));
          if (!orderItem || !cartItems || !shippingInfo) return;

          const orderData = {
            shippingInfo,
            orderItems: cartItems.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              product: item.product,
            })),
            paymentInfo: { id: session_id, status: "succeeded" },
            itemPrice: orderItem.subtotal,
            taxPrice: orderItem.tax,
            shippingPrice: orderItem.shipping,
            totalPrice: orderItem.total,
          };

          await dispatch(createOrder(orderData)).unwrap();
          dispatch(clearCart());
          sessionStorage.removeItem("orderItem");
          localStorage.removeItem("shippingInfo");
        } catch (err) {
          toast.error(err.message || "Order creation error", {
            position: "top-center",
            autoClose: 30000,
          });
        }
      };
      createOrderData();
    }
  }, [isVerified, dispatch, session_id]);

  // Gestion des succès et erreurs Redux
  useEffect(() => {
    if (success) {
      toast.success("Order placed successfully", {
        position: "top-center",
        autoClose: 30000,
      });
      dispatch(clearCart());
      dispatch(removeSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error || "Failed to create order", {
        position: "top-center",
        autoClose: 30000,
      });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  // Rendu principal
  return (
    <>
      <PageTitle title="payment||status" />
      <div className="payment-success-container">
        {verificationErr ? (
          <div className="success-content">
            {verificationErr}
            <Link to="/order/confirm" className="explore-btn">
              Go Back
            </Link>
          </div>
        ) : loading ? (
          <Loader />
        ) : (
          <div className="success-content">
            <div className="success-icon">
              <div className="checkmark"></div>
            </div>
            <h1>Order Confirmed</h1>
            <p>
              Your payment was successful. Reference ID:{" "}
              <strong>{session_id}</strong>
            </p>
            <Link to="/orders/user" className="explore-btn">
              View Orders
            </Link>
          </div>
        )}
      </div>
      <NavBar />
      <Footer />
    </>
  );
}

