import axios from "axios";

type WeatherData = {
  name: string;
  temp_in_c: number;
};

export const getWeather = async (cityName: string) => {
  const res = await axios.get(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${cityName}&aqi=yes`
  );
  const { name } = res.data.location;
  const { temp_c } = res.data.current;
  const data: WeatherData = { name, temp_in_c: temp_c };
  return data;
};
