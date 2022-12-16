import {useState} from "react";


export default function useContextMenu(menuEntries: object[]) {
    const [contextMenu, setContextMenu] = useState<JSX.Element>();

    const contextMenuFn = (event: MouseEvent) => {
        return event
    }


    return {contextMenu ,contextMenuFn}
}