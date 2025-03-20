import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const CurrencySelector = () => {
    const { currency, changeCurrency, supportedCurrencies,fetchConversionRate,setFromCurrency,setToCurrency} = useContext(ShopContext);

    return (
        <select
            value={currency}
            onChange={(e) =>{
                fetchConversionRate("INR",e.target.value)
                setFromCurrency("INR")
                setToCurrency(e.target.value)
} }
            className="rounded-md "
        >
            {supportedCurrencies.map((cur) => (
                <option key={cur} value={cur}>
                    {cur}
                </option>
            ))}
        </select>
    );
};

export default CurrencySelector;
