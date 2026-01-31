import React from 'react'
const logo = "/public/logo.png";

const App = () => {

  const [orderId, setOrderId] = React.useState(10020);
  const [storeName, setStoreName] = React.useState("My Store");

  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  const generateIcon = (imgSrc) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 192; // Standard icon size
      canvas.width = size;
      canvas.height = size;

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imgSrc;

      img.onload = () => {
        // Draw white rounded background
        ctx.fillStyle = 'white';
        // Rounded rect logic
        const radius = size * 0.15; // 15% radius
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(size - radius, 0);
        ctx.quadraticCurveTo(size, 0, size, radius);
        ctx.lineTo(size, size - radius);
        ctx.quadraticCurveTo(size, size, size - radius, size);
        ctx.lineTo(radius, size);
        ctx.quadraticCurveTo(0, size, 0, size - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.fill();

        // Draw image in center with some padding
        const padding = size * 0.01;
        ctx.drawImage(img, padding, padding, size - 2 * padding, size - 2 * padding);

        resolve(canvas.toDataURL());
      };

      img.onerror = () => {
        resolve(imgSrc); // Fallback to original if loading fails
      };
    });
  };

  const showNotification = async () => {
    const randomPrice = (Math.random() * 500 + 10).toFixed(2);
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Generate styled icon
    const styledIcon = await generateIcon(logo);

    const options = {
      body: `Order #${orderId} from Shopify \n$${randomPrice}, ${itemCount} ${itemCount === 1 ? 'item' : 'items'} from Online Store \n${storeName}`,
      icon: styledIcon,
      badge: styledIcon, // Also using it for the badge
      vibrate: [200, 100, 200],
      timestamp: now.getTime() // Add timestamp for native sorting/display if supported
    };

    const title = `${timeString}`;

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