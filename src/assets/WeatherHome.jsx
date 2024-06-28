import React, {useRef, useState} from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

function WeatherHome(){
    const apiKey= '5ae2586ea2964eecb0c182829240706'; 
    const apiURL = 'http://api.weatherapi.com/v1/forecast.json'; 

    const [location, setLocation]  = useState('');
    const [temperature, setTemperature] = useState(null); 
    const [description, setDescription] = useState(''); 
    const [image, setImage] = useState({src: '', alt:''});
    const [forecast, setForecast] = useState([]); 
    
    const locationInputRef = useRef(null); 
    
    const locationElementRef = useRef(null);
    const tempElementRef = useRef(null); 
    const descriptionElementRef = useRef(null); 
    const imageElementRef = useRef(null); 

    const fetchWeather =  async (location) => {
        const url = `${apiURL}?key=${apiKey}&q=${location}&days=3&aqi=no&alerts=no`;  
        // console.log(url); 
        try{
            const response = await fetch(url); 
            if(!response.ok){
                throw new Error('Network reponse was not ok'); 
            }
            const data = await response.json();

            const forecastData = data.forecast.forecastday.map(day => ({
                date: day.date, 
                max_temp: day.day.maxtemp_f, 
                min_temp: day.day.mintemp_f, 
                avg_temp: day.day.avgtemp_f,
                icon: day.day.condition.icon,
                alt : day.day.condition.text
            }))


            setLocation(`${data.location.name}, ${data.location.region}`); 
            setTemperature( data.current.temp_f); 
            setDescription(data.current.condition.text); 
            setImage({src:data.current.condition.icon, alt:data.current.condition.text}); 
            setForecast(forecastData); 
        }catch(error){
            console.log('Error fetching weathher data', error); 
            // setLocation(''); 
            // setTemperature(''); 
            // setDescription(''); 
            // setImage({src:'', alt:''}); 
            alert('City not found, please try again or try another city')
            // setForecast([]); 
        }
    };

    const handleClick = () => {
        const location = locationInputRef.current.value; 
        if(location){
            fetchWeather(location);
            
            // console.log('we are fetching');
        }
    }; 

    const format = (inputDate) =>  {
        var date = new Date(inputDate);
        if (!isNaN(date.getTime())) {
            // Months use 0 index.
            return date.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year:'numeric' }); 
        }
    }

    return (
        <>
        <div className="container mx-auto montserrat-regular"> 
            <h1 className="text-6xl pb-10 pt-4"> The Weather App </h1>
            <input id="inputLocation" type="text" placeholder="Search City or Zipcode" ref={locationInputRef} className="mr-5 w-48 border-solid rounded border-2 border-blue-500 p-1"/> 
            <button type="submit" id="searchButton" name="search" onClick={handleClick} className="bg-blue-500 p-2 rounded"> Search</button>
            
            {temperature !== null && (
            <div id="info" > 
                <div id="today" className="pt-8 mt-10 border rounded-xl shadow-lg bg-slate-400"> 
                    <h2 id="location" className="text-4xl  montserrat-bold">{location}</h2>
                    <p id="temperature" className="pt-2 text-xl">Current Temp: {temperature} °F</p>
                    <p id="description" className="text-xl">{description}</p> 
                    <img id='weatherIcon' src={image.src} alt={image.alt} 
                    className="w-32 h-32 mx-auto object-cover" /> 
                </div>
    
                <h3 className="text-3xl py-8"> 3 day forecast </h3>
                <div className="grid grid-cols-3 gap-4 text-center" id="forecast"> 
                    {/* we have to map it because there is a list inside forecast */}
                    {forecast.map((day, index) => (
                        <div key={index} className="max-w-sm rounded-xl overflow-hidden shadow-lg p-16 border border-blue-200 bg-blue-200 mx-auto">
                            <p className="text-lg pb-8  montserrat-bold">{format(day.date)} </p>
                            <p className="text-md py-1">Avg Temp: {day.avg_temp} °F </p>
                            <p className="text-md py-1">Min Temp: {day.min_temp} °F</p>
                            <p className="text-md py-1">Max Temp: {day.max_temp} °F</p>
                            <img id='weatherIcon' src={day.icon} alt={day.alt} className="mx-auto pt-4"/> 
                        </div>
                    ))
                }
                </div> 
            </div> 
            )}
            <div className="pt-10 flex items-center justify-center"> 
                <p className="mr-2">Ashley's Weather Project | </p>
                <a href="https://www.linkedin.com/in/ashleypabloramirez" className="mr-2"><FaLinkedin size={24}/> </a>
                <a href="https://github.com/apablor" className="mr-2" > <FaGithub size={24}/> </a>
                <p> | 2024 </p>
                
            </div>
        </div> 
        </>
    )
}

export default WeatherHome; 