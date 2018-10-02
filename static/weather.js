var config = {
                'api_key': 'https://openweathermap.org/appid#apply-for-an-api-key',
                'api_key_apod': 'https://api.nasa.gov/index.html#apply-for-an-api-key',
                'city': city,
                'lang': lang
}

var url_base = 'http:\/\/api.openweathermap.org/data/2.5/'
var url_weather = 'weather?q='
var url_forecast = 'forecast?q='
var url_img_base = 'http:\/\/localhost:5000/static/icons/'

Number.prototype.round = function(places) {
    return +(Math.round(this + 'e+' + places) + 'e-' + places);
}

// Prints current time and date in this format: HH:MM - dd.mm.yyyy
Date.prototype.nowPrint = function() {
    var month = this.getMonth() + 1;
    var day = this.getDate();
    var hours = this.getHours();
    var minutes = this.getMinutes();

    return [
                [(hours > 9 ? '' : '0') + hours,
                 (minutes > 9 ? '' : '0') + minutes].join(':'),
                [(day > 9 ? '' : '0') + day,
                 (month > 9 ? '' : '0') + month,
                 this.getFullYear()
                ].join('.')
           ].join(' - ');
}

function getAsync(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200)
            callback(xhr.responseText);
    }
    xhr.open('GET', url, true); // true -> async
    xhr.send(null);
}

function KtoC(temp, places) {
    return (temp - 273.15).round(places)
}

function setCity() {
    config.city = document.getElementById('name').value
    updateWeather();
    updateForecast();
    return false;
}

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function updateDate() {
    var date = new Date();
    document.getElementById('date').innerHTML = date.nowPrint();
}

function updateWeather() {
    getAsync(url_base + url_weather + config.city + '&lang=' + config.lang + '&APPID=' + config.api_key, function(result) {
        var data = JSON.parse(result);

        document.getElementById('temperature').innerHTML = KtoC(data.main.temp, 1) + '°C';
        document.getElementById('description').innerHTML = data.weather[0].description;
        document.getElementById('weather-icon').src = url_img_base + data.weather[0].icon + '.svg';
    });
}

function updateForecast() {
    getAsync(url_base + url_forecast + config.city + '&lang=' + config.lang + '&APPID=' + config.api_key, function(result) {
        var data = JSON.parse(result);

        var temp = data.list[0].main.temp;
        var date = new Date(data.list[0].dt_txt);
        var icon = data.list[1].weather[0].icon;

        var i = 1;
        var data_date = new Date(data.list[i].dt_txt);
        while (data_date.getFullYear() === date.getFullYear() &&
               data_date.getMonth() === date.getMonth() &&
               data_date.getDate() === date.getDate()) {
            temp += data.list[i].main.temp;
            icon = data.list[i].weather[0].icon;
            data_date = new Date(data.list[++i].dt_txt);
        }
        temp += data.list[i].main.temp;
        temp /= i + 1;

        document.getElementById('temperature-forecast').innerHTML = KtoC(temp, 1) + '°C';
        document.getElementById('description-forecast').innerHTML = data.list[1].weather[0].description;
        document.getElementById('forecast-icon').src = url_img_base + icon + '.svg';

        weekdays = [];
        weekdays[0] = 'Sonntag';
        weekdays[1] = 'Montag';
        weekdays[2] = 'Dienstag';
        weekdays[3] = 'Mittwoch';
        weekdays[4] = 'Donnerstag';
        weekdays[5] = 'Freitag';
        weekdays[6] = 'Samstag';

        var j;
        for (j = 0; j < 4; j++) {
            date = new Date(data.list[i].dt_txt)
            document.getElementById('forecast-day-' + j + '-label').innerHTML = weekdays[date.getDay()];
            temp = (data.list[i+1].main.temp + data.list[i+2].main.temp + data.list[i+3].main.temp) / 3;
            i += 3;
            document.getElementById('forecast-day-' + j + '-temperature-morning').innerHTML = KtoC(temp, 0) + '°C';
            temp = (data.list[i+1].main.temp + data.list[i+2].main.temp + data.list[i+3].main.temp) / 3;
            i += 3;
            var icon = data.list[i-1].weather[0].icon;
            var description = data.list[i-1].weather[0].description;
            document.getElementById('forecast-day-' + j + '-temperature-day').innerHTML = KtoC(temp, 0) + '°C';
            if (data.list.length-1 > i) {
              temp = (data.list[i+1].main.temp + data.list[i+2].main.temp) / 2;
            }
            else {
              temp = data.list[i+1].main.temp;
            }
            i += 2;
            document.getElementById('forecast-day-' + j + '-temperature-night').innerHTML = KtoC(temp, 0) + '°C';
            document.getElementById('forecast-day-' + j + '-icon').src = url_img_base + icon + '.svg';
            document.getElementById('forecast-day-' + j + '-description').innerHTML = description;
        }
    });
}

function updateBackground() {
    var date = new Date();
    date.setDate(date.getDate() - (Math.random() * 8344));
    var date_string = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    getAsync('https:\/\/api.nasa.gov/planetary/apod?date=' + date_string + '&hd=True&api_key=' + config.api_key_apod, function(result) {
        var data = JSON.parse(result);
        var image_url = (data.hdurl == null) ? data.url : data.hdurl;
        document.getElementById('main').style.backgroundImage = 'url(\'' + image_url  + '\')';
        document.getElementById('wallpaper-description').innerHTML = data.title + ' - ' + data.explanation;
    });
}

ready(function() {
    updateWeather();
    updateForecast();
    updateBackground();

    setInterval(function() {updateDate()}, 60000)
    setInterval(function() {updateWeather()}, 60000)
    setInterval(function() {updateForecast()}, 600000);
    setInterval(function() {updateBackground()}, 300000)
})
