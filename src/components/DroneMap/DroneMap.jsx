import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { point, distance, along, lineString } from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./DroneMap.module.scss";
import FormComponent from "../Form/Form";
import Modal from "react-modal";
import { MAP_ACCESS_TOKEN } from "./constants";
import FileUpload from "../FileUpload/FileUpload";

mapboxgl.accessToken = MAP_ACCESS_TOKEN;

const DroneMap = () => {
  const initialFormData = {
    startLatitude: "",
    startLongitude: "",
    destLatitude: "",
    destLongitude: "",
    time: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [map, setMap] = useState(null);
  const [startMarker, setStartMarker] = useState(null);
  const [destMarker, setDestMarker] = useState(null);
  const [line, setLine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenFileUpload, setIsOpenFileUpload] = useState(false);
  const [droneMarker, setDroneMarker] = useState(null);
  const [error, setError] = useState("");

  const openModal = (type) => {
    if (type === "sumulator") {
      setIsModalOpen(true);
    } else {
      setIsOpenFileUpload(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsOpenFileUpload(false);
  };

  useEffect(() => {
    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [formData.startLongitude, formData.startLatitude],
        zoom: 1,
      });

      setMap(map);

      return () => map.remove();
    };

    initializeMap();
  }, []);

  useEffect(() => {
    if (
      map &&
      droneMarker &&
      formData.startLongitude !== "-" &&
      formData.startLatitude !== "-"
    ) {
      droneMarker.setLngLat([formData.startLongitude, formData.startLatitude]);
    }
  }, [droneMarker, map, formData.startLongitude, formData.startLatitude]);

  const createLine = () => {
    if (line) {
      map.removeLayer("line");
      map.removeSource("line");
      map.removeLayer("trajectory");
      map.removeSource("trajectory");
      setLine(null);
    }

    if (droneMarker) {
      droneMarker.remove();
      setDroneMarker(null);
    }
    const lineCoordinates = [
      [formData.startLongitude, formData.startLatitude],
      [formData.destLongitude, formData.destLatitude],
    ];

    const lineFeature = lineString(lineCoordinates);

    map.addSource("line", {
      type: "geojson",
      data: lineFeature,
    });

    map.addLayer({
      id: "line",
      type: "line",
      source: "line",
      paint: {
        "line-color": "grey",
        "line-width": 2,
      },
    });

    setLine(lineFeature);

    const startCoord = point([formData.startLatitude, formData.startLongitude]);
    const destCoord = point([formData.destLatitude, formData.destLongitude]);
    const totalDistance = distance(startCoord, destCoord, {
      units: "kilometers",
    });

    const duration = formData.time * 1000;
    const steps = 100;
    const stepDistance = totalDistance / steps;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const newDroneMarker = new mapboxgl.Marker({
      element: createDroneElement(),
    })
      .setLngLat([formData.startLongitude, formData.startLatitude])
      .addTo(map);
    setDroneMarker(newDroneMarker);

    map.addSource("trajectory", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
    });

    map.addLayer({
      id: "trajectory",
      type: "line",
      source: "trajectory",
      paint: {
        "line-color": "blue",
        "line-width": 2,
        "line-dasharray": [2, 2],
      },
    });

    const animateMarker = () => {
      const currentPosition = along(lineFeature, currentStep * stepDistance, {
        units: "kilometers",
      });

      newDroneMarker.setLngLat(currentPosition.geometry.coordinates);
      const trajectorySource = map.getSource("trajectory");
      const trajectoryCoordinates = trajectorySource._data.geometry.coordinates;
      trajectoryCoordinates.push(currentPosition.geometry.coordinates);
      trajectorySource.setData(trajectorySource._data);

      currentStep++;

      if (currentStep <= steps) {
        setTimeout(animateMarker, stepDuration);
      }
    };

    animateMarker();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.startLatitude ||
      !formData.startLongitude ||
      !formData.destLatitude ||
      !formData.destLongitude ||
      !formData.time
    ) {
      setError("All fields are necessary");
      return;
    }

    const startLat = parseFloat(formData.startLatitude);
    const startLng = parseFloat(formData.startLongitude);
    const destLat = parseFloat(formData.destLatitude);
    const destLng = parseFloat(formData.destLongitude);
    const time = parseFloat(formData.time);

    if (
      isNaN(startLat) ||
      isNaN(startLng) ||
      isNaN(destLat) ||
      isNaN(destLng) ||
      isNaN(time)
    ) {
      setError("All fields must be numeric values");
      return;
    }

    if (startLat < -90 || startLat > 90 || startLng < -90 || startLng > 90) {
      setError("Latitude and longitude must be in the range -90 to 90");
      return;
    }

    if (time <= 0) {
      setError("Value for time must be greater than 0");
      return;
    }

    setError("");
    closeModal();
    if (map) {
      if (startMarker) {
        startMarker.remove();
      }
      if (destMarker) {
        destMarker.remove();
      }

      const newStartMarker = new mapboxgl.Marker()
        .setLngLat([formData.startLongitude, formData.startLatitude])
        .addTo(map);

      const newDestMarker = new mapboxgl.Marker({ color: "green" })
        .setLngLat([formData.destLongitude, formData.destLatitude])
        .addTo(map);

      setStartMarker(newStartMarker);
      setDestMarker(newDestMarker);

      createLine();
    }

    setFormData(initialFormData);
  };

  const createDroneElement = () => {
    const element = document.createElement("div");
    element.className = styles.droneMarker;
    element.style.backgroundImage = `url("https://pngimg.com/uploads/drone/drone_PNG35.png")`;
    return element;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const updatedValue =
      name === "startLatitude" || name === "startLongitude"
        ? value.replace(/[^0-9.-]/g, "")
        : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  return (
    <>
      <div className={styles.container}>
        <button
          onClick={() => openModal("sumulator")}
          className={styles.simulator}
        >
          Simulate
        </button>
        <button
          onClick={() => openModal("fileUpload")}
          className={styles.uploadButton}
        >
          Upload File
        </button>
        <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
          <FormComponent
            formData={formData}
            handleFormChange={handleFormChange}
            handleSubmit={handleSubmit}
            error={error}
          />
        </Modal>
        <Modal isOpen={isOpenFileUpload} onRequestClose={closeModal}>
          <FileUpload />
        </Modal>
        <div className={styles.wrapper}>
          <div id="map" style={{ height: "100vh" }}></div>
        </div>
      </div>
    </>
  );
};

export default DroneMap;
