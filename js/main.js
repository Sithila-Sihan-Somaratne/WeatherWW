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
    }else if(forecast < 1 || forecast > 10){
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
        document.getElementById('cityFrame').src = "https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik";
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
        document.getElementById('cityFrame').src = "https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik";
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