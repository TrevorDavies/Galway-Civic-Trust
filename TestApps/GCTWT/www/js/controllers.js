angular.module('GCTWT.controllers', ['ionic', 'ngStorage'])

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

/*
.controller('ToursCtrl', function($scope,$state,$http,$ionicLoading,$localStorage) {
  $scope.tourData = []
// http://gct.es.vc:9000/api/tour/getAllPublishedTours
  $http.get('http://galwaytour.tk/api/tour/getAllPublishedTours').then(function(resp){
    for(var i=0;i<resp.data.length;i++){
      var tour = {
        "tourID": resp.data[i]._id,
        "description": resp.data[i].description,
        "title": resp.data[i].title,
        "image": resp.data[i].image
      };
        $scope.tourData.push(tour);
    }
        console.log($scope.tourData);

  });

  $scope.tourToDownload = []

  $scope.loadMyTour = function(){
    $scope.theTourOfMine = $localStorage.mytour;
  }

  $scope.deleteMyTour = function(){
    $localStorage.mytour = [];
    $scope.theTourOfMine = $localStorage.mytour;
  }

  $scope.downloadTour = function(tourIDNum){
    var id = tourIDNum.tourID;
    console.log(id);
    $http.get('http://gct.es.vc/api/tour/'+id+'/1').then(function(resp){
      for(var i=0;i<resp.data.length;i++){
        $scope.download(resp.data[i].image);
        var tours = {
          "location": resp.data[i].location,
          "description": resp.data[i].description,
          "title": resp.data[i].title,
          "image": resp.data[i].image,
          "xcordinate": resp.data[i].xCoordinate,
          "ycordinate": resp.data[i].yCoordinate,
          "imageFile": $scope.downloadedImage
        };
          $scope.tourToDownload.push(tours);
      }
          console.log($scope.tourToDownload);
          $localStorage.mytour = $scope.tourToDownload;
          console.log('Tour Saved.');
    });
  }

  $scope.downloadedImage;

  $scope.download = function(url) {
    var imgUrl = 'http://gct.es.vc:9000'+url;
    var fileName = imgUrl.split("/").pop();
    $ionicLoading.show({
      template: 'Loading...'
    });
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        fs.root.getDirectory(
            "TourImages",
            {
                create: true
            },
            function(dirEntry) {
                dirEntry.getFile(
                    fileName,
                    {
                        create: true,
                        exclusive: false
                    },
                    function gotFileEntry(fe) {
                        var p = fe.toURL();
                        fe.remove();
                        ft = new FileTransfer();
                        ft.download(
                            encodeURI(imgUrl),
                            p,
                            function(entry) {
                                $ionicLoading.hide();
                                $scope.downloadedImage = entry.toURL();
                            },
                            function(error) {
                                $ionicLoading.hide();
                                alert("Download Error Source -> " + error.source);
                            },
                            false,
                            null
                        );
                    },
                    function() {
                        $ionicLoading.hide();
                        console.log("Get file failed");
                    }
                );
            }
        );
    },
    function() {
        $ionicLoading.hide();
        console.log("Request for filesystem failed");
    });
  }


})//end TourCtrl

*/




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

.controller('LocationsCtrl',['$scope', '$http', '$state', function($scope, $http, $state) {
 $scope.tourId=$state.params.aId;
 console.log($scope.tourId);

 $scope.url = 'http://galwaytour.tk/api/tour/pullAllLocations/'+$scope.tourId;

    $scope.locationData = [];
    $http.get($scope.url).then(function(resp){

    $scope.locationData = resp.data;
  //  console.log($scope.tourId);
  //  console.log($scope.locationData);
  //  console.log($scope.url);
    });//end of http

}])//end LocationsCtrl

//===========================================
.controller('DetailsCtrl',['$scope', '$http', '$state', function($scope, $http, $state) {
 $scope.tourId=$state.params.aId;

 $scope.url = 'http://galwaytour.tk/api/tour/'+ $scope.tourId;

    $scope.location = [];
    $http.get($scope.url).then(function(resp){

    $scope.location = resp.data;
  //  console.log($scope.tourId);
  //  console.log($scope.location);
  //  console.log($scope.url);

    });//end of http

}])//end LocationsCtrl

//===========================================

.controller('ToursCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {

    $http.get('http://galwaytour.tk/api/tour/getAllPublishedTours').success(function(data) {
      $scope.places = data;

      $scope.whichplace=$state.params.aId;

    });
}]);
