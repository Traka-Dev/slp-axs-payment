import axios from "axios";

const TX = { inputs: [], outputs: [] };

const explorerCall = (addr) => {
    axios(
            `https://explorer.roninchain.com/api/tokentxs?addr=${addr}&from=0&size=100&token=ERC20`
        )
        .then(function(response) {
            //Loop to filter AXS & SLP txs
            const allTxs = response.data.results;
            //Validate response
            if (allTxs.length > 0) {
                const trace = traceTXs(allTxs, addr);
                TX.inputs.push(...trace.inputs);
                TX.outputs.push(...trace.outputs);
                // IF THERE IS RISK keep digging
                /*
                If input is not from manager track
                2 lvls if SLP is not in cashout wallet major redflag
                */
                console.dir(trace);
            }
        })
        .catch(function(error) {
            // handle error
            console.log(error);
        });
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

export { explorerCall, formatRonin };