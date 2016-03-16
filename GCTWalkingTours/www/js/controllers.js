angular.module('starter.controllers', ['ionic'])

.constant('WEATHERAPI_KEY','f40acdcb5aabf0faf07699d42ffc88c2' )
.controller('HomeCtrl', function($scope,$state,$http,WEATHERAPI_KEY) {

  $scope.weatherData=[];

  $http.get('http://api.openweathermap.org/data/2.5/weather?id=2964179&units=metric&appid='+WEATHERAPI_KEY).then(function(response){
    weatherData=response;
    $scope.temp = Math.round(weatherData.data.main.temp);
    $scope.current = weatherData.data.weather[0].description;

    console.log(weatherData);
  }, function(error){

  });

})//end HomeCtrl

.controller('TourCtrl', function($scope) {})//end TourCtrl
.controller('MapCtrl', function($scope) {})//end MapCtrl
.controller('SettingsCtrl', function($scope) {})//end SettingsCtrl
