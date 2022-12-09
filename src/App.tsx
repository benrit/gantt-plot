import useGnattPlot from "./components/GnattPlot";
import './App.css';

function App() {

    const {treeData, gnattData} = useGnattPlot()
    return (
        <div className="App" style={{display: "flex", height: 500, overflowY: "auto"}}>
            <svg height={800} style={{flex: "none", width: 300, backgroundColor: "lightgray"}}>
                {treeData}
            </svg>
            <svg height={800} style={{flex: "auto", backgroundColor: "rgba(0,0,0, 0.2)"}}>
                {gnattData}
            </svg>
        </div>
    )
}

export default App
