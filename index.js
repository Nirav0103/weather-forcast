import express from "express";
import axios from "axios";
import env from "dotenv";


const app = express();
env.config();
const port = 3000;
const API_URL = "http://api.openweathermap.org";
const token = process.env.API_ID;





app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/" , async (req, res) =>{

  const q = "Byculla West, Maharashtra";
  try{
    const result = await axios.get(`${API_URL}/geo/1.0/direct?q=${q}&appid=${token}`);

    
    
      if(result.data.length > 0)
      {
        const location = result.data[0];
        const lat = location.lat;
        const lon = location.lon;
        const result1 = await axios.get(`${API_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${token}`);
        if(result1.data)
        {
          
          const country = result1.data.sys.country;
          const feelsLike = result1.data.main.temp;
          var  c = Math.round(feelsLike - 273);
          const now = new Date();
          const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
          const time = now.toLocaleTimeString('en-in', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); 

          const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
          const countryName = regionNames.of(country);

          const cloud = result1.data.clouds.all;
          let msg = "Normal";
          let img = "";
          if(cloud > 20)
          {
            msg = " Partly Cloudy";
            img = "images/partlycloudy.gif";
          }
          else if(cloud> 50) 
          {
              msg = "Mostly Cloudy";
              img = "images/rainy.gif";
          }
          else
          {
            msg = "Sunny Day";
            img = "images/sunny.gif";
          }
          res.render("index.ejs", {feelsLike: JSON.stringify(c), day:dayName, message: msg , time : time , country: countryName , type: img});
        }
      }
      else{
        res.status(404).send("Location not found");
      }
} catch(error){
    console.error(error);
    res.status(502);
}

    
});

app.post("/submit", async (req,res)=>{
    const city = req.body.city;
    const state = req.body.state;
    const country = req.body.country;
    const q = `${city},${state},${country}`;
    try{
        const result = await axios.get(`${API_URL}/geo/1.0/direct?q=${q}&appid=${token}`);

        
        
          if(result.data.length > 0)
          {
            const location = result.data[0];
            const lat = location.lat;
            const lon = location.lon;
            const result1 = await axios.get(`${API_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${token}`);
            if(result1.data)
            {
              
              const country = result1.data.sys.country;
              const feelsLike = result1.data.main.temp;
              var  c = Math.round(feelsLike - 273);
              const now = new Date();
              const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
              const time = now.toLocaleTimeString('en-in', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); 

              const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
              const countryName = regionNames.of(country);

              const cloud = result1.data.clouds.all;
              let msg = "Normal";
              let img = "";
              if(cloud > 20)
              {
                msg = " Partly Cloudy";
                img = "images/partlycloudy.gif";
              }
              else if(cloud> 50) 
              {
                  msg = "Mostly Cloudy";
                  img = "images/rainy.gif";
              }
              else
              {
                msg = "Sunny Day";
                img = "images/sunny.gif";
              }
              res.render("index.ejs", {feelsLike: JSON.stringify(c), day:dayName, message: msg , time : time , country: countryName , type: img});
            }
          }
          else{
            res.status(404).send("Location not found");
          }
    } catch(error){
        console.error(error);
        res.status(502);
    }
    
});



app.listen(port , () =>{
    console.log(`listing to port ${port}`);
})
