import React, {useEffect, useRef, useState} from "react";
import TreeNodeCSS from "./TreeNode.module.css";
import useContextMenu from "./useContextMenu";


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
    update: Function | undefined;
    setContextMenu: Function;
}


interface ContextMenuItem_i {
    name: string;
    func: Function;
}

const GanttNodeSVG = (key: number, x: number, y: number, data: TreeNode_i) => {

    return (
        <g key={key} className={TreeNodeCSS.TreeNode} transform={`translate(${x} ${y})`}>
            <line x1={-3} x2={"100%"} y1={50} y2={50} stroke={"rgba(0,0,0,0.5)"}/>
        </g>
    )
}

const ContextMenu = (list: ContextMenuItem_i[], posX: number, posY: number, setContextMenu: Function) => {
    const MenuRef = useRef<any>();


    return (
        <div ref={MenuRef} onBlur={()=>{setContextMenu(undefined)}} style={{position: "absolute", backgroundColor: "black", padding: "10px", left: posX, top: posY}}>
            <ul style={{listStyle: "none"}}>
                {list.map((item, index) => {
                    return <li key={index} style={{color: "white"}} onClick={() => item.func()}>{item.name}</li>
                })}
            </ul>
        </div>
    )
}

const TreeNodeSVG = (key: number, x: number, y: number, data: TreeNode_i) => {

    return (
        <g key={key} className={TreeNodeCSS.TreeNode} transform={`translate(${x} ${y})`} onContextMenu={(e) => {
            e.preventDefault();
            // const temp = createNode("new node", data.parent);
            // data.parent?.children.splice(data.index + 1, 0, temp);
            // if (data.update) data.update();
            console.log(data.setContextMenu(e));

        }}>
            <rect
                data-selected={data.isSelected ? "true" : "false"}
                x="0"
                y="0"
                width={294}
                height={50}>
            </rect>
            {data.hasChildren && <text x={data.level * 10} y={30} className={TreeNodeCSS.expander}>+</text>}
            <text x={15 + (data.level * 10)} y={30}>{data.name}</text>
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
        data: {},
        update: undefined,
        setContextMenu: (event: MouseEvent) => {
        }
    };
}

const flattenTree = (tree: TreeNode_i, updateFn: Function, contextMenu: Function): TreeNode_i[] => {

    const temp: TreeNode_i[] = []

    const iter = (tn: TreeNode_i, level: number, index: number) => {
        const hasChildren = tn.children && tn.children.length > 0;

        tn.level = level;
        tn.index = index;
        tn.hasChildren = hasChildren;
        tn.update = updateFn;
        tn.setContextMenu = contextMenu;
        temp.push(tn);

        if (hasChildren) {
            tn.children.forEach((n, ii) => {
                iter(n, level + 1, ii);
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

const temp = createNode("Node51", root.children[2])
temp.isSelected = true;
root.children[2].children.push(temp)

export default function useGanttPlot() {

    const {contextMenu, contextMenuFn} = useContextMenu([{name: "bla1"}]);

    const [entries, setEntries] = useState<{
        treeData: JSX.Element[],
        gnattData: JSX.Element[],
        contextMenu: JSX.Element | undefined,
        metadata: any
    }>({
        gnattData: [],
        treeData: [],
        contextMenu: contextMenu,
        metadata: {}
    })

    const update = () => {
        const tempTree: JSX.Element[] = []
        const tempGnatt: JSX.Element[] = []

        const tree = flattenTree(root, update, contextMenuFn);

        tree.forEach((item, index) => {
            tempTree.push(TreeNodeSVG(index, 5, (index * 50) + 10, item))
            tempGnatt.push(GanttNodeSVG(index, 5, (index * 50) + 10, item))
        })

        setEntries(() => {
            return {
                treeData: tempTree,
                gnattData: tempGnatt,
                contextMenu: undefined,
                metadata: {height: (tree.length * 50) + 50}
            }
        });
    }

    useEffect(() => {
        update();
    }, [])

    return entries;
}