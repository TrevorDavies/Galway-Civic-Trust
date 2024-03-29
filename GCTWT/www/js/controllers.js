
angular.module('GCTWT.controllers', ['ionic','ngCordova','ngStorage'])


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


.service('DataService', function () {
    var tourData = [];
    var tourLocationNum;

    return {
        setData: function (data) {
            tourData = data;
        },
        getData: function () {
            return tourData;
        },
        resetLocation: function(num) {
          tourLocationNum = 0
        },
        nextLocation: function() {
          tourLocationNum += 1;
        },
        prevLocation: function() {
          tourLocationNum -= 1;
        },
        getLocation: function() {
          return tourLocationNum;
        }
     }
})

.controller('LocationsCtrl',['$scope', '$http', '$state', '$localStorage', '$cordovaFile','$cordovaFileTransfer', 'DataService', function($scope, $http, $state, $localStorage, $cordovaFile, $cordovaFileTransfer, DataService) {


 $scope.tourId=$state.params.aId;
 console.log($scope.tourId);

 $scope.url = 'http://galwaytour.tk/api/tour/pullAllLocations/'+$scope.tourId;

    $scope.locationData = [];
    $http.get($scope.url).then(function(resp){

    $scope.locationData = resp.data;
    DataService.setData($scope.locationData);
  //  console.log($scope.tourId);
  //  console.log($scope.locationData);
  //  console.log($scope.url);
    });//end of http

    //we already have the data so save it to local storage for offline use when requested
    $scope.downloadTour = function(tourData) {

      var mapURL = 'https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyCBYil1DfXoRTgEcqB0-wL99XVTKqEkVio&size=300x300&format=JPEG&maptype=roadmap&path=color:0x0000ff80|weight:1';
      var markers = '&markers=';

      //Error handling, making sure dir is there before removing it, if its there create it
      $cordovaFile.checkDir(cordova.file.externalRootDirectory, 'tourResources').then(function (success) {
          $cordovaFile.removeRecursively(cordova.file.externalRootDirectory, 'tourResources').then(function (success) {
            console.log('Folder removed, creating new one');
            for(var i = 0; i < tourData.length; i++) {

              mapURL += '|' + tourData[i].xCoordinate + ',' + tourData[i].yCoordinate;
              markers += i == 0 ? 'color:green|label:S|' + tourData[i].xCoordinate + ',' + tourData[i].yCoordinate : '&markers=size:mid|color:red|label:'+(i+1)+'|' + tourData[i].xCoordinate + ',' + tourData[i].yCoordinate;

              var localimage = $scope.FileDownload(tourData[i].image);
              tourData[i]['localimage'] = localimage;
            }

            mapURL += markers;
            console.log(mapURL);
            $localStorage.staticMapPath = $scope.MapDownload(mapURL);
            $localStorage.mySavedTour = tourData;

          }, function (error) {
            console.log(error);
          });
      }, function (error) {
        console.log('directory folder not there')
        for(var i = 0; i < tourData.length; i++) {

          mapURL += '|' + tourData[i].xCoordinate + ',' + tourData[i].yCoordinate;
          markers += i == 0 ? 'color:green|label:S|' + tourData[i].xCoordinate + ',' + tourData[i].yCoordinate : '&markers=size:mid|color:red|label:'+(i+1)+'|' + tourData[i].xCoordinate + ',' + tourData[i].yCoordinate;

          var localimage = $scope.FileDownload(tourData[i].image);
          tourData[i]['localimage'] = localimage;
        }

        mapURL += markers;
        console.log(mapURL);
        $localStorage.staticMapPath = $scope.MapDownload(mapURL);
        $localStorage.mySavedTour = tourData;
      });
    }

    $scope.MapDownload = function (url) {

      var filename = 'staticMap' + '?' + new Date().getTime() + '.jpg';
      var targetPath = cordova.file.externalRootDirectory + 'tourResources/' + filename;

      $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
          console.log('Success Download Map');
      }, function (error) {
          console.log('Error');
      }, function (progress) {
          // PROGRESS HANDLING GOES HERE
      });
      return targetPath;
    }

    $scope.FileDownload = function (imageUrl) {
      var url = "http://galwaytour.tk/" + imageUrl;
      var filename = url.split("/").pop();
      var targetPath = cordova.file.externalRootDirectory + 'tourResources/' + filename;

      $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
          console.log('Success Download Images');
      }, function (error) {
          console.log('Error');
      }, function (progress) {
          // PROGRESS HANDLING GOES HERE
      });
      return targetPath;
    }
}])//end LocationsCtrl

.controller('SavedTourCtrl',['$scope', '$localStorage', '$state', '$ionicHistory', function($scope, $localStorage, $state, $ionicHistory) {
  $scope.$on('$ionicView.enter', function() {
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
     // Code you want executed every time view is opened
     if($localStorage.mySavedTour != "") {
         $scope.savedTourData = $localStorage.mySavedTour;
         $scope.staticMapPath = $localStorage.staticMapPath;
        //  if(!$localStorage.tourMap) {
        //    console.log('im here');
        //    var latLng = new google.maps.LatLng($scope.savedTourData[0].xCoordinate,$scope.savedTourData[0].yCoordinate);
         //
        //    var mapOptions = {
        //      disableDefaultUI: true,
        //      draggable: false,
        //      center: latLng,
        //      zoom: 15,
        //      mapTypeId: google.maps.MapTypeId.ROADMAP
        //    };
         //
        //    var tourCoordinates = [];
         //
        //    for(var i = 0; i < $scope.savedTourData.length; i++) {
        //      tourCoordinates.push(new google.maps.LatLng($scope.savedTourData[i].xCoordinate,$scope.savedTourData[i].yCoordinate));
        //    }
         //
        //    console.log(tourCoordinates);
         //
        //    $localStorage.tourMap = [];
        //    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        //    console.log('map initialized');
        //    $localStorage.tourMap = $scope.map;
        //    console.log('map local done' + $scope.map);
        //    console.log($localStorage.tourMap);
         //
        //    google.maps.event.addListenerOnce($localStorage.tourMap, 'idle', function(){
        //      console.log('before path')
        //      var tourPath = new google.maps.Polyline({
        //         path: tourCoordinates,
        //         geodesic: true,
        //         strokeColor: '#FF0000',
        //         strokeOpacity: 1.0,
        //         strokeWeight: 2
        //       });
        //       console.log('after path')
        //       tourPath.setMap($localStorage.tourMap);
        //       console.log('after tour')
        //    });
        // }
     } else {
         $scope.savedTourData = {'title':'No tours saved localy'}
     }
  })

}])


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

    $scope.doRefresh = function() {
      $http.get('http://galwaytour.tk/api/tour/getAllPublishedTours').success(function(data) {
        $scope.places = data;
        console.log('Refreshing ..');
        $scope.whichplace=$state.params.aId;
        $scope.$broadcast('scroll.refreshComplete');
        console.log('Refresh done.');
      });
    }
}])

.controller('TakeTourCtrl', ['$scope', '$http', '$state','$cordovaGeolocation', 'DataService', '$ionicHistory', function($scope, $http, $state,$cordovaGeolocation, DataService, $ionicHistory) {
$scope.$on('$ionicView.enter', function() {
  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();

    $scope.goHome = function() {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $state.go('home');
    };

   $scope.locationDataToTake = DataService.getData();
   DataService.resetLocation();
   $scope.currLocation = DataService.getLocation();
   $scope.currLocationData = $scope.locationDataToTake[$scope.currLocation];
   DataService.nextLocation();
   $scope.nextLocation = DataService.getLocation();
   $scope.nextLocationData = $scope.locationDataToTake[$scope.nextLocation];
   var options = {timeout: 30000, enableHighAccuracy: true};

   var distanceUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric';


   $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var latLng = new google.maps.LatLng($scope.locationDataToTake[$scope.currLocation].xCoordinate,$scope.locationDataToTake[$scope.currLocation].yCoordinate);

      var mapOptions = {
        disableDefaultUI: true,
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        draggable: false,
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var tourCoordinates = [];
      var marker;

      for(var i = $scope.currLocation; i <= $scope.nextLocation; i++) {
        // marker = new google.maps.Marker({
        // position: new google.maps.LatLng($scope.locationDataToTake[i].xCoordinate,$scope.locationDataToTake[i].yCoordinate),
        // map: $scope.tourMap
        // });
        tourCoordinates.push(new google.maps.LatLng($scope.locationDataToTake[i].xCoordinate,$scope.locationDataToTake[i].yCoordinate));
      }

      console.log(tourCoordinates);

      $scope.tourMap = new google.maps.Map(document.getElementById("map"), mapOptions);
      console.log('map initialized');

      google.maps.event.addListenerOnce($scope.tourMap, 'idle', function(){
        console.log('before path')
        console.log(tourCoordinates);
        var tourPath = new google.maps.Polyline({
           path: tourCoordinates,
           geodesic: true,
           strokeColor: '#FF0000',
           strokeOpacity: 1.0,
           strokeWeight: 2
          });
          //&origins=40.6655101,-73.89188969999998&destinations=40.6905615%2C-73.9976592
          for(var i = $scope.currLocation; i <= $scope.nextLocation; i++) {
            if(i < $scope.nextLocation)
            {
              distanceUrl += '&origins=' + $scope.locationDataToTake[i].xCoordinate + ',' + $scope.locationDataToTake[i].yCoordinate;
              marker = new google.maps.Marker({
              position: new google.maps.LatLng($scope.locationDataToTake[i].xCoordinate,$scope.locationDataToTake[i].yCoordinate),
              label: (i+1).toString()
              })
              marker.setMap($scope.tourMap);
            }
            else {
              distanceUrl += '&destinations=' + $scope.locationDataToTake[i].xCoordinate + ',' + $scope.locationDataToTake[i].yCoordinate + '&mode=walking&key=AIzaSyCBYil1DfXoRTgEcqB0-wL99XVTKqEkVio';
              marker = new google.maps.Marker({
              position: new google.maps.LatLng($scope.locationDataToTake[i].xCoordinate,$scope.locationDataToTake[i].yCoordinate),
              label: (i+1).toString()
              })
              marker.setMap($scope.tourMap);
            }
          }

          $http.get(distanceUrl).success(function(distanceData) {
            console.log(distanceUrl);
            $scope.distanceDataReceived = distanceData;
            $scope.TimeTravel = distanceData.rows[0].elements[0].distance.text;
            $scope.TimeTravel2 = distanceData.rows[0].elements[0].duration.text;
            console.log($scope.distanceDataReceived);
            console.log($scope.TimeTravel);
            console.log($scope.TimeTravel2);
          });

         console.log('after path')
         tourPath.setMap($scope.tourMap);
         //marker.setMap($scope.tourMap);
         console.log('after tour')
      })
    });

    $scope.NextLocation = function () {
      var distanceUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric';
      var tourCoordinates = [];
      console.log($scope.locationDataToTake.length);
      console.log($scope.currLocation);
      if ($scope.locationDataToTake.length == $scope.currLocation +2){
        $scope.hideNextButton = true;
        $scope.ifLast = true;
      }

      if ($scope.hideNextButton == true)
      {
        $scope.currLocation = $scope.nextLocation;
        $scope.currLocationData = $scope.locationDataToTake[$scope.currLocation];
        $scope.nextLocation = '';
        $scope.nextLocationData = '';
      }
      else if ($scope.currLocation == 8)
      {

      }
      else {
        $scope.currLocation = $scope.nextLocation;
        $scope.currLocationData = $scope.locationDataToTake[$scope.currLocation];
        DataService.nextLocation();
        $scope.nextLocation = DataService.getLocation();
        $scope.nextLocationData = $scope.locationDataToTake[$scope.nextLocation];

        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
           var latLng = new google.maps.LatLng($scope.locationDataToTake[$scope.currLocation].xCoordinate,$scope.locationDataToTake[$scope.currLocation].yCoordinate);

           var mapOptions = {
             disableDefaultUI: true,
             zoomControl: false,
             scrollwheel: false,
             disableDoubleClickZoom: true,
             draggable: false,
             center: latLng,
             zoom: 15,
             mapTypeId: google.maps.MapTypeId.ROADMAP
           };

           var tourCoordinates = [];
           var marker;

           for(var i = $scope.currLocation; i <= $scope.nextLocation; i++) {
             tourCoordinates.push(new google.maps.LatLng($scope.locationDataToTake[i].xCoordinate,$scope.locationDataToTake[i].yCoordinate));
           }

           console.log(tourCoordinates);

           $scope.tourMap = new google.maps.Map(document.getElementById("map"), mapOptions);
           console.log('map initialized');

           google.maps.event.addListenerOnce($scope.tourMap, 'idle', function(){
             console.log('before path')
             var tourPath = new google.maps.Polyline({
                path: tourCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
              });

              for(var i = $scope.currLocation; i <= $scope.nextLocation; i++) {
                if(i < $scope.nextLocation)
                {
                  distanceUrl += '&origins=' + $scope.locationDataToTake[i].xCoordinate + ',' + $scope.locationDataToTake[i].yCoordinate;
                  marker = new google.maps.Marker({
                  position: new google.maps.LatLng($scope.locationDataToTake[i].xCoordinate,$scope.locationDataToTake[i].yCoordinate),
                  label: (i+1).toString()
                  })
                  marker.setMap($scope.tourMap);
                }
                else {
                  distanceUrl += '&destinations=' + $scope.locationDataToTake[i].xCoordinate + ',' + $scope.locationDataToTake[i].yCoordinate + '&mode=walking&key=AIzaSyCBYil1DfXoRTgEcqB0-wL99XVTKqEkVio';
                  marker = new google.maps.Marker({
                  position: new google.maps.LatLng($scope.locationDataToTake[i].xCoordinate,$scope.locationDataToTake[i].yCoordinate),
                  label: (i+1).toString()
                  })
                  marker.setMap($scope.tourMap);
                }
              }
              $http.get(distanceUrl).success(function(distanceData) {
                console.log(distanceUrl);
                $scope.distanceDataReceived = distanceData;
                $scope.TimeTravel = distanceData.rows[0].elements[0].distance.text;
                $scope.TimeTravel2 = distanceData.rows[0].elements[0].duration.text;
                console.log($scope.distanceDataReceived);
                console.log($scope.TimeTravel);
                console.log($scope.TimeTravel2);
              });
              console.log('after path')
              tourPath.setMap($scope.tourMap);
              console.log('after tour')
           })
         });

      }


      }, function (error) {
          console.log('Error');
      }, function (progress) {
          // PROGRESS HANDLING GOES HERE
      };
})

}]);
