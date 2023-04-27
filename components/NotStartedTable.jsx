import React, { useEffect, useState } from "react";
import styles from './table.module.css'

const NotStartedTable = (props) => {
    const [amountOfDishes, setAmountOfDishes] = useState(4)
    const [amountOfGuests, setAmountOfGuests] = useState(2)

    
    const HandleDishChange = (event) => {
        var button = event.target
        let tempDishNumber = amountOfDishes
    
        if (button.innerHTML === "+" && amountOfDishes <= 4) {
            setAmountOfDishes(amountOfDishes + 2)
            tempDishNumber += 2
        } else if (button.innerHTML === "-" && amountOfDishes >= 4) {
            setAmountOfDishes(amountOfDishes - 2)
            tempDishNumber -= 2
        }
    }
    
    const HandleGuestsChange = (event) => {
        var button = event.target
        let tempGuestNumber = amountOfGuests
    
        if (button.innerHTML === "+" && amountOfGuests <= 4) {
            setAmountOfGuests(amountOfGuests + 2)
            tempGuestNumber += 2
        } else if (button.innerHTML === "-" && amountOfGuests >= 4) {
            setAmountOfGuests(amountOfGuests - 2)
            tempGuestNumber -= 2
        }
    }
    
    const ResetSingleTable = () => {
        console.log("Reset table " + props.table.id)
        props.socket.emit("resetsingletable", props.table)
    }

    return (
        <div className={styles.TableContainer}>
            {!props.table.moving ?
            <>
                {props.table.moved && !props.locked ? 
                    <div style={{ position: "absolute", top: "0", width: "60px", height: "30px", background: "#999999", color: "white", justifyContent: "center", alignItems: "center", display: "flex", borderRadius: "4px 0 0 0" }} onClick={() => {
                        ResetSingleTable()
                    }}>Reset</div> 
                : <></> }
                <div className={styles.TableMidContent} style={props.table.moved ? { marginLeft: "6px", position: "absolute", gap: 10} : {}}>
                    <div className={styles.TableNumber} style={props.table.moved ? { fontSize: "48px" } : {}}>{props.table.id}</div>
                    {props.table.prepared ? <p>Klargjort</p> : <></>}
                </div>
                {props.table.moved ? <div style={{display: "flex", flexDirection: "column", position: "absolute", right: 0, top: 0, height: "100%"}}>
                    <button className={styles.PrepareButton} onClick={() => {
                        if (!props.locked) return;
                        props.setShowModal(true)
                        props.setCurrentTable(props.table)
                    }}>Klargør</button>
                    <button className={styles.StartButton} onClick={() => {
                        if (!props.locked) return;
                        if (!props.table.prepared) {
                            alert("Bordet skal klargøres for at startes")
                            return
                        }
                        props.StartTable(props.table)
                    }}>Start</button> 
                </div> : <></>}
                
            </> : <></>}
        </div>

    )
}

export default NotStartedTable;