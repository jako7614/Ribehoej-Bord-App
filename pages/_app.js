import '../styles/globals.css'
import React, { useEffect, useState } from "react";

const Application = ({ Component, pageProps }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])


  if (typeof window === "undefined") {
    return null;
  }
  return (
    mounted && <Component {...pageProps} />
  )
}

export default Application
