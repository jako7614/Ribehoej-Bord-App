import styles from './room.module.css'
import React, { useEffect, useState, useReducer } from "react"
import { ToastContainer, toast, Zoom } from "react-toastify"
import { useRouter } from 'next/router'
import Link from "next/link"
import prisma from './../../lib/prisma'
import Image from "next/image"

import useLongPress from "./../../components/useLongPress";
import 'react-toastify/dist/ReactToastify.css';
import io from "socket.io-client";

import NotStartedTable from "../../components/NotStartedTable"
import StartedTable from "../../components/StartedTable"
import StartModal from "../../components/StartModal"

export default function Room({data}) {
  const router = useRouter()

  const [locked, setLocked] = useState(false)
  const [setup, setSetup] = useState([])
  const [fullscreen, setFullscreen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentTable, setCurrentTable] = useState()
  const [socket, setSocket] = useState({})
  


  const LoadPreset = (e) => {
    var presetnumber = e.target.innerHTML.split(" ")[1]
    socket.emit("loadpreset", { presetnumber: presetnumber, room: router.query.rid })
  }
  
  const SavePreset = (e) => {
    var presetnumber = e.target.innerHTML.split(" ")[1]
    socket.emit("savepreset", { presetnumber: presetnumber, room: router.query.rid, setup: setup })
    toast.success('Preset Saved!');
  }
  
  const longPressEvent = useLongPress(SavePreset, LoadPreset, {
    shouldPreventDefault: true,
    delay: 4000
  })

  const ToggleTableLock = (e) => {
    e.target.innerHTML = e.target.innerHTML == "Lock" ? "Unlock" : "Lock";
    setLocked(!locked)
  }

  const ToggleFullscreen = (e) => {
    if (fullscreen) {
      document.exitFullscreen();
    } else {  
      document.documentElement.requestFullscreen();
    }

    setFullscreen(!fullscreen)    
  }

  const MouseDown = function(e, table) {
    if (locked) return;        
    if (table.started) return;

    // get the mouse cursor position at startup:
    var prevX = e.clientX;
    var prevY = e.clientY;

    var el = document.querySelector(`div[data-table-id="${table.id}"]`) 

    

    // call a function whenever the cursor moves: 

    document.ontouchmove = function(e) {          
  
      // set the element's new position:
      var elm = document.querySelector(`div[data-table-id="${table.id}"]`) 
      
      // calculate the new cursor position:
      var newX = prevX - e.clientX;
      var newY = prevY - e.clientY;
  
      elm.classList.remove(styles.Bounce2)

      // DRAG BY TOP LEFT CORNER
      elm.style.left = (e.touches[0].clientX - elm.clientWidth/2) + "px";
      elm.style.top = (e.touches[0].clientY - elm.clientHeight/2) + "px";
    
    };

    document.onmousemove = function(e) {                  
      // e = e || window.event;
      // e.preventDefault()

      // calculate the new cursor position:
      var newX = prevX - e.clientX;
      var newY = prevY - e.clientY;

      const rect = el.getBoundingClientRect();

      // elm.classList.remove(styles.Bounce2)

      // DRAG BY CENTER
      el.style.left = rect.left - newX + "px";
      el.style.top = rect.top - newY + "px";

      // // DRAG BY CENTER
      // el.style.left = (elm.offsetLeft - pos1 + (pos3 - elm.offsetLeft) - elm.clientWidth/2) + "px";
      // el.style.top = (elm.offsetTop - pos2 + (pos4 - elm.offsetTop) - elm.clientHeight/2) + "px";
      
       
      prevX = e.clientX;
      prevY = e.clientY;
    };


    
    document.ontouchend = () => MouseUp(table)
    document.onmouseup = () => MouseUp(table)
  }

  const MouseUp = function(table) {
      document.onmouseup = null;
      document.onmousemove = null;   
      document.ontouchend = null; 
      document.ontouchmove = null;
      
      var elm = document.querySelector(`div[data-table-id="${table.id}"]`)

      elm.classList.add(styles.Bounce2)

      // DROP DOWN ON TOP LEFT CORNER
      var top = elm.style.top.replace("px", "")
      var left = elm.style.left.replace("px", "")

      elm.style.width = "200px"
      elm.style.height = "125px"

      var board = document.getElementsByClassName(styles.tableBoard)[0]

      const marginTop = board.offsetTop
      const marginLeft = board.offsetLeft
      const outerBottom = marginTop + board.clientHeight
      const outerRight = marginLeft + board.clientWidth
      
      if (top < marginTop) top = marginTop, elm.style.top = marginTop + "px"
      if (top > outerBottom - 125) top = outerBottom - 125, elm.style.top = outerBottom - 125 + "px"
      if (left < marginLeft) left = marginLeft, elm.style.left = marginLeft + "px"
      if (left > outerRight - 200) left = outerRight - 200, elm.style.left = outerRight - 200 + "px"

      table.top = top
      table.left = left
      table.moved = true;
      
      socket.emit("tablemoved", table)
  };

  const StartTable = (table) => {
    socket.emit("tablestarted", {table})

    setShowModal(false)
    console.log("Test")

    toast.success(`Table ${table.id} Started!`);
  }

  const PrepareTable = (table, dishNumber, guests, guestNumber, textArea) => {
    socket.emit("tableprepared", {table, dishNumber, guests, guestNumber, textArea})

    setShowModal(false)

    toast.success(`Table ${table.id} Prepared`)
  }

  const ResetTables = () => { 
    if (router.query.rid != undefined) {      
     socket.emit("tablereset", { rid: router.query.rid })
    }
  }

  const reRender = (data) => {   
    if (data != undefined && router.query.rid != undefined) setSetup(data.filter(x => x.room == router.query.rid))
  }

  useEffect(() => {  

    setSetup(JSON.parse(data).filter(x => x.room == router.query.rid))  
    socketInitializer()
  }, [router.isReady])

  const socketInitializer = () => {
    fetch('/api/socket').finally(() => {
      let socket = io()
  
      socket.on('connect', () => {
        console.log('connected')
      })
      socket.on("rerender", reRender) 
      socket.on("nopreset", () => {
        toast.error(`Preset not found!`);
      })

      setSocket(socket)
    }) 
  }  

  if (router.query.rid == undefined || router.query.rid == null || router.query.rid == -1) return <div>loading...</div>

  return (
    <React.Fragment>
      <main className={styles.main}>
        <div className={styles.tableBoard} style={{backgroundImage: `url('/images/room${router.query.rid != -1 ? router.query.rid : null}.png')`, backgroundSize: "1400px 800px", backgroundRepeat: "no-repeat"}}>
          {setup ? setup.map(table => {
            if (!Array.isArray(table.dishes)) table.dishes = JSON.parse(table.dishes)

            var allergiesOnTable = table.guests.find(guest => guest.nuts || guest.lactose || guest.gluten || guest.shell)
            
            var initialTableStyle = table.moved ? {    
              width: "200px",
              height: "125px"
            } : {}

            initialTableStyle["top"] = table.top + "px"
            initialTableStyle["left"] = table.left + "px"    
            
            if (allergiesOnTable && table.started) initialTableStyle["boxShadow"] = "red 0px 0px 0px 2px"

            return <div
              key={table.id}
              className={"draggable " + styles.table} 
              style={initialTableStyle} 
              data-table-id={table.id} 
              onMouseDown={(e) => MouseDown(e, table)}
              onTouchStart={(e) => MouseDown(e, table)}
            >
              {table.started === false ?
                <NotStartedTable table={table} StartTable={StartTable} setShowModal={setShowModal} setCurrentTable={setCurrentTable} locked={locked} socket={socket}/>
              : 
                <StartedTable table={table} allergiesOnTable={allergiesOnTable} socket={socket} locked={locked}/>
              }            
          </div>}) : <>LOADING</>}
        </div>
        <div className={styles.buttonBox}>
          <button className={styles.button} onClick={ToggleTableLock}>Lock</button>
          {!locked ? <>          
            <button className={styles.button} onClick={ResetTables}>Reset</button>
            <button className={styles.button} {...longPressEvent}>Preset 1</button>
            <button className={styles.button} {...longPressEvent}>Preset 2</button>
            <button className={styles.button} {...longPressEvent}>Preset 3</button>
            <button className={styles.button} onClick={ToggleFullscreen}>Fullscreen</button>
          </> : <></>}
            <Link href="/"><button className={styles.button}>Back</button></Link>
        </div>
        <ToastContainer 
            position={"top-right"}
            autoClose={2500}
            closeOnClick={true}
            pauseOnHover={true}
            draggable={false}
            progress={undefined}
        />
      </main>
      {showModal ? <StartModal StartTable={StartTable} currentTable={currentTable} setShowModal={setShowModal} PrepareTable={PrepareTable}/> : <></>}
    </React.Fragment>
  )
}

export async function getServerSideProps() {
  // Fetch data from external API
  const tables = await prisma.table.findMany({ include: { guests: true, dishes: true }});

  // Pass data to the page via props
  return { props: { data: JSON.stringify(tables) } }
}