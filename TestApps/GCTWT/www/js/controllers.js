angular.module('GCTWT.controllers', ['ionic'])

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

.controller('ToursCtrl', function($scope,$state,$http) {
  $scope.tourData = []
// http://gct.es.vc:9000/api/tour/getAllPublishedTours
  $http.get('http://gct.es.vc:9000/api/tour/getAllTours').then(function(resp){
    for(var i=0;i<resp.data.length;i++){
      var tour = {
        "description": resp.data[i].description,
        "title": resp.data[i].title,
        "image": resp.data[i].image
      };
        $scope.tourData.push(tour);
    }
        console.log($scope.tourData);
  });
})//end TourCtrl
.controller('MapCtrl', function($scope,$state,$cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

  var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      position: latLng
  });

});

  }, function(error){
    console.log("Could not get location");
  });
})//end MapCtrl
.controller('SettingsCtrl', function($scope) {})//end SettingsCtrl
