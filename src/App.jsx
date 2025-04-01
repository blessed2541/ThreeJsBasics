import "./App.css";
import Sidebar from "./assets/components/Sidebar";
import ThreeSceneCube from "./assets/components/ThreeSceneCube";
import ThreeSceneImport from "./assets/components/ThreeSceneImport";
import "./assets/styles/index.css";

function App() {
  return (
    <div className="App" style={{ width: "100%", height: "100%" }}>
      <Sidebar />
      {/*<ThreeSceneCube />*/}
      <ThreeSceneImport />
    </div>
  );
}

export default App;
