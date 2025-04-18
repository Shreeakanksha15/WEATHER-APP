import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import wind_icon from "../assets/wind.png";
import snow_icon from "../assets/snow.png";

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": cloud_icon,
    "04n": cloud_icon,
    "09d": drizzle_icon,
    "09n": drizzle_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "11d": rain_icon,
    "11n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
    "50d": drizzle_icon,
    "50n": drizzle_icon,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getBackgroundClass = (desc) => {
    if (!desc) return "default-bg";
    desc = desc.toLowerCase();
    if (desc.includes("rain")) return "rainy-bg";
    if (desc.includes("cloud")) return "cloudy-bg";
    if (desc.includes("clear")) return "sunny-bg";
    if (desc.includes("snow")) return "snowy-bg";
    return "default-bg";
  };

  const search = async (city) => {
    if (city === "") {
      alert("Please enter a city name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        alert("City not found");
        return;
      }

      const icon = allIcons[data.weather[0].icon];

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        feelsLike: Math.floor(data.main.feels_like),
        description: data.weather[0].description,
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      setWeatherData(false);
      console.error("Error fetching weather data:", error);
      alert("City not found");
    }
  };

  useEffect(() => {
    search("Kolkata");
  }, []);

  const bgClass = getBackgroundClass(weatherData?.description);

  return (
    <div className={`weather ${bgClass}`}>
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search" />
        <img
          src={search_icon}
          alt="Search"
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {weatherData && (
        <>
          <h2 className="greeting">
            {getGreeting()}, {weatherData.location}
          </h2>
          <img src={weatherData.icon} alt="Weather icon" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="feels">Feels like {weatherData.feelsLike}°C</p>
          <p className="desc">{weatherData.description}</p>
          <p className="location">{weatherData.location}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind" />
              <div>
                <p>{weatherData.windSpeed} Km/hr</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
