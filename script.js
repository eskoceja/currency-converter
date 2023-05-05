//API Info
const KEY = "Zj3QNdc4AfM537vy6QL0Q60cupYxLGzO";

//Elements
const baseCurrency = document.getElementById("base-currency");
const amountInput = document.getElementById("amount");
const targetCurrency = document.getElementById("target-currency");
const convertedAmount = document.getElementById("converted-amount"); 
const historicalRatesBtn = document.getElementById("historical-rates");
const historicalRatesContainer = document.getElementById(
  "historical-rates-container"
);
const saveFavBtn = document.getElementById("save-favorite");
const saveFavContainer = document.getElementById("favorite-currency-pairs");

//Event Listeners
baseCurrency.addEventListener("change", fetchExchangeRates);
targetCurrency.addEventListener("change", fetchExchangeRates);
amountInput.addEventListener("input",fetchExchangeRates);
historicalRatesBtn.addEventListener("click", showHistoricalRates);
saveFavBtn.addEventListener("click", saveFavoritePair);

let myHeaders = new Headers();
myHeaders.append("apikey", KEY);

let requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};

//FUNCTIONS:

//Fetch Exchange Rates - DONE
function fetchExchangeRates() {
  let to = targetCurrency.value;
  let from = baseCurrency.value;
  let amount = amountInput.value;

  if (!to || !from) {
    alert("Please choose different currencies.");
    return;
  }
  if (isNaN(amount) || amount < 0) {
    alert("Amount cannot be negative.");
    return;
  }
  if (to === from) {
    alert("The base and target currencies are the same. The converted amount is the same as the entered amount.");
        resultSpan.innerText = `${amount.toFixed(2)} ${targetCurrency}`;
        return;
  }

  fetch(
    `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      //fetching data
      const rate = data.info.rate;
      //callingfunction
      convertCurrency(rate);
    })
    .catch((error) => alert("Error fetching data", error));

}

//Convery Currency - DONE
function convertCurrency(result) {
  //currency conversion
  let convertedAmt = amount.value * result;
  //display
  convertedAmount.innerHTML = convertedAmt + " " + targetCurrency.value;
}

//Historical Rates - DONE
function showHistoricalRates() {
  let base = baseCurrency.value;
  let symbol = targetCurrency.value;

  fetch(
    `https://api.apilayer.com/exchangerates_data/2022-05-05?symbols=${symbol}&base=${base}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      //finding data
      const histRate = data.rates; 
      const res = Object.keys(histRate)[0];
      //displaying data
      historicalRatesContainer.innerHTML = "Historical exchange rate on 2022-05-05: 1 " + base + " = " + histRate[res] + " " + symbol
    })
    .catch((error) => alert("Error fetching historical rates data", error));
}

// Save Favorite Pair -DONE
function saveFavoritePair() {
  const base = baseCurrency.value;
  const target = targetCurrency.value;

      if (!base || !target) {
        alert("Please select both the currencies.");
        return;
    }

  // Check if the pair is already saved
  const pairs = JSON.parse(localStorage.getItem("favoritePairs")) || [];
  const pair = `${base}_${target}`;
  if (pairs.includes(pair)) {
    alert("This pair is already saved.");
    return;
  }
  // Save the pair
  pairs.push(pair);
  localStorage.setItem("favoritePairs", JSON.stringify(pairs));

  //display
  const html = pairs.map((p) => `<p>${p}</p>`).join("");
  favoritePairsContainer.innerHTML = html;

  displayFavs(newFav);
}

function displayFavs() {

    const dispbtn = document.createElement("button");
    dispbtn.innerText = `${base} / ${target}`

    dispbtn.addEventListener("click", () => {
        base = baseCurrency;
        target = targetCurrency;
    })
    favoriteCurrencyPairs.appendChild(dispbtn);
    // favoritePairsContainer.innerHTML = html;
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favoriteCurrencyPairs")) || [];

    for (const currencyPair of favorites) {
        displayFavoriteCurrencyPair(currencyPair);
    }
}
//calls the loadFavorites function when the page is loaded
loadFavorites();