import React, { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { useState } from "react";

const faqs = [
  {
    title: "Where are these chairs assembled?",
    text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium, quaerat temporibus quas dolore provident nisi ut aliquid ratione beatae sequi aspernatur veniam repellendus.",
  },
  {
    title: "How long do I have to return my chair?",
    text: "Pariatur recusandae dignissimos fuga voluptas unde optio nesciunt commodi beatae, explicabo natus.",
  },
  {
    title: "Do you ship to countries outside the EU?",
    text: "Excepturi velit laborum, perspiciatis nemo perferendis reiciendis aliquam possimus dolor sed! Dolore laborum ducimus veritatis facere molestias!",
  },
];

// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

export default function App() {
  const [value, setValue] = useState(null);
  const [currency1, setCurrency1] = useState("USD");
  const [currency2, setCurrency2] = useState("INR");
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      const controller = new AbortController();

      async function calculateCoversion() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${value}&from=${currency1}&to=${currency2}`,
            { signal: controller.signal }
          );
          if (res.message) throw new Error("Something went wrong!!!");

          let data = await res.json();
          console.log(data.rates);
          setOutput(data.rates[currency2]);
          setIsLoading(false);
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        }
      }

      if (!value) {
        setOutput(value);
        return;
      }

      if (currency1 === currency2) {
        setOutput(value);
        return;
      }

      calculateCoversion();
      return function () {
        controller.abort();
      };
    },
    [value, currency1, currency2]
  );

  return (
    <div className="container">
      <input
        type="text"
        className="input-text"
        onChange={(e) => setValue(e.target.value)}
      />
      <select
        className="select-input"
        onClick={(e) => setCurrency1(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        className="select-input"
        onClick={(e) => setCurrency2(e.target.value)}
        disabled={isLoading}
      >
        <option value="INR">INR</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
      </select>
      <p className="output-text">{output ? `${output} ${currency2}` : null}</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
