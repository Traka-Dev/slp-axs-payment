import "./App.css";
import { explorerCall, formatRonin } from "./tracker";

const handleClick = (e) => {
  e.preventDefault();  
  const input_scholar_addr = document.getElementById("Address");
  //const input_manager_addr = document.getElementById("Manager_Address");
  const address = input_scholar_addr.value;
  //const MANAGER = input_manager_addr.value;

  if (address !== null || address !== "") {
    //Formar Address
    const addr = formatRonin(address);
    explorerCall(addr);
  }
};

function App() {
  return (
    <div className="App">
      <form style={{ paddingTop: "10em" }}>
        <div>
          <label>
            Scholar Address:
            <input type="text" name="Address" id="Address" />
          </label>
        </div>
        <div>
          <label>
            Manager Address:
            <input type="text" name="Manager_Address" id="Manager_Address" />
          </label>
        </div>
        <input type="submit" value="Submit" onClick={handleClick} />
      </form>
    </div>
  );
}

export default App;
