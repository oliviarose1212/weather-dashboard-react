import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import WeatherComponent from "./components/WeatherComponent";
import ForecastComponent from "./components/ForecastComponent";
import "./styles/App.css";

const App = () => {
  const [city, setCity] = useState("London");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Function to fetch weather data
  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      setWeatherData(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("City not found. Please enter a valid city.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch weather based on user's geolocation
  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            setLoading(true);
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
            );
            setWeatherData(response.data);
            setCity(response.data.name); // Update city name
            setError("");
          } catch (error) {
            console.error("Error fetching weather by location:", error);
            setError("Could not retrieve location weather.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Location access denied. Using default city.");
          fetchWeather(city);
        }
      );
    } else {
      setError("Geolocation is not supported in this browser.");
      fetchWeather(city);
    }
  };

  // Auto-fetch weather on page load
  useEffect(() => {
    fetchWeatherByLocation();
  }, []);

  // When user searches for a city, update weather
  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  return (
    <div className="app-container">
      <h1>Weather Dashboard</h1>
      <div className="weather-dashboard">
        <SearchBar onSearch={setCity} />
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <p className="loading-message">Loading weather data...</p>
        ) : (
          <>
            {weatherData && <WeatherComponent weatherData={weatherData} />}
            {weatherData && <ForecastComponent city={city} />}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
