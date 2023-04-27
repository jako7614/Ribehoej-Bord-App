import React from "react";
import { useState, useRef } from "react";
import styles from "./started.module.css"

import AllergicGuests from "./../components/AllergicGuests.jsx"
import useLongPress from "./useLongPress";

const StartedTables = (props) => {

    const handleAdvanceTable = (table) => {
        if (props.advanceTable) {
            props.advanceTable(table)
        }
    }

    const handleDeadvanceTable = (table) => {
        if (props.deadvanceTable) {
            props.deadvanceTable(table)
        }
    }

    const timerRef = useRef();
    const isLongPress = useRef();

    const startPressTimer = () => {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        }, 500)
    }

    const handleOnClick = (table) => {
        console.log('Click');
        if ( isLongPress.current && props.deAdvancable ) {
            console.log('Long Click')
            handleDeadvanceTable(table)
            return;
        }
        handleAdvanceTable(table)
    }

    const handleOnMouseDown = () => {
        console.log('MouseDown');
        startPressTimer();
    }

    const handleOnMouseUp = () => {
        console.log('MouseUp');
        clearTimeout(timerRef.current);
    }

    const handleOnTouchStart = () => {
        console.log('TouchStart');
        startPressTimer();
    }

    const handleOnTouchEnd = (table) => {
        if ( isLongPress.current && props.deAdvancable) {
            console.log('Long Touch')
            handleDeadvanceTable(table)
            return;
        }
        console.log('TouchEnd');
        clearTimeout(timerRef.current);
    }

    if (props.tables) {
        var tables = [...props.tables].sort((a, b) => {
            return new Date(a.updatedAt) - new Date(b.updatedAt)
        })
    
        return (
            <React.Fragment>
                {tables ? tables.map((table) => {
                    var dishArray = table.dishes
                    var currentDish = dishArray.find(x => x.state !== 4)
                    var dishNumber = dishArray.indexOf(currentDish) + 1
    
                    return <div key={table.id} className={styles.table} onClick={() => handleOnClick(table)} onMouseDown={handleOnMouseDown} onMouseUp={handleOnMouseUp} onTouchStart={handleOnTouchStart} onTouchEnd={() => handleOnTouchEnd(table)}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}}>
                            <h1>BORD: {table.id}</h1>
                            <div style={{display: "flex", flexDirection: "row", width: "80%", border: "2px solid black", borderRadius: 12}}>
                                <div style={{display: "flex", flexDirection: "column", alignItems: "center", width: "50%", borderRight: "2px solid black"}}>
                                    <h2 style={{fontSize: "1vw", margin: 0, borderBottom: "2px solid black", width: "100%", justifyContent: "center", display: "flex"}}>RET</h2>
                                    <h2 style={{fontSize: "1vw", margin: 0}}>{dishNumber} / {table.dishes.length}</h2>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", alignItems: "center", width: "50%"}}>
                                    <h2 style={{fontSize: "1vw", margin: 0, borderBottom: "2px solid black", width: "100%", justifyContent: "center", display: "flex"}}>GÆSTER</h2>
                                    <h2 style={{fontSize: "1vw", margin: 0}}>{table.guests.length}</h2>
                                </div>
                            </div>
                        </div>
                        {table.note ? <div id={styles.NoteDiv}>
                            <h4>Note</h4>
                            <p>{table.note}</p>
                        </div> : <></>}
                        
                        <AllergicGuests guests={table.guests}/>
                    </div>
                }) : <></>}
            </React.Fragment>
        ) 
    } else {
        return null;
    }
  
}

export default StartedTables;