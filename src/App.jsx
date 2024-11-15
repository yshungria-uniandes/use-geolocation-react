import { useState } from "react";

function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { isLoading, position, error, getPosition };
}

export default function App() {
  const {
    isLoading,
    position: { lat, lng },
    error,
    getPosition,
  } = useGeolocation();

  const [countClicks, setCountClicks] = useState(0);

  function handleClick() {
    setCountClicks((count) => count + 1);
    getPosition();
  }

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h1 className="card-title text-center mb-4">Geolocation App</h1>
          <button
            className="btn btn-primary w-100 mb-3"
            onClick={handleClick}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Get my position"}
          </button>

          {isLoading && (
            <div className="alert alert-info text-center">
              Loading position...
            </div>
          )}
          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}
          {!isLoading && !error && lat && lng && (
            <div className="alert alert-success text-center">
              Your GPS position:{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://www.openstreetmap.org/#map=16/${lat}/${lng}`}
              >
                {lat}, {lng}
              </a>
            </div>
          )}

          <p className="text-center mt-3">
            You requested position <strong>{countClicks}</strong> times
          </p>
        </div>
      </div>
    </div>
  );
}
