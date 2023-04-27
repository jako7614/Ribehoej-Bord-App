import React from "react";
import { useState, useRef } from "react";
import styles from "./started.module.css"

const PreparedTables = (props) => {

    if (props.tables) {
        var tables = [...props.tables].sort((a, b) => {
            return new Date(a.updatedAt) - new Date(b.updatedAt)
        })
    
        return (
            <React.Fragment>
                {tables ? tables.map((table) => {
                    var initialTableStyle = {}
                    var allergiesOnTable = table.guests.find(guest => guest.nuts || guest.lactose || guest.gluten || guest.shell)
                    if (allergiesOnTable) {
                        initialTableStyle["boxShadow"] = "red 0px 0px 0px 3px",
                        initialTableStyle["paddingBottom"] = "0.3vw"
                    } else {
                        initialTableStyle["paddingBottom"] = "0.3vw"
                    }
                    return <div key={table.id} style={initialTableStyle} id={styles.preparedTable}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <h2 style={{fontSize: "1.3vw", margin: 0}}>BORD: {table.id}</h2>
                            <div style={{display: "flex", flexDirection: "row", width: "70%", border: "2px solid black", borderRadius: 12}}>
                                <div style={{display: "flex", flexDirection: "column", alignItems: "center", width: "50%", borderRight: "1px solid black"}}>
                                    <h4 style={{fontSize: "0.7vw", margin: 0, borderBottom: "2px solid black", width: "100%", justifyContent: "center", display: "flex"}}>RETTER</h4>
                                    <h4 style={{fontSize: "0.7vw", margin: 0}}>{table.dishes.length}</h4>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", width: "50%", alignItems: "center", borderLeft: "1px solid black"}}>
                                    <h4 style={{fontSize: "0.7vw", margin: 0, borderBottom: "2px solid black", width: "100%", justifyContent: "center", display: "flex"}}>GÆSTER</h4>
                                    <h4 style={{fontSize: "0.7vw", margin: 0}}>{table.guests.length}</h4>
                                </div>
                            </div>
                        </div>                    
                    </div>
                }) : <></>}
            </React.Fragment>
        ) 
    } else {
        return null;
    }
  
}

export default PreparedTables;