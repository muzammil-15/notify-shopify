import React from 'react'
const logo = "/public/logo.png";

const App = () => {

  const [orderId, setOrderId] = React.useState(10020);

  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  const showNotification = () => {
    const randomPrice = (Math.random() * 500 + 10).toFixed(2);
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const options = {
      body: `Order #${orderId}\n$${randomPrice}, ${itemCount} ${itemCount === 1 ? 'item' : 'items'} from Online Store \nOTHERSIDE`,
      icon: logo,
      badge: logo,
      vibrate: [200, 100, 200],
      timestamp: now.getTime() // Add timestamp for native sorting/display if supported
    };

    const title = `Shopify • www.shopifynotify.com • ${timeString}`;

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        payload: {
          title,
          options
        }
      });
    } else {
      new Notification(title, options);
    }
    setOrderId(prev => prev + 1);
  }

  const notifyMe = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications");
    } else if (Notification.permission === "granted") {
      showNotification();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          showNotification();
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