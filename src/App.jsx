import "./App.css";
import Sidebar from "./assets/components/Sidebar";
import ThreeScene from "./assets/components/ThreeScene";
import "./assets/styles/index.css";

function App() {
  return (
    <div className="App" style={{ width: "100%", height: "100%" }}>
      <Sidebar />
      <ThreeScene />
    </div>
  );
}

export default App;
