// currentdata()

// function currentdata() {
//     async function success(pos) {
//         const crd = pos.coords;

//         console.log('Your current position is:');
//         console.log(`Latitude : ${crd.latitude}`);
//         console.log(`Longitude: ${crd.longitude}`);
//         console.log(`More or less ${crd.accuracy} meters.`);
//         try {

//             var res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${crd.latitude}&lon=${crd.longitude}&exclude=hourly,minutely&units=metric&appid=a77df68bcd9e098229cb3c8e6441dfbc`)
//             var res2 = await res.json();
//             console.log(res2)
//             var data = document.getElementById("seven_day")
//             res2.daily.map(function (elem, ind) {
//                 data.innerHTML += `<div class="boxes">
//                     <div>${window.moment(elem.dt * 1000).format('ddd')}</div>
//         <img src="http://openweathermap.org/img/wn/${elem.weather[0].icon}@2x.png"/>
//         <div>${elem.temp.day}&#176C</div>
//         <div>${elem.temp.night}&#176C   </div>
//     </div>`
//             })



//         } catch (err) {
//             console.log("err", err)
//         }
//     }

//     navigator.geolocation.getCurrentPosition(success)
//     console.log(success);
// }

var APIkey = "b594e9697164c39654c35a6a691495e2";

let unix = 1661215081;
let d = new Date(unix * 1000);
console.log(d);
const timeelement = document.getElementById("timevalue");
const meredianelement = document.getElementById("meredian");
const dateelement = document.getElementById("date");
const cityelement = document.getElementById("city");
const latlotelement = document.getElementById("latlot");
const montharr = [
  "Jan",
  "Fab",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Nov",
  "Dec",
];
const dayarr = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Friday",
  "Saturday",
];
currenttimefunction();
function currenttimefunction() {
  const currtime = new Date();
  const month = currtime.getMonth();
  const day = currtime.getDay();
  const date = currtime.getDate();
  var hour = currtime.getHours();
  hour = hour < 10 ? "0" + hour : hour;
  var min = currtime.getMinutes();
  min = min < 10 ? "0" + min : min;
  const meredian = hour >= 12 ? "PM" : "AM";
  meredianelement.innerText = meredian;
  timeelement.innerText = hour + ":" + min + " ";
  dateelement.innerText = dayarr[day] + ", " + date + " " + montharr[month];
}

setInterval(() => {
  currenttimefunction();
}, 5000);

function getlocation() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    const crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    var lat = crd.latitude.toPrecision(6);
    var lon = crd.longitude.toPrecision(6);
    console.log(lat, lon);
    latlotelement.innerText = lat + "N " + lon + "E";
    let api = `https://api.openweathermap.org/data/2.5/forecast?lat=${crd.latitude}&lon=${crd.longitude}&appid=${APIkey}&units=metric`;
    console.log("api == ", api);
    fetch(api)
      .then((res) => res.json())
      .then((dat) => {
        console.log(dat);
        showweather(dat);
      });
  }

  async function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    let defaultapi = `https://api.openweathermap.org/data/2.5/forecast?q=Jaipur&appid=${APIkey}&units=metric`;
    const resd= await fetch(defaultapi);
    const resd2 = await resd.json();
    console.log("default city search sucessful");
    showweather(resd2);

  }
  navigator.geolocation.getCurrentPosition(success, error, options);
}

//////SEARCH BY CITY IMPLEMENTATION
document.querySelector("form").addEventListener("submit", searchbycity);
async function searchbycity() {
  event.preventDefault();
  console.log("running city");
  var city_to_search = document.querySelector("#searchbar").value;
  console.log(typeof city_to_search);
  if (city_to_search == "") {
    console.log("Enter Something");
  }
  console.log("Search the city", city);
  let cityapi = `https://api.openweathermap.org/data/2.5/forecast?q=${city_to_search}&appid=${APIkey}&units=metric`;
  try {
    const reso = await fetch(cityapi);
    const res2 = await reso.json();
    console.log("city search sucessful");

    showweather(res2);
  } catch (err) {
    console.log("city search fail");

    console.log("error", err);
    if (city_to_search == "") {
      console.log("Enter Something");
      document.getElementById("notvalid").style.display = "block";
      setTimeout(function () {
        document.getElementById("notvalid").style.display = "none";
        return;
      }, 2900);
    } else {
      document.getElementById("errordiv").style.display = "block";
      setTimeout(function () {
        document.getElementById("errordiv").style.display = "none";
      }, 3000);
    }
  }
}

////////////////////////////////////////////////////////////////////
// DISPLAY THE DATA OF IN WEBPAGE
/////////////////////////////////////////////////////////////////////
var val=document.querySelector("#searchbar").value;
function showweather(dat) {
  console.log(dat.city.name);
  cityelement.innerText = dat.city.name;

  {
    // BLOCK TO DISPLAY REAL TIME DATA
    const gmap_canvas=document.getElementById("gmap_canvas");
   let val=document.getElementById("searchbar").value
    document.getElementById(
      "temp"
    ).innerText = `${dat.list[0].main.temp}\u00B0C`;
    document.getElementById(
      "feels_like"
    ).innerText = `${dat.list[0].main.feels_like}\u00B0C`;
    document.getElementById("condition").innerText =
      dat.list[0].weather[0].description;
    document.getElementById("pressure").innerText =
      dat.list[0].main.pressure + " mb";
    document.getElementById("wind_speed").innerText =
      dat.list[0].wind.speed + "m/s";
    document.getElementById("humidity").innerText =
      dat.list[0].main.humidity + "%";
    var {lat, lon} = dat.city.coord
    console.log(lat, lon)
    gmap_canvas.src=`https://maps.google.com/maps?q=${val}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    latlotelement.innerText = lat + "N " + lon + "E";
  }

  { 
    //BLOCK FOR SHOWING LOWER PORTION
    console.log(dat.list);
    let arr = [0, 8, 16, 24, 32, 39];
    let filtereedlist = dat.list.filter(function (ele, index) {
      return !(arr.indexOf(index) == -1);
    });
    console.log("filteredlist", filtereedlist);
    let forcastdays = "";
    var todayhtml = ``;
    filtereedlist.forEach((element, index) => {
      let futuredates = new Date(element.dt * 1000);
      // console.log(futuredates)
      let futuredate = futuredates.getDate();
      let futuremonth = futuredates.getMonth();
      let futureyear = futuredates.getFullYear();
      console.log(futuredate, futuremonth, futureyear);
      if (index == 0) {
        todayhtml = `<div id="today">
        <img
          src="http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"
          alt="todaysimg"
          class="w-icon"
        />
        <div id="todayinnerdiv">
          <div id="weekday">${futuredate} /${futuremonth} /${futureyear}</div>
          <div id="temp">Temperature - ${element.main.temp} &#176;C</div>
          <div id="temp">Humidity - ${element.main.humidity} %</div>
        </div>
      </div>`
      
      } else {
        forcastdays += `<div id="futuredayforcast">
        <div id="weekday">${futuredate}</div>
        <img
          src="http://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"
          alt="weatherimg"
          class="w-icon"
        />
        <div id="temp">Temp - ${element.main.temp} &#176;C</div>
        <div id="temp">Humid - ${element.main.humidity} %</div>
      </div>`;
      }
    });
    document.querySelector("#forcast").innerHTML = todayhtml + forcastdays;
  }
}
