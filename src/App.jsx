import { useState } from "react";
import Spinner from "./assets/spinner.svg";

function App() {
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [showForecast, setShowForecast] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
  const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
  const API_KEY = "210e5e140b1172c061313f82d196ec4d";

  const handleSearch = async (e) => {
    e.preventDefault();
    setForecastData(null);
    setWeatherData(null);

    if (!search) {
      setError("Please enter a city name");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}?q=${search}&appid=${API_KEY}`);
      const data = await response.json();
      console.log(data);
      setWeatherData(data);
      setCountry(data?.sys.country);
      setError(null);
      setShowForecast(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Error fetching weather data");
      setWeatherData(null);
      setLoading(false);
    }
  };

  const handleSearchForecast = async (e) => {
    e.preventDefault();
    if (!search || !country) {
      setError("Please enter a city name");
      return;
    }
    setForecastLoading(true);
    try {
      const response = await fetch(
        `${FORECAST_URL}?q=${search},${country}&appid=${API_KEY}`
      );
      const data = await response.json();
      setForecastData(data);
      console.log(data);
      setError(null);
      setForecastLoading(false);
    } catch (error) {
      console.log(error);
      setError("Error fetching weather data");
      setForecastLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#1e258f] h-screen w-full overflow-y-auto">
        <div className="flex flex-col gap-y-6 py-10 justify-center items-center">
          <h1 className="font-medium text-3xl">Open Weather Api Search</h1>
          <span className="font-normal text-xl">
            Search for your city's weather below
          </span>
          <form
            onSubmit={handleSearch}
            className="items-center gap-2 flex md:flex-row flex-col lg:w-[30%]"
          >
            <input
              type="text"
              name="search"
              placeholder="Enter City name"
              id="search"
              className="px-5 py-3 rounded-[8px] w-full bg-[#fff] text-[#2f2f2f]"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="border boder-[#d5d5d5] rounded-[8px] px-5 md:w-[40%] w-full py-3 hover:scale-95 transition-all ease-out"
            >
              Search
            </button>
          </form>
          {error && <p className="text-[#f32020] font-medium">{error}</p>}
          {loading && (
            <img src={Spinner} alt="loading" className="w-[50px]  h-[50px]" />
          )}
          {weatherData && (
            <div className="flex justify-center items-center flex-col text-lg">
              <div className="mb-3">Today's weather forecast:</div>
              <h1>
                Weather in {weatherData.name}, {weatherData.sys.country}
              </h1>
              <h1>Weather in {weatherData.main.temp}°C</h1>
              <h1>Weather in {weatherData.weather[0].description}</h1>
            </div>
          )}
          {showForecast && (
            <button
              onClick={handleSearchForecast}
              className={`border boder-[#d5d5d5] rounded-[8px] w-1/2 md:w-fit flex justify-center mt-10 px-5 py-3 hover:scale-95 transition-all ease-out ${
                forecastData === null && "animate-bounce"
              }`}
            >
              {!forecastLoading ? (
                "Get 5-days forecast"
              ) : (
                <img
                  src={Spinner}
                  alt="loading"
                  className="md:w-[50px] w-[30px] md:h-[50px]"
                />
              )}
            </button>
          )}
          {forecastData && (
            <div className="flex justify-center items-center flex-col text-lg mt-6 px-10">
              <h1 className="font-medium">5-Day Forecast:</h1>
              <div className="grid gap-x-5 md:grid-cols-3 grid-cols-1 lg:grid-cols-5 overflow-x-auto w-full">
                {forecastData.list.slice(1, 6).map((forecast, index) => (
                  <div
                    key={index}
                    className="mt-5 bg-[#ffffff] rounded-[6px] text-[#2f2f2f] w-full px-5 py-3 hover:scale-95 transition-all ease-in-out"
                  >
                    <h2>Date taken: {forecast.dt_txt}</h2>
                    <h2>Temperature: {forecast.main.temp}°C</h2>
                    <h2>Weather: {forecast.weather[0].description}</h2>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
