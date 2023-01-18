import GanttPlot, {createNode} from "./components/GanttPlot";
import './App.css';

function useDataManager() {

    const insert = (self: any, data: any) => {

    }

    return {
        insert
    }
}


function App() {

    const dataManager = useDataManager();

    const root = createNode("root", null);

    for (let i = 0; i < 10; ++i) {
        root.children.push(createNode(`Node${i}`, root))
    }

    const temp = createNode("Node51", root.children[2])
    temp.isSelected = true;
    root.children[2].children.push(temp)

    console.log(root);

    return (<div>
        <GanttPlot data={root} dataManager={dataManager}></GanttPlot>
    </div>)
}

export default App
