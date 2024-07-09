import { useEffect } from 'react';
import * as Bluetooth from 'react-bluetooth';
import { Link, Route, Routes } from 'react-router-dom';
import { Home } from './screen/Home';
import { AboutUs } from './screen/AboutUs';

function App() {

  useEffect(() => {

  }, [])

  const connect = async () => {
    const isAvailable = await Bluetooth.getAvailabilityAsync();
    if (!isAvailable) {
      return;
    }

    const options = {
      filters: [{ services: ['battery_service'] }],
    };

    try {
      const result = await Bluetooth.requestDeviceAsync(options);
      if (result.type === 'cancel') {
        return;
      }
      const { device } = result;

      console.log(`Bluetooth: Got device:`, device);
      if (device.gatt) {
        const server = await device.gatt.connect();
        console.log(`Bluetooth: Got server:`, server);
        const service = await server.getPrimaryService('battery_service');
        console.log(`Bluetooth: Got service:`, service);
        const characteristic = await service.getCharacteristic('battery_level');
        console.log(`Bluetooth: Got characteristic:`, characteristic);
        const value = await characteristic.readValue();
        console.log(`Bluetooth: Got value:`, value);
        const battery = value.getUint8(0);
        console.log(`Success: Got battery:`, battery);
      } else {
        // TODO: Bacon: Can we connect to the GATT or is that a no-op?
        console.error(`Error: connected device did not have a GATT`);
      }
    } catch ({ message }) {
      console.error(`Error: Couldn't get battery level: ${message}`);
    }

  }

  return (
    <div className="App">
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          height: 200,
          backgroundColor: 'purple',
          fontSize: '20px',
        }}>
          <Link to={'/'}
            style={{ color: 'red' }}>
            Home
          </Link>
          <Link to={'/about'}
            style={{ color: 'orange' }}>
            About
          </Link>
        </div>
      </div>
      <Routes>
        <Route path="/"
          element={<Home />} />
        <Route path="/about"
          element={<AboutUs />} />
      </Routes>
    </div>
  );
}

export default App;
