import axios from "axios";

const payment = (address, amount) => {
  // Get Address Balance
  const AXS = { tx: 0, value: 0 };
  if (address !== null || address !== "") {
    //Formar Address
    const addr = formatRonin(address);
    console.log(";D");
    axios(
      `https://explorer.roninchain.com/api/txs/${addr}?from=0&size=100&token=ERC20`
    )
      .then(function (response) {
        //Loop to filter AXS & SLP txs
        const allTxs = response.data.results;
        allTxs.every((tx) => {
          // AXS = 0x97a9107c1793bc407d6f527b77e7fff4d812bece
          if (AXS.value >= amount) {
            console.log("PAGADO");
            return false;
          }
          if (tx.to === `0x${address}`) {
            if (
              tx.token_address === "0x97a9107c1793bc407d6f527b77e7fff4d812bece"
            ) {
              AXS.tx = tx.tx_hash;
              AXS.value =
                AXS.value + parseFloat(tx.value) / 1000000000000000000;
            }
          }
          return true;
        });
        console.log("SIN PAGO");
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  } else {
    console.log("ERROR Invalid Address");
  }
};

const formatRonin = (address) => {
  console.log(address);
  return address;
};
