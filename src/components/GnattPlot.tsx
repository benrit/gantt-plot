import React, {useEffect, useState} from "react";
import TreeNodeCSS from "./TreeNode.module.css";


interface TreeNode_i {
    name: string;
    parent: TreeNode_i | null;
    isOpen: boolean;
    isEditing: boolean;
    isSelected: boolean;
    hasChildren: boolean;
    children: TreeNode_i[];
    level: number;
    index: number;
    data: any;
}

interface TreeNodeSVG_i {
    x: number;
    y: number;
    data: TreeNode_i
}

interface GnattNodeSVG_i {
    x: number;
    y: number;
    text: string
}

const GnattNodeSVG = (key: number, x: number, y: number, data: TreeNode_i) => {

    return (
        <g key={key} className={TreeNodeCSS.TreeNode} transform={`translate(${x} ${y})`}>
            <line x1={-3} x2={"100%"} y1={50} y2={50} stroke={"rgba(0,0,0,0.5)"}/>
        </g>
    )
}


const TreeNodeSVG = (key: number, x: number, y:number, data: TreeNode_i) => {

    return (
        <g key={key} className={TreeNodeCSS.TreeNode} transform={`translate(${x} ${y})`}>
            <rect
                data-selected={data.isSelected ? "true" : "false"}
                x="0"
                y="0"
                width={294}
                height={50}>
            </rect>
            {data.hasChildren && <text y={30} className={TreeNodeCSS.expander}>+</text>}
            <text x={10} y={30}>{data.name}</text>
            <line x1={0} x2={300} y1={50} y2={50} stroke={"rgba(0,0,0,0.5)"}/>
        </g>
    )
}

const createNode = (name: string, parent: TreeNode_i | null): TreeNode_i => {
    return {
        name: name,
        parent: parent,
        isOpen: true,
        isEditing: false,
        isSelected: false,
        hasChildren: false,
        children: [],
        index: 0,
        level: 0,
        data: {}
    };
}

const flattenTree = (tree: TreeNode_i): TreeNode_i[] => {

    const temp: TreeNode_i[] = []

    const iter = (tn: TreeNode_i, level: number, index: number) => {
        const hasChildren = tn.children && tn.children.length > 0;

        tn.level = level;
        tn.index = index;
        tn.hasChildren = hasChildren;

        temp.push(tn);

        if (hasChildren) {
            tn.children.forEach((n, ii) => {
                iter(n, level+1, ii);
            })
        }
    }

    tree.children.forEach((item, ii) => {
        iter(item, 0, ii)
    })

    return temp;
}

const root = createNode("root", null);

for (let i = 0; i < 10; ++i) {

    root.children.push(createNode(`Node${i}`, root))
}

const temp = createNode("Node51", root.children[5])
temp.isSelected = true;
root.children[5].children.push(temp)


export default function useGnattPlot() {
    const [entries, setEntries] = useState<{ treeData: JSX.Element[], gnattData: JSX.Element[] }>({
        gnattData: [],
        treeData: []
    })

    useEffect(() => {
        const tempTree: JSX.Element[] = []
        const tempGnatt: JSX.Element[] = []

        const tree = flattenTree(root);

        tree.forEach((item, index)=>{
            tempTree.push(TreeNodeSVG(index, 5, (index*50)+20, item))
            tempGnatt.push(GnattNodeSVG(index, 5, (index*50)+20, item))
        })

        setEntries(() => {
            return {treeData: tempTree, gnattData: tempGnatt}
        });
    }, [])


    return entries
}