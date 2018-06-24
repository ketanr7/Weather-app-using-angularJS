var demo = angular.module('myApp', ['ui.router']);

demo.service('SharedDataService', function() {
    return {
        Product: []
    };
});

demo.controller('AppCtrl', function($scope) {})

demo.controller('loginCtrl', function($scope) {})

demo.controller('homeCtrl', function($scope) {})

demo.controller('historyCtrl', function($scope, $rootScope, SharedDataService) {
    $('#userInfo').append(localStorage.getItem('firstName') + " " + localStorage.getItem('lastName'));
    $('#userEmail').append(localStorage.getItem('userEmail'));
    localStorage.setItem('items', JSON.stringify(SharedDataService.Product));
    $rootScope.data = JSON.parse(localStorage.getItem('items'));
    for (var a = 0; a < $rootScope.data.length; a++) {
        var table = document.getElementById("myTable");
        var row = table.insertRow(a);
        row.classList.add("tableRow");
        var info = [];
        info = $rootScope.data[a].split("-");
        var cell1 = row.insertCell(0);
        cell1.innerHTML = a + 1;
        for (var i = 0; i < info.length; i++) {
            var cell1 = row.insertCell(i + 1);
            cell1.innerHTML = info[i];
        }
    };
    $('.tableRow').click(function() {
        var cellValue = this.cells[1].innerHTML;
        var url = window.location.href;
        var link = url.slice(0, url.lastIndexOf("/"));
        window.location = link + "/weather/" + cellValue;
    });
})

demo.controller('signupCtrl', function($scope) {})

demo.controller('weatherSearchCtrl', function($scope, $rootScope, $stateParams, SharedDataService, $state) {
    var searchInfo = $stateParams.searchText;
    $('#userInfo').append(localStorage.getItem('firstName') + " " + localStorage.getItem('lastName'));
    $('#userEmail').append(localStorage.getItem('userEmail'));
    $rootScope.itemsArray = [];
    var units;
    var loc;
    $scope.daydata = $rootScope.data1;
    var appId = "9b66a9c4055d9d1f99e3bdcdd1dbfa69";
    var weatherApiUrlCity = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchInfo + "&APPID=" + appId;
    $.get(weatherApiUrlCity).then(function(weatherInfo) {
        var country = weatherInfo.sys.country;
        var imperialCountries = ['US', 'BS', 'BZ', 'KY', 'PW'];
        var units;
        if (imperialCountries.indexOf(country) === -1) {
            units = 'metric';
        } else {
            units = 'imperial';
        }
        var weatherApiUrlInfo = 'https://api.openweathermap.org/data/2.5/find?q=' + searchInfo + "&units=" + units + "&APPID=" + appId;
        $.get(weatherApiUrlInfo).then(function(weather) {
            //label based in imperial vs metric units
            var windDir;
            var temperature = weather.list[0].main.temp;
            var unitLabel;
            if (units === "imperial") {
                unitLabel = "F";
            } else {
                unitLabel = "C";
            }
            if (weather.list[0].weather[0].icon == "01d" || weather.list[0].weather[0].icon == "01n" || weather.list[0].weather[0].icon == "02d" || weather.list[0].weather[0].icon == "02n") {
                $('.main-container').css('background-image', 'url(' + 'http://2.bp.blogspot.com/-uynQBPsFgbk/VhE3YoJvnCI/AAAAAAAADEA/h1c6_Z0U3to/s1600/IMG_2551.jpg' + ')');
                $('.main-container').css('background-repeat', 'no-repeat');
                $('.main-container').css('background-attachment', 'fixed');
                $('.main-container').css('background-position', 'center');
            } else if (weather.list[0].weather[0].icon == "13d" || weather.list[0].weather[0].icon == "13n" || weather.list[0].weather[0].icon == "50d" || weather.list[0].weather[0].icon == "50n") {
                $('.main-container').css('background-image', 'url(' + 'https://thewallpaper.co/wp-content/uploads/2016/03/cold-snow-black-and-white-road-hd-grayscale-images-monochrome-wallpapers-single-color-wallpapers-amazing-color-view-desktop-wallpaper-samsung-background-images-1600x1017.jpg' + ')');
                $('.main-container').css('background-repeat', 'no-repeat');
                $('.main-container').css('background-attachment', 'fixed');
                $('.main-container').css('background-position', 'center');
            } else {
                $('.main-container').css('background-image', 'url(' + 'https://c.wallhere.com/photos/f3/f7/road_winter_light_snow_clouds_landscape_nikon_cloudy-860409.jpg!d' + ')');
                $('.main-container').css('background-repeat', 'no-repeat');
                $('.main-container').css('background-attachment', 'fixed');
                $('.main-container').css('background-position', 'center');
            }
            if (units === "imperial") {
                var tempe = parseFloat(temperature).toFixed();
                var tempData = (tempe - 32) / 1.8;
                tempData = parseFloat(tempData.toFixed());
                $('#icon')
                    .append("<img src='https://openweathermap.org/img/w/" + weather.list[0].weather[0].icon + ".png'>");
                $('#temp').append(tempData);
                $('#unit').append("C");
                $('#conditions').append(weather.list[0].weather[0].description);
                $('#wind').append(weather.list[0].wind.speed + " m/s");
                $('#humidity').append(weather.list[0].main.humidity + " %");
                $('#pressure').append(weather.list[0].main.pressure + " hPa");
                $('.location')
                    .append(weather.list[0].name + ", ")
                    .append(weather.list[0].sys.country);
                $("#celsius").css("color", "#ffffff");
                $("#fahrenheit").css("color", "#000000");
            } else {
                $('#icon')
                    .append("<img src='https://openweathermap.org/img/w/" + weather.list[0].weather[0].icon + ".png'>");
                var tempe = parseFloat(temperature).toFixed();
                $('#temp').append(tempe);
                $('#unit').append(unitLabel);
                $('#conditions').append(weather.list[0].weather[0].description);
                $('#wind').append(weather.list[0].wind.speed + " m/s");
                $('#humidity').append(weather.list[0].main.humidity + " %");
                $('#pressure').append(weather.list[0].main.pressure + " hPa");
                $('.location')
                    .append(weather.list[0].name + ", ")
                    .append(weather.list[0].sys.country);
                $("#fahrenheit").css("color", "#000000");
                $("#celsius").css("color", "#ffffff");
            }
        }, function(jqXHR) {
            alert('Error occurred: ' + jqXHR.statusText + ' ' + jqXHR.status);
        });
    }, function(jqXHR) {
        $('#searchErrorModal').modal('show');
        $('#searchErrorModal').on('hidden.bs.modal', function(e) {
            $state.go("dashboard");
        })

    });
    $scope.toCelsius = function() {
        var unitLabel = document.getElementById('unit').innerHTML;
        var temp = document.getElementById('temp').innerHTML;
        if (unitLabel == 'F') {
            var tempInC = (temp - 32) / 1.8;
            tempInC = parseFloat(tempInC.toFixed()); // returns 9.77
            $('#temp').empty();
            $('#temp').append(tempInC);
            $('#unit').empty();
            $('#unit').append("C");
            $('.convert').empty();
            $('.convert').append("Convert Temperature to Fahrenheit");
            $("#fahrenheit").css("color", "#000000");
            $("#celsius").css("color", "#ffffff");
        }
    };
    var date = new Date().toLocaleDateString(('en-GB'));
    var time = new Date().toLocaleTimeString();
    $('#date').append(date);
    $('#time').append(time);
    $scope.toFahrenheit = function() {
        var unitLabel = document.getElementById('unit').innerHTML;
        var temp = document.getElementById('temp').innerHTML;
        if (unitLabel == 'C') {
            var tempInF = (temp * (9 / 5)) + 32;
            tempInF = parseFloat(tempInF.toFixed()); // returns 9.77
            $('#temp').empty();
            $('#temp').append(tempInF);
            $('#unit').empty();
            $('#unit').append("F");
            $('.convert').empty();
            $('.convert').append("Convert Temperature to Celsius");
            $("#celsius").css("color", "#000000");
            $("#fahrenheit").css("color", "#ffffff");
        }
    };
})

demo.controller('weatherCtrl', function($scope, $rootScope, SharedDataService) {
    var units;
    var loc;
    $('#userInfo').append(localStorage.getItem('firstName') + " " + localStorage.getItem('lastName'));
    $('#userEmail').append(localStorage.getItem('userEmail'));
    $scope.daydata = $rootScope.data1;
    var appId = "9b66a9c4055d9d1f99e3bdcdd1dbfa69";
    $.get("https://ipinfo.io", function(location) {
        $scope.text = location.country;
        SharedDataService.Product.name = location.region;
        $('.location')
            .append(location.city + ", ")
            .append(location.region);
        var country = location.country;
        $rootScope.loc = location.loc;
        var imperialCountries = ['US', 'BS', 'BZ', 'KY', 'PW'];
        var units;
        if (imperialCountries.indexOf(country) === -1) {
            units = 'metric';
        } else {
            units = 'imperial';
        }
        lat = $rootScope.loc.split(",")[0];
        lon = $rootScope.loc.split(",")[1];
        var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + "&units=" + units + "&APPID=" + appId;
        $.get(weatherApiUrl, function(weather) {
            var windDir;
            var temperature = weather.main.temp;
            var unitLabel;
            if (units === "imperial") {
                unitLabel = "F";
            } else {
                unitLabel = "C";
            }
            if (weather.weather[0].icon == "01d" || weather.weather[0].icon == "01n" || weather.weather[0].icon == "02d" || weather.weather[0].icon == "02n") {
                $('.main-container').css('background-image', 'url(' + 'http://2.bp.blogspot.com/-uynQBPsFgbk/VhE3YoJvnCI/AAAAAAAADEA/h1c6_Z0U3to/s1600/IMG_2551.jpg' + ')');
                $('.main-container').css('background-repeat', 'no-repeat');
                $('.main-container').css('background-attachment', 'fixed');
                $('.main-container').css('background-position', 'center');
            } else if (weather.weather[0].icon == "13d" || weather.weather[0].icon == "13n" || weather.weather[0].icon == "50d" || weather.weather[0].icon == "50n") {
                $('.main-container').css('background-image', 'url(' + 'https://thewallpaper.co/wp-content/uploads/2016/03/cold-snow-black-and-white-road-hd-grayscale-images-monochrome-wallpapers-single-color-wallpapers-amazing-color-view-desktop-wallpaper-samsung-background-images-1600x1017.jpg' + ')');
                $('.main-container').css('background-repeat', 'no-repeat');
                $('.main-container').css('background-attachment', 'fixed');
                $('.main-container').css('background-position', 'center');
            } else {
                $('.main-container').css('background-image', 'url(' + 'https://c.wallhere.com/photos/f3/f7/road_winter_light_snow_clouds_landscape_nikon_cloudy-860409.jpg!d' + ')');
                $('.main-container').css('background-repeat', 'no-repeat');
                $('.main-container').css('background-attachment', 'fixed');
                $('.main-container').css('background-position', 'center');
            }
            if (units === "imperial") {
                var tempe = parseFloat(temperature).toFixed();
                var tempData = (tempe * (9 / 5)) + 32;
                tempData = parseFloat(tempData.toFixed());
                $('#icon')
                    .append("<img src='https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png'>");
                $('#temp').append(tempData);
                $('#unit').append("C");
                $('#conditions').append(weather.weather[0].description);
                $('#wind').append(weather.wind.speed + " m/s");
                $('#humidity').append(weather.main.humidity + " %");
                $('#pressure').append(weather.main.pressure + " hPa");
                $("#fahrenheit").css("color", "#000000");
                $("#celsius").css("color", "#ffffff");
            } else {
                var tempe = parseFloat(temperature).toFixed();
                $('#icon')
                    .append("<img src='https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png'>");
                $('#temp').append(tempe);
                $('#unit').append(unitLabel);
                $('#conditions').append(weather.weather[0].description);
                $('#wind').append(weather.wind.speed + " m/s");
                $('#humidity').append(weather.main.humidity + " %");
                $('#pressure').append(weather.main.pressure + " hPa");
                $("#fahrenheit").css("color", "#000000");
                $("#celsius").css("color", "#ffffff");
            }
        }, "jsonp");
    }, "jsonp");
    var date = new Date().toLocaleDateString(('en-GB'));
    var time = new Date().toLocaleTimeString();
    $('#date').append(date);
    $('#time').append(time);
    $scope.toCelsius = function() {
        var unitLabel = document.getElementById('unit').innerHTML;
        var temp = document.getElementById('temp').innerHTML;
        if (unitLabel == 'F') {
            var tempInC = (temp - 32) / 1.8;
            tempInC = parseFloat(tempInC.toFixed()); // returns 9.77
            $('#temp').empty();
            $('#temp').append(tempInC);
            $('#unit').empty();
            $('#unit').append("C");
            $('.convert').empty();
            $('.convert').append("Convert Temperature to Fahrenheit");
            $("#fahrenheit").css("color", "#000000");
            $("#celsius").css("color", "#ffffff");
        }
    };
    $scope.toFahrenheit = function() {
        var unitLabel = document.getElementById('unit').innerHTML;
        var temp = document.getElementById('temp').innerHTML;
        if (unitLabel == 'C') {
            var tempInF = (temp * (9 / 5)) + 32;
            tempInF = parseFloat(tempInF.toFixed()); // returns 9.77
            $('#temp').empty();
            $('#temp').append(tempInF);
            $('#unit').empty();
            $('#unit').append("F");
            $('.convert').empty();
            $('.convert').append("Convert Temperature to Celsius");
            $("#celsius").css("color", "#000000");
            $("#fahrenheit").css("color", "#ffffff");
        }
    };
})

demo.controller('dashboardCtrl', function($scope, $location, $http, $rootScope, SharedDataService) {
    $scope.test3 = "test3";
    $('#userInfo').append(localStorage.getItem('firstName') + " " + localStorage.getItem('lastName'));
    $('#userEmail').append(localStorage.getItem('userEmail'));
    $scope.searchdata = function(info) {
        alert("info" + info);
    }
    $rootScope.city;
    $('#searchBtn').click(function() {
        $rootScope.city = document.getElementById('recipient-name').value;
        if ($rootScope.city.length !== 0 && $rootScope.city !== null && $rootScope.city !== " ") {
            SharedDataService.Product.push($rootScope.city + '-' + new Date().toLocaleDateString(('en-GB')) + '-' + new Date().toLocaleTimeString());
        } else {
            document.getElementById("searchError").style.display = "block";
        }
    })
})

demo.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.hashPrefix();
        //        
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise('/home');
        //
        // Now set up the states
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/homepage.html',
                controller: 'homeCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'loginCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'views/signup.html',
                controller: 'signupCtrl'
            })
            .state('weather', {
                url: '/weather',
                templateUrl: 'views/dashboard.html',
                controller: 'weatherCtrl'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'views/userlanding.html',
                controller: 'dashboardCtrl'
            })
            .state('weatherSearch', {
                url: '/weather/:searchText',
                templateUrl: 'views/dashboardSearch.html',
                controller: 'weatherSearchCtrl'
            })
            .state('history', {
                url: '/history',
                templateUrl: 'views/history.html',
                controller: 'historyCtrl'
            })
    }
]);