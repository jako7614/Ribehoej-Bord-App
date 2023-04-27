import React, { useEffect, useState } from "react";
import styles from '../pages/room/room.module.css'


const StartModal = ({ StartTable, currentTable: table, setShowModal, PrepareTable }) => {
    const [dishNumber, setDishNumber] = useState(4)
    const [guestNumber, setGuestNumber] = useState(2)
    const [guests, setGuests] = useState([])
    const [textArea, setTextArea] = useState()

    const HandleDishChange = (event) => {
        var button = event.target
        if (button.innerHTML === "+" && dishNumber <= 5) {
            setDishNumber(dishNumber + 1)
        } else if (button.innerHTML === "-" && dishNumber >= 3) {
            setDishNumber(dishNumber - 1)
        }
    }

    const HandleGuestChange = (event) => {
        var button = event.target
        if (button.innerHTML === "+" && guestNumber < 99) {
            setGuestNumber(Number(guestNumber) + 1)
        } else if (button.innerHTML === "-" && guestNumber > 1) {
            setGuestNumber(guestNumber - 1)
        }
    }

    const HandleAllergicGuestCheckbox = (allergy, guest) => {
        setGuests(guests.map(gue => {
            if (gue == guest) {
                gue[allergy] = !gue[allergy]
            }
            return gue;
        }))
    }

    const HandleTextAreaChange = (event) => {
        setTextArea(event.target.value)
    }

    return (
        <div className={styles.Modal}>
            <div id={styles.ModalHeader}>Bord {table.id}</div>
            
            <div id={styles.SelecterDiv}>
                
                <button type="button" id={styles.ModalAddAllergies} onClick={() => {
                    if (guests.length < guestNumber) {
                        var newGuest = {
                            lactose: false, 
                            gluten: false, 
                            shell: false, 
                            nuts: false
                        }
                        setGuests(guests => [...guests, newGuest])
                    }
                }}>Tilføj Allergiker</button>
                <div>
                    <h4 className={styles.DishSelecterDiv}>Retter</h4>
                    <div className={styles.DishSelecterDiv}>
                        <button style={{ borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px", fontSize: "2vw" }} onClick={HandleDishChange}>-</button>
                        <input type="number" onInput={(e) => { 
                            var value = 0;

                            if (e.target.value.length > 1) value = e.target.value[1];

                            var value = value < 2 ? 2 : value > 6 ? 6 : value
                            setDishNumber(value)
                        }} value={dishNumber} className={styles.numberInput}></input>
                        <button style={{ borderBottomRightRadius: "4px", borderTopRightRadius: "4px", fontSize: "2vw" }} onClick={HandleDishChange}>+</button>
                    </div>
                </div>
                <div>
                    <h4 className={styles.GuestSelecterDiv}>Gæster</h4>
                    <div className={styles.GuestSelecterDiv}>
                        <button style={{ borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px", fontSize: "2vw" }} onClick={HandleGuestChange}>-</button>
                        <input type="number" onInput={(e) => { 
                            var value = e.target.value < 1 ? 1 : e.target.value > 99 ? 99 : e.target.value
                            setGuestNumber(value)
                        }} value={guestNumber} className={styles.numberInput}></input>
                        <button style={{ borderBottomRightRadius: "4px", borderTopRightRadius: "4px", fontSize: "2vw" }} onClick={HandleGuestChange}>+</button>
                    </div>
                </div>
            </div>
            <form id={styles.ModalForm} onSubmit={(event) => {
                event.preventDefault()
                PrepareTable(table, dishNumber, guests, guestNumber, textArea)
            }}>
                <div id={styles.ModalAllergiesHeaders}>
                    <h2>Gluten</h2>
                    <h2>Laktose</h2>
                    <h2>Skalddyr</h2>
                    <h2>Nødder</h2>
                </div>
                <div className={styles.AllergicGuestList}>
                    {guests.map((guest, index) => {
                        return(
                            <div className={styles.AllergicGuest} key={index}>
                                <div className={styles.AllergicGuestHeader}>
                                    <button type="button" onClick={() => setGuests(guests.filter(x => x != guest))}>X</button>
                                    <h2>Person</h2>
                                </div>
                                <div className={styles.AllergicGuestSelecter}>
                                    <label className={styles.container}>
                                        <input type="checkbox" onChange={() => HandleAllergicGuestCheckbox("gluten", guest)} checked={guest.gluten}/>
                                        <div className={styles.checkmark}></div>
                                    </label>
                                    <label className={styles.container}>
                                        <input type="checkbox" onChange={() => HandleAllergicGuestCheckbox("lactose", guest)} checked={guest.lactose}/>
                                        <div className={styles.checkmark}></div>
                                    </label>
                                    <label className={styles.container}>
                                        <input type="checkbox" onChange={() => HandleAllergicGuestCheckbox("shell", guest)} checked={guest.shell}/>
                                        <div className={styles.checkmark}></div>
                                    </label>
                                    <label className={styles.container}>
                                        <input type="checkbox" onChange={() => HandleAllergicGuestCheckbox("nuts", guest)} checked={guest.nuts}/>
                                        <div className={styles.checkmark}></div>
                                    </label>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.ButtonsContainer}>
                    <textarea id={styles.ModalNoteTextBox} placeholder="Tilføj Note" onChange={HandleTextAreaChange}></textarea>
                    
                    <div id={styles.ModalFooter}>
                        <button className={styles.ModalFooterButtons} id={styles.ModalFooterCancel} type="button" onClick={() => {
                            setGuests([])
                            setShowModal(false)
                        }}>Annuller</button>
                        <button className={styles.ModalFooterButtons} id={styles.ModalFooterAccept} type="submit">Klargør</button>
                    </div>
                </div>
            </form>
        </div>
    )
}


export default StartModal;