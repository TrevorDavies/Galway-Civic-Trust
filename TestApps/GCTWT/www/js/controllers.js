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

//=============================================

.controller('LocationsCtrl',['$scope', '$http', '$state', function($scope, $http, $state) {
 $scope.tourId=$state.params.aId;
   
 $scope.url = 'http://gct.es.vc:9000/api/tour/'+$scope.tourId +'/1';
  //  console.log($scope.url);
   // console.log($scope.tourId);
    $scope.locationData = [];
    $http.get($scope.url).then(function(resp){
    
    $scope.locationData = resp.data;
        //console.log($scope.tourData);
    });//end of http
    
    
   
}])//end LocationsCtrl

//===========================================

.controller('ToursCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
        
    $http.get('http://gct.es.vc:9000/api/tour/getAllPublishedTours').success(function(data) {
      $scope.places = data;
      
      
      $scope.whichplace=$state.params.aId;
      


    });
}]);



