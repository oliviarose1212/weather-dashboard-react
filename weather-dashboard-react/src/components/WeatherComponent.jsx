import React from "react";
import "./../styles/WeatherComponent.css";

const WeatherComponent = ({ weatherData }) => {
  if (!weatherData) return null;

  return (
    <div className="weather-container">
      <h2>{weatherData.name}, {weatherData.sys.country}</h2>
      <img
        className="weather-icon"
        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
        alt={weatherData.weather[0].description}
      />
      <p className="weather-temp">{Math.round(weatherData.main.temp)}°C</p>
      <p className="weather-desc">{weatherData.weather[0].description}</p>
    </div>
  );
};

export default WeatherComponent;
