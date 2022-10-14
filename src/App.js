import React, { useEffect, useState } from 'react';
import axios from "axios";
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import WaterIcon from '@mui/icons-material/Water';
import './App.css';
import Chart from './components/Chart';


const api = {
  key: "02e3d77820cfd9ee3e6ca048fb4e10b4",
  base: "https://api.openweathermap.org/data/2.5/",
  geo: "https://api.openweathermap.org/geo/1.0/",
  default: "http://api.openweathermap.org/geo/1.0/direct?q=pelotas"
}

function App() {
  const [query, setQuery] = useState('');
  const [forecast, setForecast] = useState(null);
  const [chart, setChart] = useState({});

  useEffect(() => {
    if (forecast) {
        axios.post("http://localhost:5000/weather", {
            cityName: forecast.city.name,
            weatherId: forecast.list[0].weather[0].id,
            temp: forecast.list[0].main.temp,
            tempMax: forecast.list[0].main.temp_min,
            tempMin: forecast.list[0].main.temp_max,
            humidity: forecast.list[0].main.humidity,
            feels_like: forecast.list[0].main.feels_like
        });
    }
}, [forecast]);
    

  const buscaLatLon = async (event) => {
    if (event.key === "Enter") {
  
      if (query === '') {
          let res = await axios
          .get(`${api.default}&appid=${api.key}`);
          setQuery('');
          buscaClima(res.data);  
      } else {
          let res = await axios
          .get(`${api.geo}direct?q=${query}&units=metric&appid=${api.key}`)
          setQuery('');
          buscaClima(res.data); 
          
      }
    }
  }

  function formataData(data) {
    var date = new Date(data * 1000);
    return date.getDate()+
          "/"+(date.getMonth()+1)+
          "/"+date.getFullYear()+
          " "+date.getHours()+"h";
  }
  

  const buscaClima = async (searchData) => {

    if(searchData.length === 0) {
      let url =  `${api.base}/forecast?lat=-31.7699736&lon=-52.3410161&appid=${api.key}&lang=pt_br&units=metric`;
      const forecastFetch = await axios.get(url);

        setForecast(forecastFetch.data);
        setChart({
          labels: forecastFetch.data.list.map(day => formataData(day.dt)),
          datasets: [
              {
                  label: 'Temperatura',
                  data: forecastFetch.data.list.map(f => f.main.temp),
                  backgroundColor: 'purple',
                  borderColor: 'rgb(171, 150, 185)'
              }
          ]
      });
    } else {
      const lat = searchData[0].lat;
      const lon = searchData[0].lon;
      let url = `${api.base}/forecast?lat=${lat}&lon=${lon}&appid=${api.key}&lang=pt_br&units=metric`;
      const forecastFetch = await axios.get(url);
        setForecast(forecastFetch.data);
        setChart({
          labels: forecastFetch.data.list.map(day => formataData(day.dt)),
          datasets: [
              {
                  label: 'Temperatura',
                  data: forecastFetch.data.list.map(f => f.main.temp),
                  backgroundColor: 'purple',
                  borderColor: 'rgb(171, 150, 185)'
              }
          ]
      });
    }
  };

  return (
   
    <div className='app'>
      
    <main>
      
    <AppBar position="static" className="bar">
      <CssBaseline />
      <Toolbar className='toolbar' >
        <Typography variant="h5" className="name">
          WebWeather
        </Typography>
      </Toolbar>
    </AppBar>

    <br></br>

      <TextField
    className='searchBox' onChange={e => setQuery(e.target.value)} value={query} onKeyPress={buscaLatLon} label = "Procure uma cidade">
     </TextField>
     <br></br><br></br>

          {forecast && (
          <div>
<Typography variant="h5" className="name">
          { forecast.city.name }
        </Typography>
        <br></br>

<Grid container direction="row" justifyContent="center" alignItems="center"  className="container"  columnSpacing={1}  >


      { forecast.list.map((f, index) => (
       <div key={index} className="all">
        <Grid  item component = {Card} className="card" >
          <CardContent>
        <Typography gutterBottom variant="h7" component="h5" align = "center"  className="forecast">
          { formataData(f.dt) }
          </Typography> 
          <div>
   <img src = {`http://openweathermap.org/img/w/${f.weather[0].icon}.png`} alt=''/>
   </div>

          <Typography gutterBottom variant="body2" component="p" align = "center" className="max">
            <NorthIcon fontSize="small"></NorthIcon> { (f.main.temp_max).toFixed() }°
      </Typography>
      
      <Typography gutterBottom variant="body2" component="p" align = "center" className="min">
        <SouthIcon fontSize='small'></SouthIcon>{ (f.main.temp_min).toFixed() }°
      </Typography>

      <Typography gutterBottom variant="body2" component="p" align = "center" className="min">
        <WaterIcon className='waterIcon' fontSize='small'/> { f.main.humidity }%
      </Typography>

</CardContent>
      </Grid>
      </div>
      
    ))}

     </Grid>
     </div>
          )}    
               {forecast && (
                        <div style={{ width: '100%', backgroundColor: 'white' }}>
                            <Chart charData={chart} />
                        </div>
                    )}
    </main>
    </div>
    
  );
}
  

export default App;
