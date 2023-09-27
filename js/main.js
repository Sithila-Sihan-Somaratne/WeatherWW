let btnSearch = document.getElementById('search');
btnSearch.addEventListener("click", () =>{
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
})