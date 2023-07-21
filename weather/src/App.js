import { useEffect, useState } from "react";
import coldBg from "./asset/cold.jpg";
import hotBg from "./asset/hot.jpg";
import Descriptions from "./components/Descriptions";
import { getFormattedWeatherData } from "./weatherServices";
import { TbSearch } from "react-icons/tb";

function App() {
  const [city, setCity] = useState("Mumbai");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      setWeather(data);

      //Dynamic Background
      const threshold = units === "metric" ? 20 : 60;
      if (data.temp <= threshold) {
        setBg(coldBg);
      } else setBg(hotBg);

      //Didnt use this cause when changed to F the background also changes if units are greater than 20
      // if (data.temp > 20) {
      //   setBg(hotBg);
      // } else {
      //   setBg(coldBg);
      // }
    };
    fetchWeatherData();
  }, [units, city]);

  const clickHandler = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };
  //Code updated to add a search button
  // const enterKeyPressed = (e) => {
  //   if (e.keyCode === 13) {
  //     setCity(e.currentTarget.value);
  //     e.currentTarget.blur();
  //   }
  // };

  const changeHandler = (input) => {
    const { value } = input.target;
    setSearchTerm(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCity(searchTerm);
  };
  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section">
              <form onSubmit={handleSubmit} className="searchForm">
                <input
                  // onKeyDown={enterKeyPressed}
                  onChange={changeHandler}
                  type="text"
                  name="city"
                  placeholder="Enter City..."
                />
                <button className="searchButton">
                  <TbSearch />
                </button>
              </form>
              <button onClick={(e) => clickHandler(e)} className="tempButton">
                °C|°F
              </button>
            </div>

            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${
                  units === "metric" ? "C" : "F"
                }`}</h1>
              </div>
            </div>

            {/* bottom description */}
            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
