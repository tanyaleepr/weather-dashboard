$(document).ready(function () {
    //Global Variables Defined
    var apikey = "a1127dc4ba5ff83b7283d877dfb9a775"; //API Key for using weather App
    var units = "imperial"; //Set the units to come back as Farenheit
  //Set JQuery Event Handler for click event on Search Button
  $("#searchBtn").on("click", function () {
    // Get the value from the id=search input field
    var cityValue = $("#search").val();

    // Clear input box
    $("#search").val("");

    //Call weatherForcast function using the search value
    weatherForcast(cityValue);
  });
 // Set JQuery Event Handler for any list item in history and then call the weatherForcast function
 $("#history-list").on("click", "li", function () {
    var historyValue = $(this).text(); //Grab the value of the history item
    weatherForcast(historyValue); //call the seatherForcast function with the histroy Value
  });
  // Define function to create row for history with previous cities and append to id=history-list element
  function createRow(city) {
    var historyListItem = $("#history-list");
    var li = $("<li>")
      .addClass("list-group-item list-group-item-action")
      .text(city);
    historyListItem.prepend(li);
  }