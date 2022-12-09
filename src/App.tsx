import useGnattPlot from "./components/GnattPlot";

function App() {

    const {treeData, gnattData} = useGnattPlot()
    return (
        <div className="App">
            <svg>
                {treeData}
            </svg>
            <svg>
                {gnattData}
            </svg>
        </div>
    )
}

export default App
