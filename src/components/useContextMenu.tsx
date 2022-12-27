import {useEffect, useRef, useState, MouseEvent} from "react";
import styles from "./ContextMenu.module.css";


export default function useContextMenu() {
    const contextRef = useRef<any>();
    const [show, setShow] = useState<boolean>(false);

    useEffect(()=>{
        if (contextRef && show)
        {
            contextRef.current.focus();
        }
    }, [show])

    return {
        showContext: (event: MouseEvent<HTMLDivElement>)=>{
            console.log(event);
            setShow(true);
        },
        contextMenu :  ( show ?
            <div
                className={styles.ContextMenu}
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