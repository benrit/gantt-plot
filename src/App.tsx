import useGanttPlot from "./components/GanttPlot";

import './App.css';

function App() {
    const {treeData, gnattData, contextMenu, metadata} = useGanttPlot()

    return (
        <div className="App" >
            <div style={{display: "flex", height: 500, overflowY: "auto"}}>
            <svg height={metadata.height} style={{flex: "none", width: 300, backgroundColor: "lightgray", border: "1px solid black"}}>
                {treeData}
            </svg>
            <svg height={metadata.height} style={{flex: "auto", border: "1px solid black"}}>
                {gnattData}
            </svg>
            </div>

            {contextMenu}
        </div>
    )
}

export default App
