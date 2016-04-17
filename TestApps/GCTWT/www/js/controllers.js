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
    console.log(error);
    console.log("Could not get location");
  });
})//end MapCtrl

.controller('LocationsCtrl',['$scope', '$http', '$state', '$localStorage', '$cordovaFile','$cordovaFileTransfer', function($scope, $http, $state, $localStorage, $cordovaFile, $cordovaFileTransfer) {
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

      var filename = 'staticMap.jpg';
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
}])

.controller('SavedTourCtrl',['$scope', '$localStorage', '$state', function($scope, $localStorage, $state) {
  $scope.$on('$ionicView.enter', function() {
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
