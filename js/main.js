//The below line is used to help to see us the errors that VScode can't except.
'use strict'
const headerEl = document.querySelector(".header");
///////////////////////////////////////////////////////////
//Searching City's Weather Details
$(document).ready(()=>{
    let wrongOption = "Please select an option:";
    let current_resp = undefined;
    let forecast_resp = undefined;
    let historical_resp = undefined;
    let Status = undefined;
    var map = undefined;
    var marker = undefined;
    let btnSearch = document.getElementById('search')
    if(btnSearch){
        btnSearch.addEventListener("click", () =>{
            let input = document.getElementById('input-location').value;
            let option = document.getElementById('select-option').value;
            let forecast = document.getElementById('input-forecast').value;
            let history = document.getElementById('input-history').value;
            var date_regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
            if(input === ""){
                return alert("Textfields cannot be empty! Please enter a city");
            }else if(option === ""){
                return alert("Invalid option \""+wrongOption+"\"")
            }else if (option != "forecast" && forecast != "" || option === "forecast" && forecast === "") {
                    return alert("You didn't chose \"Forecast\" before or input is empty. Please switch to \"Forecast\" or clear the last input or input number of days for forecast.")
            }else if(option === "forecast" && forecast != ""){
                    if(forecast < 1){
                        return alert("The number of days of forecast cannot be less than 1")
                    }else if(forecast > 3){
                        return alert("The number of days of forecast cannot be grater than 3")
                    }
            }else if (option != "historical" && history != "" || option === "historical" && history === "") {
                return alert("You didn't chose \"Historical\" before or input is empty. Please switch to \"Historical\" or clear the last input or input number of days for forecast.")
            }else{
                if(option === "current"){
                    try {
                        $.ajax({
                            mode: 'cors',
                            method : "GET",
                            url: "http://api.weatherapi.com/v1/current.json?key=0082fdf80ca141dea31184121232909&q="+input+"&aqi=yes",
                            success : (resp) => {
                                current_resp = resp;
                                let location_name = document.getElementById('city-name');
                                if(current_resp.location.region === ""){
                                    location_name.innerHTML = current_resp.location.name+" ("+current_resp.location.country+")";
                                }else{
                                    location_name.innerHTML = current_resp.location.name+", "+current_resp.location.region+" ("+current_resp.location.country+")";
                                }
                                document.getElementById('city-weather-txt').innerHTML = current_resp.current.condition.text;
                                document.getElementById('city-weather').src = current_resp.current.condition.icon;
                                document.getElementById('celsius').innerHTML = current_resp.current.temp_c+" °C";
                                document.getElementById('fahrenheit').innerHTML = current_resp.current.temp_f+" °F";
                                document.getElementById('cloud').innerHTML = current_resp.current.cloud;
                                document.getElementById('uv').innerHTML = current_resp.current.uv;
                                document.getElementById('humidity').innerHTML = current_resp.current.humidity;
                                document.getElementById('kph').innerHTML = current_resp.current.wind_kph+" kph";
                                document.getElementById('mph').innerHTML = current_resp.current.wind_mph+" mph";
                                document.getElementById('in').innerHTML = current_resp.current.precip_in+"in";
                                document.getElementById('mm').innerHTML = current_resp.current.precip_mm+"mm";
                                if(map === undefined){
                                    map = L.map('cityFrame').setView([current_resp.location.lat, current_resp.location.lon], 10);
                                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                        maxZoom: 100,
                                        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                                                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                                                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                                        id: 'mapbox.streets'
                                    }).addTo(map);
                                    marker = L.marker([current_resp.location.lat, current_resp.location.lon]).addTo(map);
                                }else{
                                    map.remove();
                                    map = L.map('cityFrame').setView([current_resp.location.lat, current_resp.location.lon], 10);
                                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                        maxZoom: 100,
                                        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                                                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                                                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                                        id: 'mapbox.streets'
                                    }).addTo(map);
                                    marker = L.marker([current_resp.location.lat, current_resp.location.lon]).addTo(map);
                                }
                            },  
                            error : (error) => { 
                                alert("Sorry! Location wasn't found");
                            }
                        }); 
                    } catch (error) {}
                }else if(option === "forecast"){
                    document.getElementById('celsius').innerHTML = "30.0 °C";
                    document.getElementById('fahrenheit').innerHTML = "86.0 °C";
                    document.getElementById('humidity').innerHTML = "75";
                    document.getElementById('uv').innerHTML = "1.0";
                    document.getElementById('mph').innerHTML = "8.1 mph";
                    document.getElementById('kph').innerHTML = "13.0 kph";
                    document.getElementById('cloud').innerHTML = "50";
                    document.getElementById('mm').innerHTML = "0.0mm";    
                    document.getElementById('in').innerHTML = "0.0in";    
                    document.getElementById('cityFrame').src = "https://www.google.com/maps/place/Panadura,+Sri+Lanka/";
                }else if(option === "historical"){
                    if (date_regex.test(history)) {
                        let historical_date = new Date(history).toISOString().split('T')[0];
                        const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        const sixDaysAgo =  new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        const sevenDaysAgo =  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        let daysAgoArr = new Array();
                        daysAgoArr.push(oneDayAgo,twoDaysAgo,threeDaysAgo,fourDaysAgo,fiveDaysAgo,sixDaysAgo,sevenDaysAgo);
                        for (let index = 0; index < daysAgoArr.length; index++) {
                            if (historical_date === daysAgoArr[index]) {
                                return getHistoricalWeather(historical_date);
                            }else if(historical_date != daysAgoArr){
                                continue;
                            } else if(index === daysAgoArr){
                                return alert("The date you entered wasn't a past date or it did last more than seven days.")
                            }
                            
                        }
                    }else{
                        return alert("The date isn't corresponding the format.")
                    }
                }
            }
        });
    }
    let getHistoricalWeather = (_historical_date) =>{
        try {
            $.get("http://api.weatherapi.com/v1/history.json?key=0082fdf80ca141dea31184121232909&q="+input+"&dt="+_historical_date)
                .done(()=>{
                    historical_resp = resp;
                    let location_name = document.getElementById('city-name');
                    if(historical_resp.location.region === ""){
                        location_name.innerHTML = historical_resp.location.name+" ("+historical_resp.location.country+")";
                    }else{
                        location_name.innerHTML = historical_resp.location.name+", "+historical_resp.location.region+" ("+historical_resp.location.country+")";
                    }
                    document.getElementById('city-weather-txt').innerHTML = historical_resp.current.condition.text;
                    document.getElementById('city-weather').src = historical_resp.current.condition.icon;
                    document.getElementById('celsius').innerHTML = historical_resp.current.temp_c+" °C";
                    document.getElementById('fahrenheit').innerHTML = historical_resp.current.temp_f+" °F";
                    document.getElementById('cloud').innerHTML = historical_resp.current.cloud;
                    document.getElementById('uv').innerHTML = historical_resp.current.uv;
                    document.getElementById('humidity').innerHTML = historical_resp.current.humidity;
                    document.getElementById('kph').innerHTML = historical_resp.current.wind_kph+" kph";
                    document.getElementById('mph').innerHTML = historical_resp.current.wind_mph+" mph";
                    document.getElementById('in').innerHTML = historical_resp.current.precip_in+"in";
                    document.getElementById('mm').innerHTML = historical_resp.current.precip_mm+"mm";
                    if(map === undefined){
                        map = L.map('cityFrame').setView([historical_resp.location.lat, historical_resp.location.lon], 10);
                        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 100,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }).addTo(map);
                        marker = L.marker([historical_resp.location.lat, historical_resp.location.lon]).addTo(map);
                    }else{
                        map.remove();
                        map = L.map('cityFrame').setView([historical_resp.location.lat, historical_resp.location.lon], 10);
                        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 100,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }).addTo(map);
                        marker = L.marker([historical_resp.location.lat, historical_resp.location.lon]).addTo(map);
                    }
                })
                .fail((error)=>{
                    alert("Sorry! Location not found!")
                });
        } catch (error) {}
    }
});
///////////////////////////////////////////////////////////
//Getting site's feeback from Send us a feedback Section
let btnSubmit = document.getElementById('submit');
if (btnSubmit) {
    btnSubmit.addEventListener("click", () =>{
        let selectItem1 = document.getElementById("select-where");
        let selectedItem1 = selectItem1.value;
        let selectItem2 = document.getElementById("YesOrNo");
        let selectedItem2 = selectItem2.value;
        if (selectedItem1 == "" || selectedItem2 == "") {
            alert("Invalid option \""+wrongOption+"\"")
        } else {
            alert("Thank you for giving us a feedback!")
        }
    });
}
///////////////////////////////////////////////////////////
//Sign up
let ckeckPwd = (password) =>{
    let strength = 0;
    if (password.match(/[a-z]+/)) {
        strength+=1;
    }
    if (password.match(/[A-Z]+/)) {
        strength+=1;
    }
    if (password.match(/[0-9]+/)) {
        strength+=1;
    }
    if (password.match(/[$@#&!]+/)) {
        strength+=1;
    }
    switch (strength) {
        case 0:
            alert("Your password isn't strong at all. Please try to insert capital letters, extra symbols, numbers.");
            return "Your password isn't strong at all. Please try to insert capital letters, extra symbols, numbers";
        case 1:
            alert("Your password isn't strong enough. Please try to insert other capital letters, extra symbols, numbers.");
            return "Your password isn't strong enough. Please try to insert other capital letters, extra symbols, numbers.";
        case 2:
            alert("Your password is a bit strong. Please try to insert another capital letter, extra symbol, number.");
            return "Your password is a bit strong. Please try to insert another capital letter, extra symbol, number.";
        case 3:
            alert("Your password is stronger. Try to insert one more capital letter, extra symbol, number.");
            return "Your password is stronger. Try to insert one more capital letter, extra symbol, number.";
        case 4:
            alert("Your password is strong enough. You don't need to insert another thing.");
            return "Your password is strong enough. You don't need to insert another thing.";
    }
}
let user = {
    "name": undefined,
    "email": undefined,
    "password": undefined
}
let userArray = new Array(0);
let SignUpBtn = document.getElementById('sign_up_btn');
if(SignUpBtn){
    SignUpBtn.addEventListener("click", () =>{
        let txtName = document.getElementById('txtNameSignUp').value;
        let txtEmail = document.getElementById('txtEmailSignUp').value;
        let pwd = document.getElementById('txtPwdSignUp').value;
        if (txtName != "") {
            if (String(txtEmail).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                if(pwd.length < 6 || pwd.length > 12){
                    return alert ("Password must have a minimum of 6 characters and a maximum of 12.")
                }else{
                    let phrase = ckeckPwd(pwd);
                    let bool = phrase === "Your password is strong enough. You don't need to insert another thing.";
                    if (bool) {
                        user.name = txtName;
                        user.email = txtEmail;
                        user.password = pwd;
                        for (let index = 0; index < userArray.length; index++) {
                            console.log(index);
                            if(index!=0){
                                console.log(user);
                                userArray.push(user[index]);
                                console.log(userArray);
                            }else{
                                console.log(user[index]);
                                userArray.push(user[index]);
                                console.log(userArray);
                            }
                        }
                        userArray.length++;
                        console.log(userArray);
                    }
                }
            } else {
                return alert("You didn't enter an email or the value you entered is not a valid email");
            }
        } else {
            return alert("You didn't enter your name");
        }
    });
}
///////////////////////////////////////////////////////////
//Log in

///////////////////////////////////////////////////////////
// Make mobile navigation work

const btnMobile = document.querySelector('.btn-mobile-nav');
if(btnMobile){
    btnMobile.addEventListener("click", () =>{
        let image = document.getElementById('mobile-nav');
        if(image.src === "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAL0lEQVR4nO3BQREAMBADofVvOpXQ/w1QAEDtiHZEAADwtSPaEQEAwNeOaEcEANQDM6arjUtOdLsAAAAASUVORK5CYII="){
            image.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBUlEQVR4nO3ZTQqDMBCGYU/RSq9Yj1uwPc1bRBcirWicv4T5Vm6UeVCTGdJ1mUwm00yAJ9AHqKOfaim9eWDO6IlhRkw1TBlKHnADXssDPsBDpdL9Gu6rGt7FNXhikEJ4YpBGeGDQQlhi0EZYYMwQmhhzhAbGDSGJcUdIYMIgrmDCIUowYRFnMOERRzDVIPYw1SH+zBDj5tp9ULvyZup6E+tsPiezEUA0TXxa/PixI4zNp7K3OlWD4cASGx7DiX0iLIaCzS4chgs7dhgMAm2HOwbB3skNg0IDaI5BsYs1w2DQiqONsZwn0MJ4DEVIYzwnO6QwEcZTJDDNHL01cxiayWQyXcR8AfkY5euVO0c7AAAAAElFTkSuQmCC"
        }else{
            image.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAL0lEQVR4nO3BQREAMBADofVvOpXQ/w1QAEDtiHZEAADwtSPaEQEAwNeOaEcEANQDM6arjUtOdLsAAAAASUVORK5CYII="
        }
        headerEl.classList.toggle("nav-open");
    });
}
///////////////////////////////////////////////////////////
// Smooth scrolling animation

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
  link.addEventListener("click",  (e) => {
    e.preventDefault();
    const href = link.getAttribute("href");

    // Scroll back to top
    if (href === "#")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    // Scroll to other links
    if (href !== "#" && href.startsWith("#")) {
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({ behavior: "smooth" });
    }

    // Close mobile naviagtion
    if (link.classList.contains("main-nav-link"))
      headerEl.classList.toggle("nav-open");
  });
});


///////////////////////////////////////////////////////////
// Sticky navigation

const sectionHomeEl = document.querySelector(".section-home");

if (sectionHomeEl) {
    document.addEventListener("DOMContentLoaded", () =>{
        const obs = new IntersectionObserver(
            (entries) => {
              const ent = entries[0];
              if (ent.isIntersecting === false) {
                document.body.classList.add("sticky");
              }
          
              if (ent.isIntersecting === true) {
                document.body.classList.remove("sticky");
              }
            },
            {
              // In the viewport
              root: null,
              threshold: 0,
              rootMargin: "-80px",
            } 
          );
          obs.observe(sectionHomeEl);
    });
}
/*********Change theme*********/
try{
   var sRc = document.querySelector('#dark-light-effect-img').src
}catch(error){}
let section_333 = document.getElementsByClassName('section_333');
let section_444 = document.getElementsByClassName('section_444');
const SRC = sRc;
let change_theme = () =>{
   if (SRC!=null) {
    let img = document.getElementById('dark-light-effect-img');
    if(img.src === SRC){
        /*index.html*/
        img.src = "assets/dark-theme-image-btn.png";
        for (let index = 0; index < section_333.length; index++) {
            const element = section_333[index];
            element.style.backgroundColor = "#ddd";
            element.style.color = "#333";
        }
        for (let index = 0; index < section_444.length; index++) {
            const element = section_444[index];
            element.style.backgroundColor = "#ccc";
            element.style.color = "#444";
        }
        const user_img_ar = document.getElementsByClassName('testimonial-img');
        user_img_ar[0].src = "assets/Anne_A.png";
        user_img_ar[1].src = "assets/Brian_B.png";
        user_img_ar[2].src = "assets/Charlotte_C.png";
        user_img_ar[3].src = "assets/Daniel_D.png";
        const output_box_text = document.querySelectorAll('.output-box-text');
        output_box_text[1].style.backgroundColor = "#eee";
        const weather_icon_Ar = document.getElementsByClassName('weather_icon');
        weather_icon_Ar[0].src = "assets/wind_l.png";
        weather_icon_Ar[1].src = "assets/cloud_l.png";
        weather_icon_Ar[2].src = "assets/rain_l.png";
        const _see_link_2_ = document.querySelector('#see_link');
        _see_link_2_.style.color = "#376e0b";
    }else{
        /*index.html*/
        img.src = SRC;
        for (let index = 0; index < section_333.length; index++) {
            const element = section_333[index];
            element.style.backgroundColor = "#333";
            element.style.color = "#fff";
        }
        for (let index = 0; index < section_444.length; index++) {
            const element = section_444[index];
            element.style.backgroundColor = "#444";
            element.style.color = "#fff";
        }
        const user_img_ar = document.getElementsByClassName('testimonial-img');
        user_img_ar[0].src = "assets/Anne.png";
        user_img_ar[1].src = "assets/Brian.png";
        user_img_ar[2].src = "assets/Charlotte.png";
        user_img_ar[3].src = "assets/Daniel.png";
        const output_box_text = document.querySelectorAll('.output-box-text'); 
        output_box_text[1].style.backgroundColor = "#444";
        const weather_icon_Ar = document.getElementsByClassName('weather_icon');
        weather_icon_Ar[0].src = "assets/wind.png";
        weather_icon_Ar[1].src = "assets/cloud.png";
        weather_icon_Ar[2].src = "assets/rain.png";
        const _see_link_2_ = document.querySelector('#see_link');
        _see_link_2_.style.color = "#68e503";
    }
   }
};