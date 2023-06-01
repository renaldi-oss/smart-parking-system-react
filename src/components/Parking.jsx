import React, { useEffect, useState } from "react";
import mqtt from "mqtt/dist/mqtt";
import { ReactComponent as MaximizeIcon } from '../assets/icons/maximize.svg';
const Parking = ({ parkingData }) => {
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [showTitle, setShowTitle] = useState(false);
  useEffect(() => {
    // const clientId = "mqttx_cf37df64";
    // randomize client id
    const clientId = "mqttx_" + Math.random().toString(16).substr(2, 8);
    const host = "wss://q7e59bdb.ala.us-east-1.emqxsl.com:8084/mqtt";
    const options = {
      keepalive: 60,
      clientId: clientId,
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      username: "solana",
      password: "solana",
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: "WillMsg",
        payload: "Connection Closed abnormally..!",
        qos: 0,
        retain: false,
      },
    };

    console.log("Connecting MQTT client");
    const client = mqtt.connect(host, options);

    client.on("error", (err) => {
      console.log("Connection error: ", err);
      client.end();
    });

    client.on("reconnect", () => {
      console.log("Reconnecting...");
    });

    client.on("connect", () => {
      console.log("Client connected: " + clientId);
      client.subscribe("/parkir", { qos: 0 }, (error) => {
        if (!error) {
          console.log("Subscribed to /parkir topic!");
        } else {
          console.log("Error subscribing to /parkir topic!");
        }
      });
      client.on("message", (topic, message) => {
        const msg = JSON.parse(message.toString());
        const data = msg["data"];
        const updatedOccupiedSlots = data
          .filter(item => item.isOccupied)
          .map(item => item.kode);
        setOccupiedSlots(updatedOccupiedSlots);
      });
    });

    return () => {
      console.log("Disconnecting MQTT client");
      client.end();
    };
  }, []);

  // Function to handle fullscreen
  const fullscreen = () => {
    const element = document.getElementById("areaParkir");
    if (element.requestFullscreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        element.requestFullscreen();
      }
    } else if (element.mozRequestFullScreen) {
      if (document.mozFullScreenElement) {
        document.mozCancelFullScreen();
      } else {
        element.mozRequestFullScreen();
      }
    } else if (element.webkitRequestFullscreen) {
      if (document.webkitFullscreenElement) {
        document.webkitExitFullscreen();
      } else {
        element.webkitRequestFullscreen();
      }
    } else if (element.msRequestFullscreen) {
      if (document.msFullscreenElement) {
        document.msExitFullscreen();
      } else {
        element.msRequestFullscreen();
      }
    }
  
    document.addEventListener("fullscreenchange", handleFullscreenChange);
  };
  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      // Exited fullscreen mode
      console.log("Exited fullscreen mode");
      const element = document.getElementById("f1");
      if (element) {
        element.remove();
      }
      setShowTitle(false);
    } else {
      // Entered fullscreen mode
      console.log("Entered fullscreen mode");
      setShowTitle(true);
    }
  };

  return (
    <div className="card" style={{ background:"#d1d1e0" }}>
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <button
            className={`btn btn-outline-primary btn-sm`}
            onClick={fullscreen}
          >
            <MaximizeIcon />
          </button>
        </div>
      </div>
      <div className="container-fluid" id="areaParkir">
      {showTitle && (
          <div className="row p-3">
            <div className="container">
              <div className="row justify-content-center">
                <h2 className="text-white">AreaParkir</h2>
              </div>
            </div>
          </div>
        )}
        <div className="row p-3">
          <div className="container">
            <div className="row g-4">
              {parkingData.map((parking, index) => (
                <React.Fragment key={index}>
                  {index % 3 === 0 && (
                    <div className={`d-flex justify-content-between ${showTitle ? "text-white" : ""}`}>{`Lantai ke ${Math.floor(index / 3) + 2}`}</div>
                  )}
                  <div className="col-md-4">
                    <div className="d-flex flex-wrap">
                      <div
                        className={`flex-fill text-center p-2 parking-slot ${
                          occupiedSlots.includes(parking.kode) ? "bg-danger text-dark" : "bg-success text-dark"
                        } rounded mx-2 my-2`}
                        data-id={parking.kode}
                        id={parking.kode}
                      >
                        {parking.kode}
                      </div>
                    </div>
                  </div>
                  {index % 3 === 2 && <div className="w-100" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parking;
