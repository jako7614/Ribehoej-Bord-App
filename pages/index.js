import React from 'react';
import styles from "../styles/Overview.module.css"
import Link from "next/link"

const App = () => {
    return (
        <React.Fragment>
            
            <h1 className={styles.title}>Ribehøj Bord System</h1>  

            
            <div className={styles.wrapper}>   

                <Link href="/room/3">
                    <a className={`${styles.trapezoid} ${styles.sidepieces} ${styles.left}`}>3</a>
                </Link>
                <Link href="/room/2">
                    <a className={`${styles.trapezoid} ${styles.middle}`}>2</a>
                </Link>
                <Link href="/room/1">
                    <a className={`${styles.trapezoid} ${styles.sidepieces} ${styles.right}`}>1</a>
                </Link>
            </div>
        </React.Fragment>
    )
}

export default App;