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
//Define getForcast query to get 5 day forcast
function getForecast(cityValue) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
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
      // Replace any existing content with title and empty row
      $("#forecast")
        .html('<h4 class="mt-3">5-Day Forecast:</h4>')
        .append('<div class="row">');

      // loop over all forecasts
      for (var i = 0; i < response.list.length; i++) {
        // only look at forecasts around 3:00pm
        if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
          // create html elements for a bootstrap card
          var col = $("<div>").addClass("col-md-2");
          var card = $("<div>").addClass("card bg-primary text-white");
          var body = $("<div>").addClass("card-body p-2");

          //Added in a fix to date format for Safari browsers since the return date format is not supported
          //Needed to replace the dash "-" with the forward "/" slash
          tempDate = new Date(
            response.list[i].dt_txt.replace(/-/g, "/")
          ).toLocaleDateString();

          var title = $("<h5>").addClass("card-title").text(tempDate);

          var img = $("<img>").attr(
            "src",
            "https://openweathermap.org/img/w/" +
              response.list[i].weather[0].icon +
              ".png"
          );

          var p1 = $("<p>")
            .addClass("card-text")
            .text("Temp: " + response.list[i].main.temp_max + " °F");
          var p2 = $("<p>")
            .addClass("card-text")
            .text("Humidity: " + response.list[i].main.humidity + "%");

          // merge together and put on page
          col.append(card.append(body.append(title, img, p1, p2)));
          $("#forecast .row").append(col);
        }
      }
    });
  }

  //Define getUVIndex query to get UV Index for a particular city by latitude and longitude
  function getUVIndex(latitude, longitude) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/uvi?appid=" +
      apikey +
      "&lat=" +
      latitude +
      "&lon=" +
      longitude;

    //Define Ajax call
    $.ajax({
      url: queryURL,
      type: "GET",
      dataType: "json",
    }).then(function (response) {
      var uv = $("<p>").text("UV Index: ");
      var btn = $("<span>").addClass("btn btn-sm").text(response.value);

      // change color depending on uv value
      if (response.value < 3) {
        btn.addClass("btn-success");
      } else if (response.value < 7) {
        btn.addClass("btn-warning");
      } else {
        btn.addClass("btn-danger");
      }

      $("#today .card-body").append(uv.append(btn));
    });
  }

  // get current history, if any
  var history = JSON.parse(window.localStorage.getItem("history")) || [];

  //Grab the latest history value and use that to populate the weather items
  if (history.length > 0) {
    weatherForcast(history[history.length - 1]);
  }

  //Populate the history items from local storage items
  for (var i = 0; i < history.length; i++) {
    createRow(history[i]);
  }
});