import {useEffect, useRef, useState, MouseEvent} from "react";
import styles from "./ContextMenu.module.css";


export default function useContextMenu() {
    const contextRef = useRef<any>();
    const [show, setShow] = useState<boolean>(false);
    const [pos, setPos] = useState({x: 0, y: 0});


    useEffect(()=>{
        if (contextRef && show)
        {
            contextRef.current.focus();
        }
    }, [show])

    return {
        showContext: (event: MouseEvent<HTMLDivElement>)=>{
            setPos({x: event.clientX, y: event.clientY});
            setShow(true);
        },
        contextMenu :  ( show ?
            <div
                className={styles.ContextMenu}
                style={{left: pos.x, top: pos.y}}
                tabIndex={0}
                ref={contextRef}
                onBlur={()=>{
                    setShow(false);
                }}
            >
            </div> : <div ref={contextRef}>no Menu</div>
        )
    }
}