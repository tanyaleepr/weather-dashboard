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
  //Define weatherForcast query to get weather forcast
  function weatherForcast(cityValue) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityValue +
      "&units=" +
      units +
      "&appid=" +
      apikey;

    //Define Ajax call
    $.ajax({
      url: queryURL,
      type: "GET",
      dataType: "json",
    }).then(function (response) {
      // create history link for this search
      if (history.indexOf(cityValue) === -1) {
        history.push(cityValue);
        window.localStorage.setItem("history", JSON.stringify(history));

        //Create History Row on Screen
        createRow(cityValue);
      }

      // cRemove content from the id=today element
      $("#today").empty();

      // create html content for current weather
      var title = $("<h3>")
        .addClass("card-title")
        .text(response.name + " (" + new Date().toLocaleDateString() + ")");
      var card = $("<div>").addClass("card");
      var wind = $("<p>")
        .addClass("card-text")
        .text("Wind Speed: " + response.wind.speed + " MPH");
      var humid = $("<p>")
        .addClass("card-text")
        .text("Humidity: " + response.main.humidity + "%");
      var temp = $("<p>")
        .addClass("card-text")
        .text("Temperature: " + response.main.temp + " °F");
      var cardBody = $("<div>").addClass("card-body");
      var img = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
      );

      // merge and add to page
      title.append(img);
      cardBody.append(title, temp, humid, wind);
      card.append(cardBody);
      $("#today").append(card);

      // call other api endpoints
      getForecast(cityValue);
      getUVIndex(response.coord.lat, response.coord.lon);
    });
  }
