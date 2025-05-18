document.addEventListener('DOMContentLoaded', function () {
  // ===== THEME SWITCHER (with persistence) =====
  const THEME_KEY = 'weatherww-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  // Use id 'html' if present, or default to <html>
  const htmlElement = document.getElementById('html') || document.documentElement;
  const img = document.getElementById('dark-light-effect-img');

  // Swaps asset images and CSS based on theme
  function swapThemeAssets(theme) {
    // Testimonials and weather icons (if present)
    document.querySelectorAll('.testimonial-img').forEach(el => {
      if (el.dataset[theme]) el.src = el.dataset[theme];
    });
    document.querySelectorAll('.weather_icon').forEach(el => {
      if (el.dataset[theme]) el.src = el.dataset[theme];
    });
    // Section backgrounds and output
    document.querySelectorAll('.section_333').forEach(el => {
      el.style.backgroundColor = theme === "dark" ? "#333" : "#ddd";
      el.style.color = theme === "dark" ? "#fff" : "#333";
    });
    document.querySelectorAll('.section_444').forEach(el => {
      el.style.backgroundColor = theme === "dark" ? "#444" : "#ccc";
      el.style.color = theme === "dark" ? "#fff" : "#444";
    });
    document.querySelectorAll('.output-box-text').forEach(el => {
      el.style.backgroundColor = theme === "dark" ? "#444" : "#eee";
      el.style.color = theme === "dark" ? "#fff" : "#222";
    });
    // See link color
    const seeLink = document.getElementById('see_link');
    if (seeLink)
      seeLink.style.color = theme === "dark" ? "#68e503" : "#376e0b";
    // Theme button image
    if (img) {
      img.src = theme === "dark"
        ? "assets/light-theme-image-btn.png"
        : "assets/dark-theme-image-btn.png";
    }
    // Body bg/text
    document.body.classList.remove('bg-dark', 'text-light', 'bg-light', 'text-dark');
    if (theme === "dark") {
      document.body.classList.add('bg-dark', 'text-light');
    } else {
      document.body.classList.add('bg-light', 'text-dark');
    }
  }

  // Apply theme to the page
  function applyTheme(theme) {
    htmlElement.setAttribute('data-bs-theme', theme);
    swapThemeAssets(theme);
  }

  // Set and persist theme
  function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }

  // On load: get theme from storage or default
  function getInitialTheme() {
    return localStorage.getItem(THEME_KEY) || DARK;
  }

  // Initialize theme on page load
  applyTheme(getInitialTheme());

  // Toggle theme and persist
  function toggleTheme() {
    let current = htmlElement.getAttribute('data-bs-theme');
    let theme = current === 'dark' ? 'light' : 'dark';
    setTheme(theme);
  }

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // ===== FIELD ENABLING LOGIC =====
  const selectOption = document.getElementById('select-option');
  const forecastSelect = document.getElementById('select-option-fr');
  const historyInput = document.getElementById('input-history');
  const hourInput = document.getElementById('hour');

  function updateFields() {
    if (!selectOption) return;
    const value = selectOption.value;
    if (forecastSelect) forecastSelect.disabled = value !== 'forecast';
    if (historyInput) historyInput.disabled = value !== 'historical';
    if (hourInput) hourInput.disabled = !(value === 'forecast' || value === 'historical');
    if (forecastSelect && forecastSelect.disabled) forecastSelect.value = "";
    if (historyInput && historyInput.disabled) historyInput.value = "";
    if (hourInput && hourInput.disabled) hourInput.value = "";
  }
  if (selectOption) selectOption.addEventListener('change', updateFields);
  updateFields();

  // ===== ALERTS =====
  function showAlert(message, type = 'info', autoClose = true, ms = 3500) {
    const alertPlaceholder = document.getElementById('liveAlertPlaceHolder');
    if (!alertPlaceholder) return;
    alertPlaceholder.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    if (autoClose) {
      setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance(alertPlaceholder.querySelector('.alert'));
        alert.close();
      }, ms);
    }
  }

  // ===== FEEDBACK FORM =====
  const submitBtn = document.getElementById('submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      let where = document.getElementById("select-where").value;
      let like = document.getElementById("YesOrNo").value;
      if (where === "" || like === "") {
        showAlert("Invalid option. Please select an option in both fields.", "warning");
      } else {
        showAlert("Thank you for giving us feedback!", "success");
      }
    });
  }

  // ===== WEATHER SEARCH LOGIC =====
  let map, marker;
  let btnSearch = document.getElementById('search');
  if (btnSearch) {
    btnSearch.addEventListener("click", function () {
      let input = document.getElementById('input-location').value;
      let option = document.getElementById('select-option').value;
      let forecast_opt = document.getElementById('select-option-fr').value;
      let history = document.getElementById('input-history').value;
      let hour = document.getElementById('hour').value;
      var date_regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

      if (input === "") {
        return showAlert("Textfields cannot be empty! Please enter a city", "danger");
      } else if (option === "") {
        return showAlert("Invalid option. Please select an option.", "warning");
      } else if (option !== "forecast" && forecast_opt !== "" || option === "forecast" && forecast_opt === "") {
        return showAlert("You didn't choose \"Forecast\" before or forecast input is empty. Please switch to \"Forecast\" or clear the last input.", "warning");
      } else if (option !== "historical" && history !== "" || option === "historical" && history === "") {
        return showAlert("You didn't choose \"Historical\" before or history date is empty. Please switch to \"Historical\" or clear the last input.", "warning");
      } else if ((option === "forecast" || option === "historical") && hour === "") {
        return showAlert("Please select an hour for forecast/historical search.", "warning");
      } else {
        // ---- CURRENT ----
        if (option === "current") {
          $.ajax({
            mode: 'cors',
            method: "GET",
            url: "http://api.weatherapi.com/v1/current.json?key=0082fdf80ca141dea31184121232909&q=" + input + "&aqi=yes",
            success: (resp) => {
              let location_name = document.getElementById('city-name');
              if (resp.location.region === "") {
                location_name.innerHTML = resp.location.name + " (" + resp.location.country + ")";
              } else {
                location_name.innerHTML = resp.location.name + ", " + resp.location.region + " (" + resp.location.country + ")";
              }
              document.getElementById('city-weather-txt').innerHTML = resp.current.condition.text;
              document.getElementById('city-weather').src = resp.current.condition.icon;
              document.getElementById('celsius').innerHTML = resp.current.temp_c + " °C";
              document.getElementById('fahrenheit').innerHTML = resp.current.temp_f + " °F";
              document.getElementById('cloud').innerHTML = resp.current.cloud;
              document.getElementById('uv').innerHTML = resp.current.uv;
              document.getElementById('humidity').innerHTML = resp.current.humidity;
              document.getElementById('kph').innerHTML = resp.current.wind_kph + " kph";
              document.getElementById('mph').innerHTML = resp.current.wind_mph + " mph";
              document.getElementById('in').innerHTML = resp.current.precip_in + " in";
              document.getElementById('mm').innerHTML = resp.current.precip_mm + " mm";
              // Map
              if (window.map) {
                window.map.remove();
                window.map = null;
              }
              window.map = L.map('cityFrame').setView([resp.location.lat, resp.location.lon], 13);
              L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=egoOdaRfQOWYBdPp56xc', {
                maxZoom: 18,
                attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                  '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                  'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: 'mapbox.streets'
              }).addTo(window.map);
              L.marker([resp.location.lat, resp.location.lon]).addTo(window.map);
            },
            error: (error) => {
              showAlert("Sorry! Location wasn't found. Please try again.", "danger");
              console.error(error);
            }
          });
        }
        // ---- FORECAST ----
        else if (option === "forecast") {
          const today = new Date(Date.now()).toISOString().split('T')[0];
          const oneDayAfter = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          const twoDaysAfter = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          if (forecast_opt === "today") {
            getForecastDay(0, today, input, hour);
          } else if (forecast_opt === "tomorrow") {
            getForecastDay(1, oneDayAfter, input, hour);
          } else if (forecast_opt === "dayAfterTomorrow") {
            getForecastDay(2, twoDaysAfter, input, hour);
          } else {
            showAlert("Option \"" + forecast_opt + "\" is incorrect. Please choose another option", "warning");
          }
        }
        // ---- HISTORICAL ----
        else if (option === "historical") {
          if (date_regex.test(history)) {
            let historical_date = new Date(history).toISOString().split('T')[0];
            let num = Number(hour);
            if (isNaN(num) || num < 0 || num > 23) {
              return showAlert("Hour must be between 0 and 23.", "warning");
            }
            $.ajax({
              mode: 'cors',
              method: "GET",
              url: "http://api.weatherapi.com/v1/history.json?key=0082fdf80ca141dea31184121232909&q=" + input + "&dt=" + historical_date,
              success: (resp) => {
                let fullDate = historical_date + " " + convertToHours(hour);
                let location_name = document.getElementById('city-name');
                let found = false;
                for (let index = 0; index < 24; index++) {
                  let dateANDtime = resp.forecast.forecastday[0].hour[index].time;
                  if (dateANDtime == fullDate) {
                    found = true;
                    if (resp.location.region === "") {
                      location_name.innerHTML = resp.location.name + " (" + resp.location.country + ")";
                    } else {
                      location_name.innerHTML = resp.location.name + ", " + resp.location.region + " (" + resp.location.country + ")";
                    }
                    document.getElementById('city-weather-txt').innerHTML = resp.forecast.forecastday[0].hour[index].condition.text;
                    document.getElementById('city-weather').src = resp.forecast.forecastday[0].hour[index].condition.icon;
                    document.getElementById('celsius').innerHTML = resp.forecast.forecastday[0].hour[index].temp_c + " °C";
                    document.getElementById('fahrenheit').innerHTML = resp.forecast.forecastday[0].hour[index].temp_f + " °F";
                    document.getElementById('cloud').innerHTML = resp.forecast.forecastday[0].hour[index].cloud;
                    document.getElementById('uv').innerHTML = resp.forecast.forecastday[0].hour[index].uv;
                    document.getElementById('humidity').innerHTML = resp.forecast.forecastday[0].hour[index].humidity;
                    document.getElementById('kph').innerHTML = resp.forecast.forecastday[0].hour[index].wind_kph + " kph";
                    document.getElementById('mph').innerHTML = resp.forecast.forecastday[0].hour[index].wind_mph + " mph";
                    document.getElementById('in').innerHTML = resp.forecast.forecastday[0].hour[index].precip_in + " in";
                    document.getElementById('mm').innerHTML = resp.forecast.forecastday[0].hour[index].precip_mm + " mm";
                    if (window.map) {
                      window.map.remove();
                      window.map = null;
                    }
                    window.map = L.map('cityFrame').setView([resp.location.lat, resp.location.lon], 13);
                    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=egoOdaRfQOWYBdPp56xc', {
                      maxZoom: 18,
                      attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                      id: 'mapbox.streets'
                    }).addTo(window.map);
                    L.marker([resp.location.lat, resp.location.lon]).addTo(window.map);
                    break;
                  }
                }
                if (!found) {
                  showAlert("No weather data found for the selected hour on this date.", "warning");
                }
              },
              error: (error) => {
                showAlert("Sorry! Location or date wasn't found. Please try again.", "danger");
                console.error(error);
              }
            });
          } else {
            showAlert("The date isn't in the correct format (YYYY-MM-DD).", "warning");
          }
        }
      }
    });
  }

  function getForecastDay(dayIndex, dateStr, location, hour) {
    $.ajax({
      mode: 'cors',
      method: "GET",
      url: "http://api.weatherapi.com/v1/forecast.json?key=0082fdf80ca141dea31184121232909&q=" + location + "&days=3&aqi=yes&alerts=yes",
      success: (resp) => {
        let num = Number(hour);
        if (isNaN(num) || num < 0 || num > 23) {
          showAlert("Hour must be between 0 and 23.", "warning");
          return;
        }
        let fullDate = dateStr + " " + convertToHours(hour);
        let location_name = document.getElementById('city-name');
        let found = false;
        for (let index = 0; index < 24; index++) {
          let dateANDtime = resp.forecast.forecastday[dayIndex].hour[index].time;
          if (dateANDtime === fullDate) {
            found = true;
            if (resp.location.region === "") {
              location_name.innerHTML = resp.location.name + " (" + resp.location.country + ")";
            } else {
              location_name.innerHTML = resp.location.name + ", " + resp.location.region + " (" + resp.location.country + ")";
            }
            document.getElementById('city-weather-txt').innerHTML = resp.forecast.forecastday[dayIndex].hour[index].condition.text;
            document.getElementById('city-weather').src = resp.forecast.forecastday[dayIndex].hour[index].condition.icon;
            document.getElementById('celsius').innerHTML = resp.forecast.forecastday[dayIndex].hour[index].temp_c + " °C";
            document.getElementById('fahrenheit').innerHTML = resp.forecast.forecastday[dayIndex].hour[index].temp_f + " °F";
            document.getElementById('cloud').innerHTML = resp.forecast.forecastday[dayIndex].hour[index].cloud;
            document.getElementById('uv').innerHTML = resp.forecast.forecastday[dayIndex].hour[index].uv;
            document.getElementById('humidity').innerHTML = resp.forecast.forecastday[dayIndex].hour[index].humidity;
            document.getElementById('kph').innerHTML = resp.forecast.forecastday[dayIndex].hour[index].wind_kph + " kph";
            document.getElementById('mph').innerHTML = resp.forecast.forecastday[dayIndex].hour[index].wind_mph + " mph";
            document.getElementById('in').innerHTML = resp.forecast.forecastday[dayIndex].hour[index].precip_in + " in";
            document.getElementById('mm').innerHTML = resp.forecast.forecastday[dayIndex].hour[index].precip_mm + " mm";
            if (window.map) {
              window.map.remove();
              window.map = null;
            }
            window.map = L.map('cityFrame').setView([resp.location.lat, resp.location.lon], 13);
            L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=egoOdaRfQOWYBdPp56xc', {
              maxZoom: 18,
              attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
              id: 'mapbox.streets'
            }).addTo(window.map);
            L.marker([resp.location.lat, resp.location.lon]).addTo(window.map);
            break;
          }
        }
        if (!found) {
          showAlert("No forecast data found for the selected hour.", "warning");
        }
      },
      error: (error) => {
        showAlert("Sorry! Location wasn't found. Please try again.", "danger");
        console.error(error);
      }
    });
  }

  function convertToHours(num) {
    var hours = Math.floor(num);
    var minutes = "00";
    if (hours < 10) {
      return "0" + hours + ":" + minutes;
    }
    return hours + ":" + minutes;
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
});