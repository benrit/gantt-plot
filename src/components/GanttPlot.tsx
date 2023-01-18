import React, {useEffect, useRef, useState, MouseEvent} from "react";
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
    data: { start: number, length: number, color: string};
    update: Function | undefined;
    setContextMenu: Function;
    color?: string;
}


const GanttNodeSVG = (key: number, x: number, y: number, data: TreeNode_i) => {

    return (
        <g key={key} transform={`translate(${x} ${y})`}>
            <rect x={data.data.start} y={10} width={data.data.length} height={30} stroke={"green"} fill={data.data.color}/>
            <line x1={-3} x2={"100%"} y1={50} y2={50} stroke={"rgba(0,0,0,0.5)"}/>
        </g>
    )
}

const TreeExpanderNode = ({data}: {data: TreeNode_i}) => {
    const x = (data.level * 10);
    const y = 18;

    return (
        <g transform={`translate(${x} ${y})`}
           className={TreeNodeCSS.expander}
           onClick={()=>{
            data.isOpen = !data.isOpen;
            if (data.update) data.update();
        }}>
            <rect x={0} y={0} width={12} height={12} stroke={"black"} fill={"rgba(0,0,0,0.05)"}/>
            <line x1={0} x2={12} y1={6} y2={6} stroke={"black"}/>
            {!data.isOpen && <line x1={6} x2={6} y1={0} y2={12} stroke={"black"}/>}
        </g>
    )
}

const TreeNodeSVG = (key: number, x: number, y: number, data: TreeNode_i) => {

    return (
        <g key={key}
           className={TreeNodeCSS.TreeNode}
           transform={`translate(${x} ${y})`}
           onContextMenu={(e) => {
            e.preventDefault();
            data.setContextMenu(e, data);}}
           onDoubleClick={()=>{console.log("blabla")}}
        >
            <rect
                data-selected={data.isSelected ? "true" : "false"}
                x="0"
                y="0"
                width={294}
                height={50}
                fill={`hsl(${data.index * 60}, 100%, 50%, ${(data.level*0.1)+0.1})`}
            >
            </rect>
            {data.hasChildren && <TreeExpanderNode data={data}/>}
            <text x={15 + (data.level * 10)} y={30}>{data.name}</text>
            <line x1={0} x2={300} y1={50} y2={50} stroke={"rgba(0,0,0,0.5)"}/>
            <rect x={0} y={-3} width={294} height={6} fill={"rgba(100,100,100, 1)"} onMouseEnter={()=>{console.log("[ENTER]")}}/>
        </g>
    )
}

export const createNode = (name: string, parent: TreeNode_i | null): TreeNode_i => {
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
        data: {start: 100, length: 100, color: "red"},
        update: undefined,
        setContextMenu: (event: MouseEvent) => {
            console.log(event);
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

        if (hasChildren && tn.isOpen) {
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



export default function GanttPlot({data, dataManager}: {data: any, dataManager: any}) {
    const {showContext, contextMenu} = useContextMenu(
        [{
            name: "Add below", fn: (d: TreeNode_i) => {
                d.parent?.children.splice(d.index + 1, 0, createNode(`new node ${d.index}`, d.parent));
                update();
            }
        },
            {
                name: "Insert",
                fn: (d: TreeNode_i) => {
                    d.children.push(createNode(`new Child ${d.index}`, d));
                    update();
                }
            }
        ]
    );

    dataManager.insert("hello");

    const [entries, setEntries] = useState<{
        treeData: JSX.Element[],
        gnattData: JSX.Element[],
        contextMenu: JSX.Element | undefined | any,
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

        const tree = flattenTree(data, update, (event: MouseEvent<HTMLDivElement>, element: any) => {
            showContext(event, element);
        });

        tree.forEach((item, index) => {
            tempTree.push(TreeNodeSVG(index, 5, (index * 50) + 10, item))
            tempGnatt.push(GanttNodeSVG(index, 5, (index * 50) + 10, item))
        })

        setEntries(() => {
            return {
                treeData: tempTree,
                gnattData: tempGnatt,
                contextMenu: contextMenu,
                metadata: {height: (tree.length * 50) + 50}
            }
        });
    }

    useEffect(() => {
        update();
    }, [])

    return (
        <div className="App">
            <div style={{display: "flex", height: 500, overflowY: "auto"}}>
                <svg height={entries.metadata.height}
                     style={{flex: "none", width: 300, backgroundColor: "lightgray", border: "1px solid black"}}>
                    {entries.treeData}
                </svg>
                <svg height={entries.metadata.height} style={{flex: "auto", border: "1px solid black"}}>
                    {entries.gnattData}
                </svg>
            </div>
            {contextMenu}
        </div>
    );
}