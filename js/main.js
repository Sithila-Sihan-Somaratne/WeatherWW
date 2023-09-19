function findBtnOnClicked(){
    const searchField = $("#searchField");
    console.log(searchField.val());
 
    //Storing typed text to the variable
    var typedText = searchField.val();
 
    const cityName = $("#cityName");
    cityName.text(typedText)
 
 }