import React, { useEffect, useState } from 'react';
import styles from "./../../styles/Home.module.css"
import io from "socket.io-client";

import StartedTables from '../../components/StartedTables.jsx';
import PreparedTables from '../../components/PreparedTables.jsx'
let socket



export default function Home() {
  const [allTables, setAllTables] = useState([])  

  const advanceTable = (data) => {
    socket.emit("advancetable", data)
  }

  const deadvanceTable = (data) => {
    socket.emit("deadvancetable", data)
  }

  useEffect(() => {    
    fetch(`/api/observertables`)
      .then(res => res.json())
      .then(json => setAllTables(json))
 
  }, [])
  
  useEffect(() => socketInitializer(), [])

  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()   

    socket.on("tablestartedobserver", (tables) => {      
      setAllTables(tables)
      var audio = new Audio("/sounds/ding.wav")
      audio.play();
    })
    socket.on("tableadvancedobserver", (tables) => setAllTables(tables))
    socket.on("resetobserver", (tables) => setAllTables(tables))
  }  

  return (
    <div className="App">
      <div className={styles.observer}>
        <div id={styles.preparedColumn}>
          <div className={styles.observerHeader} id={styles.preparedHeader}>IKKE STARTET</div>
          <PreparedTables tables={allTables.prepared} deAdvancable={false}/>
        </div>
        <div className={styles.observerColumn} id={styles.awaitingColumn}>
          <div className={styles.observerHeader} id={styles.awaitingHeader}>AFVENTER</div>
          <StartedTables tables={allTables.awaiting} advanceTable={advanceTable} deadvanceTable={deadvanceTable} deAdvancable={false}/>
        </div>
        <div className={styles.observerColumn} id={styles.doingColumn}>
          <div className={styles.observerHeader} id={styles.doingHeader}>I GANG</div>
          <StartedTables tables={allTables.active} advanceTable={advanceTable} deadvanceTable={deadvanceTable} deAdvancable={true}/>
        </div>
        <div className={styles.observerColumn} id={styles.readyColumn}>
          <div className={styles.observerHeader} id={styles.readyHeader}>KLAR TIL AFHENTNING</div>
          <StartedTables tables={allTables.ready} advanceTable={advanceTable} deadvanceTable={deadvanceTable} deAdvancable={true}/>
        </div>
      </div>
    </div>
  );
}