const headerEl = document.querySelector(".header");
//Searching City's Weather Details
let wrongOption = "Please select an option:";
let btnSearch = document.getElementById('search');
btnSearch.addEventListener("click", () =>{
    let input = document.getElementById('input-location').value;
    let option = document.getElementById('select-option').value;
    let forecast = document.getElementById('input-forecast').value;
    if(input === ""){
        return alert("Textfields cannot be empty! Please enter a city");
    }else if(option === ""){
        return alert("Invalid option \""+wrongOption+"\"")
    }else if (option != "forecast" && forecast != "" || option === "forecast" && forecast === "") {
            return alert("You didn't chose \"Forecast\" before or input is empty. Please switch to \"Forecast\" or clear the last input or input number of days for forecast.")
    }else if(option === "forecast" && forecast != ""){
            if(forecast < 1){
                return alert("The number of days of forecast cannot be less than 1")
            }else if(forecast > 10){
                return alert("The number of days of forecast cannot be grater than 10")
            }
    }else{
        //The below will be later be changed, after WeatherWW API integration
       if(option === "current"){
        document.getElementById('celsius').innerHTML = "30.0 °C";
        document.getElementById('fahrenheit').innerHTML = "86.0 °C";
        document.getElementById('humidity').innerHTML = "75";
        document.getElementById('uv').innerHTML = "1.0";
        document.getElementById('mph').innerHTML = "8.1 mph";
        document.getElementById('kph').innerHTML = "13.0 kph";
        document.getElementById('cloud').innerHTML = "50";
        document.getElementById('mm').innerHTML = "0.0mm";    
        document.getElementById('in').innerHTML = "0.0in";    
        document.getElementById('cityFrame').src = "https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik";
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
        document.getElementById('celsius').innerHTML = "30.0 °C";
        document.getElementById('fahrenheit').innerHTML = "86.0 °C";
        document.getElementById('humidity').innerHTML = "75";
        document.getElementById('uv').innerHTML = "1.0";
        document.getElementById('mph').innerHTML = "8.1 mph";
        document.getElementById('kph').innerHTML = "13.0 kph";
        document.getElementById('cloud').innerHTML = "50";
        document.getElementById('mm').innerHTML = "0.0mm";    
        document.getElementById('in').innerHTML = "0.0in";    
        document.getElementById('cityFrame').src = "https://www.google.com/maps/place/Panadura,+Sri+Lanka/@6.7234035,79.9232524,14z/data=!4m6!3m5!1s0x3ae24616c169e7c3:0xd21e80c970651d56!8m2!3d6.7106361!4d79.9074262!16s%2Fm%2F02vrtzb?hl=it&entry=ttu";
       }
    }
});
let btnSubmit = document.getElementById('submit');
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
///////////////////////////////////////////////////////////
// Make mobile navigation work

const btnMobile = document.querySelector('.btn-mobile-nav').addEventListener("click", () =>{
    let image = document.getElementById('mobile-nav');
    if(image.src === "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAL0lEQVR4nO3BQREAMBADofVvOpXQ/w1QAEDtiHZEAADwtSPaEQEAwNeOaEcEANQDM6arjUtOdLsAAAAASUVORK5CYII="){
        image.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBUlEQVR4nO3ZTQqDMBCGYU/RSq9Yj1uwPc1bRBcirWicv4T5Vm6UeVCTGdJ1mUwm00yAJ9AHqKOfaim9eWDO6IlhRkw1TBlKHnADXssDPsBDpdL9Gu6rGt7FNXhikEJ4YpBGeGDQQlhi0EZYYMwQmhhzhAbGDSGJcUdIYMIgrmDCIUowYRFnMOERRzDVIPYw1SH+zBDj5tp9ULvyZup6E+tsPiezEUA0TXxa/PixI4zNp7K3OlWD4cASGx7DiX0iLIaCzS4chgs7dhgMAm2HOwbB3skNg0IDaI5BsYs1w2DQiqONsZwn0MJ4DEVIYzwnO6QwEcZTJDDNHL01cxiayWQyXcR8AfkY5euVO0c7AAAAAElFTkSuQmCC"
        headerEl.classList.toggle("nav-open");
    }else{
        image.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAL0lEQVR4nO3BQREAMBADofVvOpXQ/w1QAEDtiHZEAADwtSPaEQEAwNeOaEcEANQDM6arjUtOdLsAAAAASUVORK5CYII="
    }
    console.log(document);
});

///////////////////////////////////////////////////////////
// Smooth scrolling animation

const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
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

const obs = new IntersectionObserver(
  function (entries) {
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