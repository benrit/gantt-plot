import React, {useEffect, useState} from "react";


interface TreeNodeSVG_i {
    x: number;
    y: number;
    text: string
}


interface GnattNodeSVG_i {
    x: number;
    y: number;
    text: string
}


interface TreeNode_i {
    name: string;
    parent: TreeNode_i;
    isOpen: boolean;
    isEditing: boolean;
    hasChildren: boolean;
    children: TreeNode_i[]
}

const GnattNodeSVG = ({x, y, text}: GnattNodeSVG_i) => {

    return (
        <g transform={`translate(${x} ${y})`}>
            <text dominantBaseline="hanging">{text}</text>
        </g>
    )
}


const TreeNodeSVG = ({x, y, text}: TreeNodeSVG_i) => {

    return (
        <g transform={`translate(${x} ${y})`}>
            <text dominantBaseline="hanging">{text}</text>
        </g>
    )
}

const createNode = (name: string, parent: object | null) => {

    return {
        name: name,
        parent: parent,
        isOpen: true,
        isEditing: false,
        hasChildren: false,
        children: []
    };
}

const flattenTree = (tree: TreeNode_i): TreeNode_i[] => {

    const temp: TreeNode_i[] = []

    const iter = (i: TreeNode_i) => {
        const hasChildren = i.children && i.children.length > 0;
        temp.push(i);

        if (hasChildren) {
            i.children.forEach((n) => {
                iter(n);
            })
        }
    }

    tree.children.forEach((item) => {
        iter(item)
    })

    return temp;
}

export default function useGnattPlot() {
    const [entries, setEntries] = useState<{ treeData: JSX.Element[], gnattData: JSX.Element[] }>({
        gnattData: [],
        treeData: []
    })

    useEffect(() => {
        const tempTree: JSX.Element[] = []
        const tempGnatt: JSX.Element[] = []

        for (let i = 0; i < 10; i++) {
            tempTree.push(TreeNodeSVG({x: 10, y: (i * 25) + 10, text: "Tree"}))
            tempGnatt.push(GnattNodeSVG({x: 10, y: (i * 25) + 10, text: "Gnatt"}))
        }

        setEntries(() => {
            return {treeData: tempTree, gnattData: tempGnatt}
        });
    }, [])


    return entries
}