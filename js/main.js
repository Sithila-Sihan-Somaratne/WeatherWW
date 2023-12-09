//The below line is used to help to see us the errors that VScode can't except.
'use strict'
const headerEl = document.querySelector(".header");
let selectOption = document.querySelector('#select-option');
let onSelectedOption = () => {
    let selectedOption = document.getElementById('select-option').value;
    if (selectedOption === "forecast" || selectedOption === "historical") {
        document.querySelector("#hour").disabled = false;

    } else {
        document.querySelector("#hour").disabled = true;
    }
}
///////////////////////////////////////////////////////////
//Searching City's Weather Details
$(document).ready(() => {
    let wrongOption = "Please select an option:";
    let current_resp = undefined;
    let forecast_resp = undefined;
    console.log(forecast_resp);
    let historical_resp = undefined;
    var map = undefined;
    var marker = undefined;
    console.log(marker);
    let btnSearch = document.getElementById('search')
    if (btnSearch) {
        btnSearch.addEventListener("click", () => {
            let input = document.getElementById('input-location').value;
            let option = document.getElementById('select-option').value;
            let forecast_opt = document.getElementById('select-option-fr').value;
            let history = document.getElementById('input-history').value;
            var date_regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
            if (input === "") {
                return alert("Textfields cannot be empty! Please enter a city");
            } else if (option === "") {
                return alert("Invalid option \"" + wrongOption + "\"")
            } else if (option != "forecast" && forecast_opt != "" || option === "forecast" && forecast_opt === "") {
                return alert("You didn't chose \"Forecast\" before or input is empty. Please switch to \"Forecast\" or clear the last input or input number of days for forecast.")
            } else if (option != "historical" && history != "" || option === "historical" && history === "") {
                return alert("You didn't chose \"Historical\" before or input is empty. Please switch to \"Historical\" or clear the last input or input number of days for forecast.")
            } else {
                if (option === "current") {
                    try {
                        $.ajax({
                            mode: 'cors',
                            method: "GET",
                            url: "http://api.weatherapi.com/v1/current.json?key=0082fdf80ca141dea31184121232909&q=" + input + "&aqi=yes",
                            success: (resp) => {
                                current_resp = resp;
                                let location_name = document.getElementById('city-name');
                                if (current_resp.location.region === "") {
                                    location_name.innerHTML = current_resp.location.name + " (" + current_resp.location.country + ")";
                                } else {
                                    location_name.innerHTML = current_resp.location.name + ", " + current_resp.location.region + " (" + current_resp.location.country + ")";
                                }
                                document.getElementById('city-weather-txt').innerHTML = current_resp.current.condition.text;
                                document.getElementById('city-weather').src = current_resp.current.condition.icon;
                                document.getElementById('celsius').innerHTML = current_resp.current.temp_c + " °C";
                                document.getElementById('fahrenheit').innerHTML = current_resp.current.temp_f + " °F";
                                document.getElementById('cloud').innerHTML = current_resp.current.cloud;
                                document.getElementById('uv').innerHTML = current_resp.current.uv;
                                document.getElementById('humidity').innerHTML = current_resp.current.humidity;
                                document.getElementById('kph').innerHTML = current_resp.current.wind_kph + " kph";
                                document.getElementById('mph').innerHTML = current_resp.current.wind_mph + " mph";
                                document.getElementById('in').innerHTML = current_resp.current.precip_in + "in";
                                document.getElementById('mm').innerHTML = current_resp.current.precip_mm + "mm";
                                if (map !== undefined) {
                                    map.remove();
                                }
                                map = L.map('cityFrame').setView([current_resp.location.lat, current_resp.location.lon], 13);
                                L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=egoOdaRfQOWYBdPp56xc', {
                                    maxZoom: 18,
                                    attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                                        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                                        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                                    id: 'mapbox.streets'
                                }).addTo(map);
                                marker = L.marker([current_resp.location.lat, current_resp.location.lon]).addTo(map);
                            },
                            error: (error) => {
                                const alertPlaceholder = document.querySelector('#liveAlertPlaceHolder');
                                console.log(alertPlaceholder);
                                const wrapper = document.createElement('div');
                                wrapper.innerHTML = [
                                    `<div class="alert alert-danger alert-dismissible" role="alert">`,
                                    `   <div>Sorry! Location wasn't found. Please try again.</div>`,
                                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                                    '</div>'
                                ].join('')
                                alertPlaceholder.append(wrapper);
                                console.error(error);
                            }
                        });
                    } catch (error) { }
                } else if (option === "forecast") {
                    const today = new Date(Date.now()).toISOString().split('T')[0];
                    const oneDayAfter = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    const twoDaysAfter = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                    if (forecast_opt != "") {
                        if(forecast_opt === "today"){
                            getForecastToday(today, input, forecast_resp, map);
                        } else if (forecast_opt === "tomorrow") {
                            getForecastTomorrow(oneDayAfter, input, forecast_resp, map);
                        } else if (forecast_opt === "dayAfterTomorrow") {
                            getForecastDayAfterTomorrow(twoDaysAfter, input, forecast_resp, map);
                        }
                    } else {
                        alert("Option \"" + forecast_opt + "\" is incorrect. Please choose another option");
                    }
                } else if (option === "historical") {
                    if (date_regex.test(history)) {
                        let historical_date = new Date(history).toISOString().split('T')[0];
                        const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                        let daysAgoArr = new Array();
                        daysAgoArr.push(oneDayAgo, twoDaysAgo, threeDaysAgo, fourDaysAgo, fiveDaysAgo, sixDaysAgo, sevenDaysAgo);
                        for (let index = 0; index < daysAgoArr.length; index++) {
                            if (historical_date === daysAgoArr[index]) {
                                try {
                                    $.ajax({
                                        mode: 'cors',
                                        method: "GET",
                                        url: "http://api.weatherapi.com/v1/history.json?key=0082fdf80ca141dea31184121232909&q=" + input + "&dt=" + historical_date,
                                        success: (resp) => {
                                            historical_resp = resp;
                                            console.log(historical_resp);
                                            let num = document.getElementById('hour').value;
                                            let hour = convertToHours(num);
                                            let fullDate = historical_date + " " + hour;
                                            let location_name = document.getElementById('city-name');
                                            console.log(fullDate);
                                            for (let index = 0; index < 24; index++) {
                                                let dateANDtime = historical_resp.forecast.forecastday[0].hour[index].time;
                                                if (dateANDtime == fullDate) {
                                                    if (historical_resp.location.region === "") {
                                                        location_name.innerHTML = historical_resp.location.name + " (" + historical_resp.location.country + ")";
                                                    } else {
                                                        location_name.innerHTML = historical_resp.location.name + ", " + historical_resp.location.region + " (" + historical_resp.location.country + ")";
                                                    }
                                                    document.getElementById('city-weather-txt').innerHTML = historical_resp.forecast.forecastday[0].hour[index].condition.text;
                                                    document.getElementById('city-weather').src = historical_resp.forecast.forecastday[0].hour[index].condition.icon;
                                                    document.getElementById('celsius').innerHTML = historical_resp.forecast.forecastday[0].hour[index].temp_c + " °C";
                                                    document.getElementById('fahrenheit').innerHTML = historical_resp.forecast.forecastday[0].hour[index].temp_f + " °F";
                                                    document.getElementById('cloud').innerHTML = historical_resp.forecast.forecastday[0].hour[index].cloud;
                                                    document.getElementById('uv').innerHTML = historical_resp.forecast.forecastday[0].hour[index].uv;
                                                    document.getElementById('humidity').innerHTML = historical_resp.forecast.forecastday[0].hour[index].humidity;
                                                    document.getElementById('kph').innerHTML = historical_resp.forecast.forecastday[0].hour[index].wind_kph + " kph";
                                                    document.getElementById('mph').innerHTML = historical_resp.forecast.forecastday[0].hour[index].wind_mph + " mph";
                                                    document.getElementById('in').innerHTML = historical_resp.forecast.forecastday[0].hour[index].precip_in + "in";
                                                    document.getElementById('mm').innerHTML = historical_resp.forecast.forecastday[0].hour[index].precip_mm + "mm";
                                                    if (map !== undefined) {
                                                        map.remove();
                                                    }
                                                    map = L.map('cityFrame').setView([historical_resp.location.lat, historical_resp.location.lon], 13);
                                                    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=egoOdaRfQOWYBdPp56xc', {
                                                        maxZoom: 18,
                                                        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                                                            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                                                            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                                                        id: 'mapbox.streets'
                                                    }).addTo(map);
                                                    marker = L.marker([historical_resp.location.lat, historical_resp.location.lon]).addTo(map);
                                                } else {
                                                    continue;
                                                }

                                            }
                                        },
                                        error: (error) => {
                                            const alertPlaceholder = document.querySelector('#liveAlertPlaceHolder');
                                            console.log(alertPlaceholder);
                                            const wrapper = document.createElement('div');
                                            wrapper.innerHTML = [
                                                `<div class="alert alert-danger alert-dismissible" role="alert">`,
                                                `   <div>Sorry! Location wasn't found. Please try again.</div>`,
                                                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                                                '</div>'
                                            ].join('')
                                            alertPlaceholder.append(wrapper);
                                            console.error(error);
                                        }
                                    });
                                } catch (error) {
                                    console.error(error);
                                }
                                break;
                            } else if (historical_date != daysAgoArr) {
                                continue;
                            } else if (index === daysAgoArr) {
                                return alert("The date you entered wasn't a past date or it did last more than seven days.")
                            }
                        }
                    } else {
                        return alert("The date isn't corresponding the format.")
                    }
                }
            }
        });
    }
});
let getForecastToday = (today, location, resp_forecast, map) => {
    try {
        $.ajax({
            mode: 'cors',
            method: "GET",
            url: "http://api.weatherapi.com/v1/forecast.json?key=0082fdf80ca141dea31184121232909&q=" + location + "&days=3&aqi=yes&alerts=yes",
            success: (resp) => {
                console.log(today);
                resp_forecast = resp;
                let forecast_resp = resp_forecast;
                console.log(resp_forecast);
                let num = document.getElementById('hour').value;
                let hour = convertToHours(num);
                let fullDate = today + " " + hour;
                let location_name = document.getElementById('city-name');
                for (let index = 0; index < 24; index++) {
                    console.log(index);
                    let dateANDtime = forecast_resp.forecast.forecastday[0].hour[index].time;
                    console.log(dateANDtime+"==="+fullDate);
                    console.log(dateANDtime === fullDate);
                    if (dateANDtime === fullDate) {
                        if (forecast_resp.location.region === "") {
                            location_name.innerHTML = forecast_resp.location.name + " (" + forecast_resp.location.country + ")";
                        } else {
                            location_name.innerHTML = forecast_resp.location.name + ", " + forecast_resp.location.region + " (" + forecast_resp.location.country + ")";
                        }
                        document.getElementById('city-weather-txt').innerHTML = forecast_resp.forecast.forecastday[0].hour[index].condition.text;
                        document.getElementById('city-weather').src = forecast_resp.forecast.forecastday[0].hour[index].condition.icon;
                        document.getElementById('celsius').innerHTML = forecast_resp.forecast.forecastday[0].hour[index].temp_c + " °C";
                        document.getElementById('fahrenheit').innerHTML = forecast_resp.forecast.forecastday[0].hour[index].temp_f + " °F";
                        document.getElementById('cloud').innerHTML = forecast_resp.forecast.forecastday[0].hour[index].cloud;
                        document.getElementById('uv').innerHTML = forecast_resp.forecast.forecastday[0].hour[index].uv;
                        document.getElementById('humidity').innerHTML = forecast_resp.forecast.forecastday[0].hour[index].humidity;
                        document.getElementById('kph').innerHTML = forecast_resp.forecast.forecastday[0].hour[index].wind_kph + " kph";
                        document.getElementById('mph').innerHTML = forecast_resp.forecast.forecastday[0].hour[index].wind_mph + " mph";
                        document.getElementById('in').innerHTML = forecast_resp.forecast.forecastday[0].hour[index].precip_in + "in";
                        document.getElementById('mm').innerHTML = forecast_resp.forecast.forecastday[0].hour[index].precip_mm + "mm";
                        let marker;
                        if (map !== undefined) {
                            map.remove();
                        }
                        map = L.map('cityFrame').setView([forecast_resp.location.lat, forecast_resp.location.lon], 13);
                        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=egoOdaRfQOWYBdPp56xc', {
                            maxZoom: 18,
                            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                            id: 'mapbox.streets'
                        }).addTo(map);
                        marker = L.marker([forecast_resp.location.lat, forecast_resp.location.lon]).addTo(map);
                    } else {
                        continue;
                    }
                }
            }, error: (error) => {
                const alertPlaceholder = document.querySelector('#liveAlertPlaceHolder');
                console.log(alertPlaceholder);
                const wrapper = document.createElement('div');
                wrapper.innerHTML = [
                    `<div class="alert alert-danger alert-dismissible" role="alert">`,
                    `   <div>Sorry! Location wasn't found. Please try again.</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('')
                alertPlaceholder.append(wrapper);
                console.error(error);
            }
        })
    }catch (error) {
        alert("Something happend!");
    }
}
 
let getForecastTomorrow = (tomorrow, location, resp_forecast, map) => {
    try {
        $.ajax({
            mode: 'cors',
            method: "GET",
            url: "http://api.weatherapi.com/v1/forecast.json?key=0082fdf80ca141dea31184121232909&q=" + location + "&days=3&aqi=yes&alerts=yes",
            success: (resp) => {
                console.log(tomorrow);
                resp_forecast = resp;
                let forecast_resp = resp_forecast;
                console.log(resp_forecast);
                let num = document.getElementById('hour').value;
                let hour = convertToHours(num);
                let fullDate = tomorrow + " " + hour;
                let location_name = document.getElementById('city-name');
                for (let index = 0; index < 24; index++) {
                    console.log(index);
                    let dateANDtime = forecast_resp.forecast.forecastday[1].hour[index].time;
                    console.log(dateANDtime+"==="+fullDate);
                    console.log(dateANDtime === fullDate);
                    if (dateANDtime === fullDate) {
                        if (forecast_resp.location.region === "") {
                            location_name.innerHTML = forecast_resp.location.name + " (" + forecast_resp.location.country + ")";
                        } else {
                            location_name.innerHTML = forecast_resp.location.name + ", " + forecast_resp.location.region + " (" + forecast_resp.location.country + ")";
                        }
                        document.getElementById('city-weather-txt').innerHTML = forecast_resp.forecast.forecastday[1].hour[index].condition.text;
                        document.getElementById('city-weather').src = forecast_resp.forecast.forecastday[1].hour[index].condition.icon;
                        document.getElementById('celsius').innerHTML = forecast_resp.forecast.forecastday[1].hour[index].temp_c + " °C";
                        document.getElementById('fahrenheit').innerHTML = forecast_resp.forecast.forecastday[1].hour[index].temp_f + " °F";
                        document.getElementById('cloud').innerHTML = forecast_resp.forecast.forecastday[1].hour[index].cloud;
                        document.getElementById('uv').innerHTML = forecast_resp.forecast.forecastday[1].hour[index].uv;
                        document.getElementById('humidity').innerHTML = forecast_resp.forecast.forecastday[1].hour[index].humidity;
                        document.getElementById('kph').innerHTML = forecast_resp.forecast.forecastday[1].hour[index].wind_kph + " kph";
                        document.getElementById('mph').innerHTML = forecast_resp.forecast.forecastday[1].hour[index].wind_mph + " mph";
                        document.getElementById('in').innerHTML = forecast_resp.forecast.forecastday[1].hour[index].precip_in + "in";
                        document.getElementById('mm').innerHTML = forecast_resp.forecast.forecastday[1].hour[index].precip_mm + "mm";
                        if (map !== undefined) {
                            map.remove();
                        }
                        map = L.map('cityFrame').setView([forecast_resp.location.lat, forecast_resp.location.lon], 13);
                        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=egoOdaRfQOWYBdPp56xc', {
                            maxZoom: 18,
                            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                            id: 'mapbox.streets'
                        }).addTo(map);
                        marker = L.marker([forecast_resp.location.lat, forecast_resp.location.lon]).addTo(map);
                    } else {
                        continue;
                    }
                }
            }, error: (error) => {
                const alertPlaceholder = document.querySelector('#liveAlertPlaceHolder');
                console.log(alertPlaceholder);
                const wrapper = document.createElement('div');
                wrapper.innerHTML = [
                    `<div class="alert alert-danger alert-dismissible" role="alert">`,
                    `   <div>Sorry! Location wasn't found. Please try again.</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('')
                alertPlaceholder.append(wrapper);
                console.error(error);
            }
        })
    }catch (error) {
        alert("Something happend!");
    }
}
let getForecastDayAfterTomorrow = (DayAfterTomorrow, location, resp_forecast, map) => {
    try {
        $.ajax({
            mode: 'cors',
            method: "GET",
            url: "http://api.weatherapi.com/v1/forecast.json?key=0082fdf80ca141dea31184121232909&q=" + location + "&days=3&aqi=yes&alerts=yes",
            success: (resp) => {
                console.log(DayAfterTomorrow);
                resp_forecast = resp;
                let forecast_resp = resp_forecast;
                console.log(resp_forecast);
                let num = document.getElementById('hour').value;
                let hour = convertToHours(num);
                let fullDate = DayAfterTomorrow + " " + hour;
                let location_name = document.getElementById('city-name');
                for (let index = 0; index < 24; index++) {
                    console.log(index);
                    let dateANDtime = forecast_resp.forecast.forecastday[2].hour[index].time;
                    console.log(dateANDtime+"-"+fullDate);
                    if (dateANDtime === fullDate) {
                        if (forecast_resp.location.region === "") {
                            location_name.innerHTML = forecast_resp.location.name + " (" + forecast_resp.location.country + ")";
                        } else {
                            location_name.innerHTML = forecast_resp.location.name + ", " + forecast_resp.location.region + " (" + forecast_resp.location.country + ")";
                        }
                        document.getElementById('city-weather-txt').innerHTML = forecast_resp.forecast.forecastday[2].hour[index].condition.text;
                        document.getElementById('city-weather').src = forecast_resp.forecast.forecastday[2].hour[index].condition.icon;
                        document.getElementById('celsius').innerHTML = forecast_resp.forecast.forecastday[2].hour[index].temp_c + " °C";
                        document.getElementById('fahrenheit').innerHTML = forecast_resp.forecast.forecastday[2].hour[index].temp_f + " °F";
                        document.getElementById('cloud').innerHTML = forecast_resp.forecast.forecastday[2].hour[index].cloud;
                        document.getElementById('uv').innerHTML = forecast_resp.forecast.forecastday[2].hour[index].uv;
                        document.getElementById('humidity').innerHTML = forecast_resp.forecast.forecastday[2].hour[index].humidity;
                        document.getElementById('kph').innerHTML = forecast_resp.forecast.forecastday[2].hour[index].wind_kph + " kph";
                        document.getElementById('mph').innerHTML = forecast_resp.forecast.forecastday[2].hour[index].wind_mph + " mph";
                        document.getElementById('in').innerHTML = forecast_resp.forecast.forecastday[2].hour[index].precip_in + "in";
                        document.getElementById('mm').innerHTML = forecast_resp.forecast.forecastday[2].hour[index].precip_mm + "mm";
                        let marker;
                        if (map !== undefined) {
                            map.remove();
                        }
                        map = L.map('cityFrame').setView([forecast_resp.location.lat, forecast_resp.location.lon], 13);
                        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=egoOdaRfQOWYBdPp56xc', {
                            maxZoom: 18,
                            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                            id: 'mapbox.streets'
                        }).addTo(map);
                        marker = L.marker([forecast_resp.location.lat, forecast_resp.location.lon]).addTo(map);
                    } else {
                        continue;
                    }
                }
            }, error: (error) => {
                const alertPlaceholder = document.querySelector('#liveAlertPlaceHolder');
                console.log(alertPlaceholder);
                const wrapper = document.createElement('div');
                wrapper.innerHTML = [
                    `<div class="alert alert-danger alert-dismissible" role="alert">`,
                    `   <div>Sorry! Location wasn't found. Please try again.</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('')
                alertPlaceholder.append(wrapper);
                console.error(error);
            }
        })
    }catch (error) {
        alert("Something happend!");
    }
}
///////////////////////////////////////////////////////////
//Convert input number to hour
function convertToHours(num) {
    var hours = Math.floor(num);
    var minutes = "00";
    if (hours < 10) {
        return "0" + hours + ":" + minutes;
    }
    return hours + ":" + minutes;
}

///////////////////////////////////////////////////////////
//Getting site's feeback from Send us a feedback Section
let btnSubmit = document.getElementById('submit');
if (btnSubmit) {
    btnSubmit.addEventListener("click", () => {
        let selectItem1 = document.getElementById("select-where");
        let selectedItem1 = selectItem1.value;
        let selectItem2 = document.getElementById("YesOrNo");
        let selectedItem2 = selectItem2.value;
        if (selectedItem1 == "" || selectedItem2 == "") {
            alert("Invalid option \"" + wrongOption + "\"")
        } else {
            alert("Thank you for giving us a feedback!")
        }
    });
}
///////////////////////////////////////////////////////////
// Make mobile navigation work

const btnMobile = document.querySelector('.btn-mobile-nav');
if (btnMobile) {
    btnMobile.addEventListener("click", () => {
        let image = document.getElementById('mobile-nav');
        if (image.src === "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAL0lEQVR4nO3BQREAMBADofVvOpXQ/w1QAEDtiHZEAADwtSPaEQEAwNeOaEcEANQDM6arjUtOdLsAAAAASUVORK5CYII=") {
            image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBUlEQVR4nO3ZTQqDMBCGYU/RSq9Yj1uwPc1bRBcirWicv4T5Vm6UeVCTGdJ1mUwm00yAJ9AHqKOfaim9eWDO6IlhRkw1TBlKHnADXssDPsBDpdL9Gu6rGt7FNXhikEJ4YpBGeGDQQlhi0EZYYMwQmhhzhAbGDSGJcUdIYMIgrmDCIUowYRFnMOERRzDVIPYw1SH+zBDj5tp9ULvyZup6E+tsPiezEUA0TXxa/PixI4zNp7K3OlWD4cASGx7DiX0iLIaCzS4chgs7dhgMAm2HOwbB3skNg0IDaI5BsYs1w2DQiqONsZwn0MJ4DEVIYzwnO6QwEcZTJDDNHL01cxiayWQyXcR8AfkY5euVO0c7AAAAAElFTkSuQmCC"
        } else {
            image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAL0lEQVR4nO3BQREAMBADofVvOpXQ/w1QAEDtiHZEAADwtSPaEQEAwNeOaEcEANQDM6arjUtOdLsAAAAASUVORK5CYII="
        }
        headerEl.classList.toggle("nav-open");
    });
}
///////////////////////////////////////////////////////////
// Smooth scrolling animation

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
    link.addEventListener("click", (e) => {
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
            let image = document.getElementById('mobile-nav');
            if(window.getComputedStyle(image).display !== "none"){
                image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAL0lEQVR4nO3BQREAMBADofVvOpXQ/w1QAEDtiHZEAADwtSPaEQEAwNeOaEcEANQDM6arjUtOdLsAAAAASUVORK5CYII=";
            }else{
                image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBUlEQVR4nO3ZTQqDMBCGYU/RSq9Yj1uwPc1bRBcirWicv4T5Vm6UeVCTGdJ1mUwm00yAJ9AHqKOfaim9eWDO6IlhRkw1TBlKHnADXssDPsBDpdL9Gu6rGt7FNXhikEJ4YpBGeGDQQlhi0EZYYMwQmhhzhAbGDSGJcUdIYMIgrmDCIUowYRFnMOERRzDVIPYw1SH+zBDj5tp9ULvyZup6E+tsPiezEUA0TXxa/PixI4zNp7K3OlWD4cASGx7DiX0iLIaCzS4chgs7dhgMAm2HOwbB3skNg0IDaI5BsYs1w2DQiqONsZwn0MJ4DEVIYzwnO6QwEcZTJDDNHL01cxiayWQyXcR8AfkY5euVO0c7AAAAAElFTkSuQmCC";
            }
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
    document.addEventListener("DOMContentLoaded", () => {
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
try {
    var sRc = document.querySelector('#dark-light-effect-img').src
} catch (error) { }
let section_333 = document.getElementsByClassName('section_333');
let section_444 = document.getElementsByClassName('section_444');
const SRC = sRc;
let change_theme = () => {
    // Get the HTML element
    let htmlElement = document.getElementById('html');
    // Check the current theme
    if (htmlElement.getAttribute('data-bs-theme') === 'dark') {
        // If it's dark, change it to light
        htmlElement.setAttribute('data-bs-theme', 'light');
    } else {
        // If it's not dark, change it to dark
        htmlElement.setAttribute('data-bs-theme', 'dark');
    }
    if (SRC != null) {
        let img = document.getElementById('dark-light-effect-img');
        if (img.src === SRC) {
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
        } else {
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
}