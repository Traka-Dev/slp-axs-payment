import "./App.css";
import axios from "axios";

const handleClick = (e) => {
  e.preventDefault();
  const SLP = { tx: 0, value: 0 };
  const AXS = { tx: 0, value: 0 };
  const input_address = document.getElementById("Address");
  const address = input_address.value;
  if (address !== null || address !== "") {
    axios(
      `https://explorer.roninchain.com/api/tokentxs?addr=0x${address}&from=0&size=100&token=ERC20`
    )
      .then(function (response) {
        //Loop to filter AXS & SLP txs
        const allTxs = response.data.results;
        allTxs.every((tx) => {
          // SLP = a8754b9fa15fc18bb59458815510e40a12cd2014
          // AXS = 0x97a9107c1793bc407d6f527b77e7fff4d812bece
          if (SLP.tx !== 0 && AXS.tx !== 0) {
            const axs_p = document.getElementById("axs_response");
            axs_p.innerHTML = `Tx Hash = ${AXS.tx} value = ${AXS.value}`;
            const slp_p = document.getElementById("slp_response");
            slp_p.innerHTML = `Tx Hash = ${SLP.tx} value = ${SLP.value}`;
            return false;
          }
          if (tx.to === "0x6e7d616da7b598e3285f0b1ef1348ebe45cec7c3") {
            if (
              tx.token_address ===
                "0x97a9107c1793bc407d6f527b77e7fff4d812bece" &&
              AXS.tx === 0
            ) {
              AXS.tx = tx.tx_hash;
              AXS.value = parseFloat(tx.value) / 1000000000000000000;
            }
            if (
              tx.token_address ===
                "0xa8754b9fa15fc18bb59458815510e40a12cd2014" &&
              SLP.tx === 0
            ) {
              SLP.tx = tx.tx_hash;
              SLP.value = tx.value;
            }
          }
          return true;
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }
};

function App() {
  return (
    <div className="App">
      <form style={{ paddingTop: "10em" }}>
        <label>
          Address:
          <input type="text" name="Address" id="Address" />
        </label>
        <input type="submit" value="Submit" onClick={handleClick} />
      </form>
      <h3>Last Deposit SLP</h3>
      <p id="slp_response"></p>
      <h3>Last Deposit AXS</h3>
      <p id="axs_response"></p>
    </div>
  );
}

export default App;
