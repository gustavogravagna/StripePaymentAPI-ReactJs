import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import "bootswatch/dist/zephyr/bootstrap.min.css"
import "./App.css";

const stripePromise = loadStripe(
  "pk_test_51L5H8jB7nTOqwGMbkypoG67MAIhnJgD1vE9tiVrDYMn90RmxmHBnjeRXbWxo2zvOEtJkQ4GGlO8xrYpsidFTgzIl00T0ODw26o"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    setLoading(true);

    if (!error) {
      const { id } = paymentMethod;
      try {
        const { data } = await axios.post(
          "http://localhost:3002/api/checkout",
          {
            id,
            amount: 3000, // cents
          }
        );
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);

      // LIMPIA LA VENTANA DE LA TARGETA
      elements.getElement(CardElement).clear();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body">
      <img
        src="https://demadera.website/wp-content/uploads/2020/05/geometricas-lamparas-modernas-triangulares.jpg"
        alt="keyboard t847"
        className="img-fluid"
      />
      <h3 className="text-center mt-3 mb-2">Price: 30 $</h3>
      <div className="form-group">
        <CardElement className="form-control" />
      </div>

      <button disabled={!stripe} className="mt-5 btn btn-success">
        {loading ? (
          <div className="spinner-border text-primary" role="status">
            <span class="sr-only"></span>
          </div>
        ) : (
          "BUY"
        )}
      </button>
    </form>
  );
};

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
