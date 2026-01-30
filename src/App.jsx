import React from 'react'
import logo from './assets/logo.png'

const App = () => {

  const notifyMe = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      new Notification("Fakely Pro • www.fakely-pro.com • 1m", {
        body: "Order #10020\n$500.00, 1 item from Online Store \nOTHERSIDE",
        icon: logo,
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Fakely Pro • www.fakely-pro.com • 1m", {
            body: "Order #10020\n$500.00, 1 item from Online Store \nOTHERSIDE",
            icon: logo,
          });
        }
      });
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Shopify Alert System</h1>
      <button
        onClick={notifyMe}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#008060', // Shopify green
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Notify Me
      </button>
    </div>
  )
}

export default App