import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./../styles/ForecastComponent.css";

const ForecastComponent = ({ city }) => {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [hourlyData, setHourlyData] = useState([]);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get(url);
        const hourlyForecast = response.data.list.slice(0, 10); // Get next 10 hours

        const formattedData = hourlyForecast.map((item) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temp: Math.round(item.main.temp),
        }));

        setForecast(hourlyForecast);
        setHourlyData(formattedData);
        setError(""); // Clear error if successful
      } catch (error) {
        console.error("Error fetching forecast:", error);
        setError("No forecast data available for this city.");
        setForecast([]);
        setHourlyData([]);
      }
    };

    fetchForecast();
  }, [city]);

  return (
    <div className="forecast-container">
      <h2>Hourly Forecast for {city}</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Graph for temperature trend */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyData}>
            <XAxis dataKey="time" />
            <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
            <Tooltip />
            <Line type="monotone" dataKey="temp" stroke="#ff7300" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast Cards */}
      <div className="forecast-cards">
        {forecast.map((hour, index) => (
          <div key={index} className="forecast-card">
            <p>{new Date(hour.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
            <img
              className="forecast-icon"
              src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
              alt={hour.weather[0].description}
            />
            <p>Temp: {Math.round(hour.main.temp)}°C</p>
            <p>{hour.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastComponent;
