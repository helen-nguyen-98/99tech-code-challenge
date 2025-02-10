import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Select from "react-select";
import toast from "react-hot-toast";
import "./SwapForm.scss";
import ImageComponent from "../ImageComponent";
import useDebounce from "../../hooks/useDebounce";
import { formatNumber } from "../../utils/format";

const SwapForm = () => {
  const [tokens, setTokens] = useState([]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const fromAmountDebounced = useDebounce(fromAmount, 500);

  useEffect(() => {
    fetchTokenPrices();
  }, []);

  const fetchTokenPrices = async () => {
    try {
      const response = await axios.get(
        "https://interview.switcheo.com/prices.json"
      );
      const validTokens = response.data.filter((token) => token.price); // Only include tokens with prices
      const tokensGrouped = validTokens.reduce((acc, token) => {
        acc[token.currency] = token;
        return acc;
      }, {});
      const tokens = Array.from(Object.values(tokensGrouped)).map((token) => ({
        value: token.currency,
        label: token.currency,
        price: token.price,
        icon: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token.currency}.svg`,
      }));

      setTokens(tokens);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch token prices");
      setLoading(false);
    }
  };

  const calculateToAmount = useCallback(() => {
    if (!fromToken || !toToken || !fromAmountDebounced) {
      setToAmount("");
      return;
    }
    const fromPrice = fromToken.price;
    const toPrice = toToken.price;
    const convertedAmount = (fromAmountDebounced * fromPrice) / toPrice;
    setToAmount(formatNumber(convertedAmount, 6));
  }, [fromToken, toToken, fromAmountDebounced]);

  useEffect(() => {
    calculateToAmount();
  }, [calculateToAmount]);

  const handleFromAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      if (value < 0) toast.error("Amount cannot be negative");
      if (value < Number.MAX_SAFE_INTEGER) setFromAmount(value);
      else toast.error("Amount is too large");
    }
  };

  const handleSwapTokens = () => {
    const tempFrom = fromToken;
    const tempTo = toToken;
    setFromToken(tempTo);
    setToToken(tempFrom);
    setFromAmount(toAmount);
  };

  const customSelectStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#1a1a1a",
      border: "1px solid #333",
      "&:hover": {
        border: "1px solid #646cff",
      },
      minHeight: "50px",
    }),
    option: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: isFocused ? "#333" : "#1a1a1a",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#333",
      },
    }),
    singleValue: (styles) => ({
      ...styles,
      color: "#fff",
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: "#1a1a1a",
    }),
  };

  const formatOptionLabel = ({ value, icon }) => (
    <div className="select-option">
      <ImageComponent src={icon} className="token-icon" alt={value} />
      <span>{value}</span>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="swap-form">
      <label>From</label>
      <div className="form-wrapper">
        <Select
          options={tokens}
          value={fromToken}
          onChange={(token) => {
            setFromToken(token);
          }}
          formatOptionLabel={formatOptionLabel}
          styles={customSelectStyles}
          className="token-select"
        />
        <input
          type="text"
          value={fromAmount}
          onChange={handleFromAmountChange}
          placeholder="0.0"
          className="from-amount-input"
        />
        <div className="swap-button-wrapper">
          <button className="swap-button" onClick={handleSwapTokens}>
            ↑↓
          </button>
        </div>
      </div>

      <label>To</label>
      <div className="form-wrapper">
        <Select
          options={tokens}
          value={toToken}
          onChange={(token) => {
            setToToken(token);
          }}
          formatOptionLabel={formatOptionLabel}
          styles={customSelectStyles}
          className="token-select"
        />
        <input
          type="text"
          value={toAmount}
          disabled
          placeholder="0.0"
          className="to-amount-input"
        />
      </div>
      <div className="description">
        {fromToken &&
          toToken &&
          `1 ${fromToken?.value} = ${formatNumber(
            fromToken?.price / toToken?.price,
            6
          )} ${toToken?.value}`}
      </div>
    </div>
  );
};

export default SwapForm;
