import { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import style from "./Restaurant.module.css";
import Navbar from "./servicedashboard";

export default function Restaurant() {
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("restaurant");

  const [viewState, setViewState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 15,
  });

  // Get Current Location
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setUserLocation(currentLocation);

        setViewState({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          zoom: 15,
        });

        setLoading(false);
      },
      (error) => {
        console.error(error);
        alert("Please allow location access");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Fetch places whenever filter changes
  useEffect(() => {
    if (userLocation) {
      fetchPlaces(activeFilter);
    }
  }, [userLocation, activeFilter]);

  const fetchPlaces = async (category) => {
    const queries = {
      hospital: 'node["amenity"="hospital"]',
      restaurant: 'node["amenity"="restaurant"]',
      bus_stop: 'node["highway"="bus_stop"]',
      toilet: 'node["amenity"="toilets"]',
      parking: 'node["amenity"="parking"]',
    };

    const query = `
      [out:json];
      (
        ${queries[category]}(
          around:5000,
          ${userLocation.latitude},
          ${userLocation.longitude}
        );
      );
      out body;
    `;

    try {
      const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          body: query,
        }
      );

      const data = await response.json();
      setPlaces(data.elements || []);
    } catch (err) {
      console.error("Error fetching places:", err);
    }
  };

  const getIcon = () => {
    switch (activeFilter) {
      case "hospital":
        return "🏥";
      case "restaurant":
        return "🍴";
      case "bus_stop":
        return "🚌";
      case "toilet":
        return "♿";
      case "parking":
        return "🅿️";
      default:
        return "📍";
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return (R * c).toFixed(2);
  };

  if (loading || !userLocation) {
    return (
      <div className={style.loading}>
        <h2>Getting your current location...</h2>
      </div>
    );
  }

  return (
    <div className={style.page}>
      <Navbar />

      <div className={style.container}>
        <div className={style.mapContainer}>
          {/* My Location Button */}
          <button
            className={style.locationBtn}
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const currentLocation = {
                    latitude:
                      position.coords.latitude,
                    longitude:
                      position.coords.longitude,
                  };

                  setUserLocation(
                    currentLocation
                  );

                  setViewState({
                    latitude:
                      currentLocation.latitude,
                    longitude:
                      currentLocation.longitude,
                    zoom: 15,
                  });
                }
              );
            }}
          >
            📍 My Location
          </button>

          <Map
            reuseMaps
            longitude={viewState.longitude}
            latitude={viewState.latitude}
            zoom={viewState.zoom}
            onMove={(evt) =>
              setViewState(evt.viewState)
            }
            style={{
              width: "100%",
              height: "100%",
            }}
            mapStyle="https://tiles.openfreemap.org/styles/bright"
          >
            {/* User Marker */}
            <Marker
              longitude={userLocation.longitude}
              latitude={userLocation.latitude}
            >
              <div className={style.userMarker}>
                📍
              </div>
            </Marker>

            {/* Places */}
            {places.map((place) => (
              <Marker
                key={place.id}
                longitude={Number(place.lon)}
                latitude={Number(place.lat)}
              >
                <div
                  className={style.marker}
                  onClick={() =>
                    setSelected(place)
                  }
                >
                  {getIcon()}
                </div>
              </Marker>
            ))}

            {/* Popup */}
            {selected && (
              <Popup
                longitude={Number(
                  selected.lon
                )}
                latitude={Number(
                  selected.lat
                )}
                closeButton
                closeOnClick={false}
                onClose={() =>
                  setSelected(null)
                }
              >
                <div className={style.popup}>
                  <h3>
                    {selected.tags?.name ||
                      "Unnamed Place"}
                  </h3>

                  <p>
                    {selected.tags?.amenity ||
                      selected.tags?.highway}
                  </p>

                  <p>
                    Distance:{" "}
                    {getDistance(
                      userLocation.latitude,
                      userLocation.longitude,
                      selected.lat,
                      selected.lon
                    )}{" "}
                    km
                  </p>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lon}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    🧭 Navigate
                  </a>
                </div>
              </Popup>
            )}
          </Map>

          {/* Bottom Bar */}
          <div className={style.bottomBar}>
            <button
              className={`${style.card} ${
                activeFilter === "restaurant"
                  ? style.active
                  : ""
              }`}
              onClick={() =>
                setActiveFilter(
                  "restaurant"
                )
              }
            >
              🍴 Restaurants
            </button>

            <button
              className={`${style.card} ${
                activeFilter === "hospital"
                  ? style.active
                  : ""
              }`}
              onClick={() =>
                setActiveFilter("hospital")
              }
            >
              🏥 Hospitals
            </button>

            <button
              className={`${style.card} ${
                activeFilter === "bus_stop"
                  ? style.active
                  : ""
              }`}
              onClick={() =>
                setActiveFilter("bus_stop")
              }
            >
              🚌 Bus Stops
            </button>

            <button
              className={`${style.card} ${
                activeFilter === "toilet"
                  ? style.active
                  : ""
              }`}
              onClick={() =>
                setActiveFilter("toilet")
              }
            >
              ♿ Toilets
            </button>

            <button
              className={`${style.card} ${
                activeFilter === "parking"
                  ? style.active
                  : ""
              }`}
              onClick={() =>
                setActiveFilter("parking")
              }
            >
              🅿️ Parking
            </button>

            <div className={style.stats}>
              <h3>{places.length}</h3>
              <p>Places Nearby</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}