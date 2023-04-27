import React from "react";
import styles from "./alguests.module.css"

const AllergicGuests = (props) => {

    return (
        props.guests.map((guest, index) => {
            return (
              guest.lactose || guest.gluten || guest.shell || guest.nuts ?
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", border: "2px solid black", width: "80%", borderRadius: "12px"}} key={guest.id}>
                  <h3 style={{borderBottom: "2px solid black", width: "100%", display: "flex", justifyContent: "center", marginTop: 0, marginBlock: "0.3vw", fontSize: "1.2vw"}}>Gæst</h3>
                  <div style={{display: "flex", flexDirection: "row", width: "100%", borderRadius: 12, flexWrap: "wrap"}}>
                      {guest.lactose ? 
                        <div 
                          className={styles.allergy}
                        >
                          <h2 style={{fontSize: "1vw", marginTop: "0.5vw", marginBottom: "0.5vw", width: "55%"}}>Laktose</h2>
                          <div className={styles.alert}><p className={styles.alertText}>!</p></div>
                        </div> :
                        <></>
                      }
                      {guest.gluten ? 
                        <div 
                          className={styles.allergy}
                        >
                          <h2 style={{fontSize: "1vw", marginTop: "0.5vw", marginBottom: "0.5vw", width: "55%"}}>Gluten</h2>
                          <div className={styles.alert}><p className={styles.alertText}>!</p></div>
                        </div> :
                        <></>
                      }
                      {guest.shell ? 
                        <div 
                          className={styles.allergy}
                        >
                          <h2 style={{fontSize: "1vw", marginTop: "0.5vw", marginBottom: "0.5vw", width: "55%"}}>Skaldyr</h2>
                          <div className={styles.alert}><p className={styles.alertText}>!</p></div>
                        </div> :
                        <></>
                      }
                      {guest.nuts ? 
                        <div 
                          className={styles.allergy}
                        >
                          <h2 style={{fontSize: "1vw", marginTop: "0.5vw", marginBottom: "0.5vw", width: "55%"}}>Nødder</h2>
                          <div className={styles.alert}><p className={styles.alertText}>!</p></div>
                        </div> :
                        <></>
                      }
                    </div>
                  </div>
                : <React.Fragment key={guest.id}></React.Fragment>
              )
            })
    )
}

export default AllergicGuests