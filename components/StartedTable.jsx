import React, { useEffect, useState, useRef } from "react";
import { DateTime } from "luxon";

import styles from "./started.module.css"

const StartedTable = (props) => {
    const [time, setTime] = useState("")
    const myRef = useRef(null);

    
    myRef.current = () => {
        var end = DateTime.now();
        var start = DateTime.fromISO(props.table.updatedAt)

        setTime(end.diff(start, "minutes").toFormat("mm:ss"))
    };


    useEffect(() => {
        let id = setInterval(() => {
        myRef.current();
        }, 1000);
        return () => clearInterval(id);
    }, []);

    if (!props.table.dishes) return null;
    
    const firstNotDone = props.table.dishes !== undefined ? props.table.dishes.find(x => x.state != 4) : undefined
    const currentState = firstNotDone !== undefined && firstNotDone.state != 0 ? firstNotDone.state : 4

    const stateSetup = {
        "0": {
            backgroundColor: "",
        },
        "1": {
            status: "Afventer Køkken",
            backgroundColor: "#F3AB23",
            image: "/images/waitingIcon.svg"
        },
        "2": {
            status: "Accepteret",
            backgroundColor: "#008DFF",
            image: "/images/pan.svg"
        },
        "3": {
            status: "Klar til afhentning",
            backgroundColor: "#42CB6B",
            image: "/images/acceptedIcon.svg"
        },
        "4": {
            status: "Afleveret",
            backgroundColor: "#DF4848",
            image: "/images/acceptedIcon.svg"
        },

    }

    const ResetSingleTable = () => {
        console.log("Reset table " + props.table.id)
        props.socket.emit("resetsingletable", props.table)
    }

    const DeadvanceTable = () => {
        console.log("Deadvance table " + props.table.id)
        props.socket.emit("deadvancetable", props.table)
    }

    const { status, backgroundColor, image } = stateSetup[currentState]

    return (
        <div className={styles.container}>
            {props.table.moved && !props.locked ? 
                    <div style={{ position: "absolute", top: "0", right: "0", width: "70px", height: "30px", background: "#999999", color: "white", justifyContent: "center", alignItems: "center", display: "flex", borderRadius: "0 4px 0 0" }} onClick={() => {
                        ResetSingleTable()
                    }}>Reset</div> 
                : <></> }
            {props.table.moved && !props.locked && props.table.updatedAt && (currentState == 1 || currentState == 4) ?
                    <div style={{ position: "absolute", zIndex: "9999", bottom: "0", right: "0", width: "70px", height: "40px", background: "#999999", color: "white", justifyContent: "center", alignItems: "center", display: "flex", borderRadius: "0 0 4px 0" }} onClick={() => {
                        DeadvanceTable()
                    }}>Fortryd</div> 
                : <></> }
            <div className={styles.description}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "120px" }}>
                    <div style={{ height: "32px", fontSize: "24px" }}>{props.table.id} | {time} |</div>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", fontSize: "15px"}}>{status}</div>
                        {currentState == 2 ? <div style={{ fontSize: "12px" }}>Ret tilberedes</div> : <></>}
                    </div>
                    <div className={styles.dishes}>
                    {
                        props.table.dishes ? props.table.dishes.map((dish, index) => <div key={index} style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "5px",
                            backgroundColor: stateSetup[dish.state].backgroundColor != "" ? stateSetup[dish.state].backgroundColor : "white"
                        }}></div>) : <></>
                    }
                    </div>
                </div>
            </div>
            <div className={styles.tableBanner} style={{ backgroundColor }}>
                <img className={styles.image} src={image} />
                {props.allergiesOnTable ? <span className={styles.statusText}>!</span> : <></>}
                {
                    props.table.dishes.every(x => x.state == 4) ? <div className={styles.stateButtons + " " + styles.endTableButton} onClick={() => props.socket.emit("endtable", props.table)}>Afslut</div> : 
                    props.table.dishes.map((dish, index) => {
                        if (props.table.dishes[index].state == 4 && props.table.dishes[index + 1].state == 0) {
                            return <div key={index} className={styles.stateButtons + " " + styles.nextDishButton} onClick={() => props.socket.emit("advancetable", props.table)}>Næste Ret</div>
                        } else if (dish.state == 3) {
                            // return <div key={index} className={styles.stateButtons + " " + styles.readyButton} onClick={() => props.socket.emit("advancetable", props.table)}>Afleveret</div>
                        }
                    })
                }
            </div>
        </div>

    )
}

export default StartedTable;