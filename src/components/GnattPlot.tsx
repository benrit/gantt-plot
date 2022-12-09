import React, {useEffect, useState} from "react";


interface TreeNodeSVG_i{
    x: number;
    y: number;
    text: string
}



const GnattNodeSVG = () => {

}


const TreeNodeSVG = ({x, y, text}: TreeNodeSVG_i) => {

    return(
        <g transform={`translate(${x} ${y})`}>
            <text>{text}</text>
        </g>
    )
}

export default function useGnattPlot(){
    const [entries, setEntries] = useState<{treeData: JSX.Element[], gnattData: JSX.Element[]}>({gnattData: [], treeData:[]})

    useEffect(()=>{
        const temp:JSX.Element[] = []
        for (let i = 0; i < 10; i++) {
                temp.push( TreeNodeSVG({x: 10, y:(i*25)+10, text: "test"}))
            }

        setEntries((prevState)=>{
            return {treeData: temp, gnattData: temp}
        });
        }, [])


    return entries
}