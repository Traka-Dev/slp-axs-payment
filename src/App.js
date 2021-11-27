import "./App.css";
import axios from "axios";

const handleClick = (e) => {
  e.preventDefault();
  const TX = { inputs: [], outputs: [] };
  const input_address = document.getElementById("Address");
  const address = input_address.value;
  if (address !== null || address !== "") {
    //Formar Address
    const addr = formatRonin(address);
    // `https://explorer.roninchain.com/api/txs/${addr}?from=0&size=100&token=ERC20`
    //  https://explorer.roninchain.com/api/tokentxs?addr=0x8667c797c7f724c599dc89383996f889d8cde647&from=0&size=100&token=ERC20
    // `https://explorer.roninchain.com/_next/data/lme8BrxUUyM4R0uyrfNcF/address/${addr}/tokentxns.json?address=${addr}`
    /*
    block_number: 8605736
    from: "0x8667c797c7f724c599dc89383996f889d8cde647"
    log_index: "177"
    timestamp: 1637394551
    to: "0xe62a74c460e43bcad26e061474872da02bd927fd"
    token_address: "0xa8754b9fa15fc18bb59458815510e40a12cd2014"
    token_decimals: 0
    token_name: "Smooth Love Potion"
    token_symbol: "SLP"
    token_type: "ERC20"
    tx_hash: "0xee0f5cfcd6608879a62fe6727cf68b74ba4ea61079a04f03866819e226359cd1"
    value: "1585"
    */
    axios(
      `https://explorer.roninchain.com/api/tokentxs?addr=${addr}&from=0&size=100&token=ERC20`
    )
      .then(function (response) {
        //Loop to filter AXS & SLP txs
        const allTxs = response.data.results;
        //Validate response
        if (allTxs.length > 0) {
          const trace = traceTXs(allTxs, addr);
          TX.inputs.push(...trace.inputs);
          TX.outputs.push(...trace.outputs);          
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }
};

const formatRonin = (address) => {
  if (address.startsWith("0x")) {
    return address;
  } else if (address.startsWith("ronin:")) {
    address = address.replace("ronin:", "0x");
  }
  return address;
};

const traceTXs = (allTxs, addr) => {
  const response = { inputs: [], outputs: [] };
  allTxs.every((tx) => {
    // SLP = a8754b9fa15fc18bb59458815510e40a12cd2014
    // AXS = 0x97a9107c1793bc407d6f527b77e7fff4d812bece
    if (tx.to.localeCompare(addr) === 0) {
      //Inputs
      const transaction = {
        from: tx.from,
        token: tx.token_symbol,
        value: tx.value,
        hash: tx.tx_hash,
        timestamp: tx.timestamp,
      };
      response.inputs.push(transaction);
    } else if (tx.from.localeCompare(addr) === 0) {
      //Outputs
      const transaction = {
        to: tx.to,
        token: tx.token_symbol,
        value: tx.value,
        hash: tx.tx_hash,
        timestamp: tx.timestamp,
      };
      response.outputs.push(transaction);
    }
    return true;
  });
  return response;
};

function App() {
  return (
    <div className="App">
      <form style={{ paddingTop: "10em" }}>
        <label>
          Address:
          <input type="text" name="Address" id="Address" />
        </label>
        <input type="submit" value="Submit" onClick={handleClick} />{" "}
      </form>
      <h3> Last Deposit SLP </h3> <p id="slp_response"> </p>{" "}
      <h3> Last Deposit AXS </h3> <p id="axs_response"> </p>{" "}
    </div>
  );
}

export default App;
