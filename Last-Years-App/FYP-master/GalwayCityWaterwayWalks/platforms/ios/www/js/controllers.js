var app = angular.module('starter.controllers', ['ionic'])

.constant('FORECASTIO_KEY', 'cb96da74b9956b890a4e4a1b47ee2d9e')
.controller('HomeCtrl', function($scope,$state,Weather,DataStore) {
	//read default settings into scope
	console.log('inside home');
	$scope.city  = DataStore.city;
	var latitude  =  DataStore.latitude;
	var longitude = DataStore.longitude;
		
	//call getCurrentWeather method in factory ‘Weather’
	Weather.getCurrentWeather(latitude,longitude).then(function(resp) {
	$scope.current = resp.data;
	  
	//convert to celcius
	var temp = resp.data.currently.temperature;
	temp = ((temp-32)*5/9);
	$scope.temp = Math.round(temp * 1) / 1;
	console.log('GOT CURRENT', $scope.current);
	//debugger;
	  
    }, function(error) {
      alert('Unable to get current conditions');
      console.error(error);
    });
	
	$scope.test = function() {
		$scope.test = "hello";
	};

})

.controller('GuideCtrl', function($scope,$state) {
})

.controller('LandmarksCtrl', function($scope,$state) {
})

.controller('MapCtrl', function($scope, $ionicLoading, $ionicSideMenuDelegate, $rootScope, $ionicPopup) {
	
	//pop up
	$scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       templateUrl: 'templates/tab-guide.html'
     });
     alertPopup.then(function(res) {
       console.log('Guide');
     });
	};
	
	//start walk button
	$scope.startWalk1 = function() {
     var alertPopup = $ionicPopup.alert({
       templateUrl: 'templates/walk1.html',
	   	   buttons: [{ text: 'Back To Map' }]
     });
     alertPopup.then(function(res) {
       console.log('Guide');
     });
	};
	
   $rootScope.cancel = $ionicLoading.hide;
   $scope.hidden ="display_none";
   $scope.hidden_refresh ="display_none";
   $scope.imagewalk ="walkblack";
   $scope.number = "Choose Walk";
   $scope.totalDistance = "Select from the tabs above";
   $scope.distance = "Press refresh button on the left";
   $scope.button_class="button-green2";
   $scope.refresh_button_class="refresh-green2";

    var myLocation;
  	var startOfWalk;	//starting point of walks - direction to this point
	var start;			//current position
	var end;
	var directionsServiceToStart;

   $scope.mapCreated = function(map) {
    $scope.map = map;
	marker2 = new google.maps.Marker({
			map: $scope.map,
			icon: 'img/end2.png'
	});
	marker1 = new google.maps.Marker({
		map: $scope.map,
		icon: 'img/start2.png'
	});
	hereMarker = new google.maps.Marker({
		map: $scope.map,
		icon: 'img/here2.png',
	});
	hereMarker.setMap(null);
	
	
	/*CODE FOR MARKER*/
	/*
	newMarker = new google.maps.Marker({
		map: $scope.map
	});
	newMarker.setPosition(new google.maps.LatLng(53.2697578, -9.0535053))
	newMarker.setMap($scope.map);
	*/
	
   };

   
   
   /***************************/
   
	//TABS
	//1.Green Tab
	$scope.showRoute1 = function() {
		//set start/end markers
		startOfWalk = new google.maps.LatLng(53.2697578, -9.0535053);
		end = new google.maps.LatLng(53.270013, -9.055799);	
		marker1.setPosition(startOfWalk);
		marker2.setPosition(end);
		marker2.setMap($scope.map);
		//display route
		directionsDisplayRoute2.setMap(null);
		directionsDisplayRoute3.setMap(null);
        directionsDisplayRoute1.setMap($scope.map);
		//get distance from start
		$scope.distance = "Press refresh button on the left";
		$scope.distanceFromMe();
		//display details
		$scope.number = "Walk 1";
		$scope.imagewalk ="walkgreen";
		$scope.totalDistance = "Total Distance: 3.5km";
		//display buttons
		$scope.hidden ="display";
		//change colours of buttons
		$scope.button_class="button-green2";
		$scope.refresh_button_class="refresh-green2";
    };
	
	//2.Red Tab
	$scope.showRoute2 = function() {
		//set start/end markers
		startOfWalk = new google.maps.LatLng(53.271781, -9.055724);
		end = new google.maps.LatLng(53.271781, -9.055724);	;	
		marker1.setPosition(startOfWalk);
		marker2.setPosition(end);
		marker2.setMap($scope.map);
		//display route
		directionsDisplayRoute1.setMap(null);
		directionsDisplayRoute3.setMap(null);
        directionsDisplayRoute2.setMap($scope.map);
		//get distance from start
		$scope.distance = "Press refresh button on the left";
		$scope.distanceFromMe();
		//display details
		$scope.number = "Walk 2";
		$scope.imagewalk ="walkred";
		$scope.totalDistance = "Total Distance: 0.75km";
		//display buttons
		$scope.hidden ="display";
		//change colours of buttons
		$scope.button_class="button-red2";
		$scope.refresh_button_class="refresh-red2";
    };
	
	//3.Blue Tab
	$scope.showRoute3 = function() {
		//set start/end markers
		startOfWalk = new google.maps.LatLng(53.275410, -9.056859);
		end = new google.maps.LatLng(53.275410, -9.056859);
		marker1.setPosition(startOfWalk);
		marker2.setPosition(end);
		marker2.setMap($scope.map);
		//display route
		directionsDisplayRoute2.setMap(null);
		directionsDisplayRoute1.setMap(null);
        directionsDisplayRoute3.setMap($scope.map);
		//get distance from start
		$scope.distance = "Press refresh button on the left";
		$scope.distanceFromMe();
		//display details
		$scope.number = "Walk 3";
		$scope.imagewalk ="walkblue";
		$scope.totalDistance = "Total Distance: 0.6km";
		//display buttons
		$scope.hidden ="display";
		//change colours of buttons
		$scope.button_class="button-blue2";
		$scope.refresh_button_class="refresh-blue2";
    };
	
  $scope.toggleLeft = function(){
	 $ionicSideMenuDelegate.toggleLeft();
  }
  
  
  /*****************************/
  
 //BUTTONS
 
  //1.ShowLocationToggle - 1.Display refresh button, 2.get loctation, 3.display marker, 4.Set current location as center/ 1.hide marker, 2.hide refresh button
  $scope.showLocation = { checked: false };
  $scope.showLocationToggle = function() {
    if($scope.showLocation.checked==false){
		$scope.hidden_refresh = "display"
		$scope.getPos();
		hereMarker.setMap($scope.map);
		$scope.map.setCenter(myLocation);
	}
	if($scope.showLocation.checked==true && $scope.direcctionsToStart.checked==false){
		$scope.hidden_refresh="display_none";
		hereMarker.setMap(null);
        var mapOptions = {
			center: startOfWalk,
			zoom: 15
		};
		$scope.map.setOptions(mapOptions);
	}
  }; // end of ToggleShowMyLocation
  
  
  
  //2.refresh button - 1.gets position, 2.refreshes "you are here" marker, 3.sets current location as center of map
  $scope.refreshButton = function(){
	  	$scope.getPos();
		hereMarker.setMap($scope.map);
		$scope.map.setCenter(myLocation);
		
		//if "show direction to start" is on, then refresh directions.
		if($scope.direcctionsToStart.checked==true){
			$scope.getDirectionsToStart();
		}
  }//end of refreshButton
  
  
	directionsDisplay = new google.maps.DirectionsRenderer({ //direction to starting point of walk
		suppressMarkers: true,
		polylineOptions: {
			strokeWeight: 6,
			strokeOpacity: 0.6,
			Zindex: 999
		}
	}); 
 
 
 
  //3.DistanceFromMe button - gets distance from current location
  $scope.distanceFromMe = function () { 
	//if "show my location" is turned on - center on current location
	if($scope.showLocation.checked==true && $scope.direcctionsToStart.checked==false){ 
		$scope.getPos();
		hereMarker.setMap($scope.map);
		$scope.map.setCenter(myLocation);
	}
	  
    console.log("Centering");
    if (!$scope.map) {
      return;
    }		
    $scope.loading = $ionicLoading.show({
    template: '<button class="button icon-left button button-clear ion-close-circled" ng-click="$root.cancel();">Getting Current Loocation...</button>' });
	
    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
	  directionsServiceToStart = new google.maps.DirectionsService();
	  myLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
	  start = myLocation;
		var request = {
			origin: start,
			destination: startOfWalk,
			travelMode: google.maps.DirectionsTravelMode.WALKING
		};
		directionsServiceToStart.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				var dist = response.routes[0].legs[0].distance.value / 1000 + "km";
				$scope.distance = dist;
			}
				
			else{
				$scope.distance = "Couldnt get distance";
			}
		});
       $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };//end of DistanceFromMe 
  //loading cancel
  
  
  
  //4. DirecctionsToStartToggle - 1.show refresh button, 2.get location, 3. show "you are here" marker, 4.Show directions to starting point 
  $scope.direcctionsToStart = { checked: false };
  $scope.direcctionsToStartToggle = function() {
    if($scope.direcctionsToStart.checked==false){
		$scope.hidden_refresh = "display"
		$scope.getDirectionsToStart();
	}
	//if "show my location" is false, set center of map to start of walk
	if($scope.direcctionsToStart.checked==true && $scope.showLocation.checked==false){
		$scope.hidden_refresh="display_none";
		hereMarker.setMap(null);
		directionsDisplay.setMap(null);
		var mapOptions = {
			center: startOfWalk,
			zoom: 15
		};
		$scope.map.setOptions(mapOptions);
	}
	//if "show my location" is true, set center of map to myLocation
	if($scope.direcctionsToStart.checked==true && $scope.showLocation.checked==true){
		directionsDisplay.setMap(null);
		var mapOptions = {
			center: myLocation,
			zoom: 15
		};
		$scope.map.setOptions(mapOptions);
	}
  }; // end of DirecctionsToStartToggle
    $scope.getDirectionsToStart = function() {
		$scope.getPos();
		hereMarker.setMap($scope.map);
		$scope.distanceFromMe();
		directionsDisplay.setMap($scope.map);
  }; // end of DirecctionsToStart


  //get current positon
  $scope.getPos = function () {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
    template: '<button class="button icon-left button button-clear ion-close-circled" ng-click="$root.cancel();">Getting Current Loocation...</button>' });

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
	  myLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
	  hereMarker.setPosition(myLocation);
	  $scope.map.setCenter(myLocation);
      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  }; 
});

/**********************************************/

//DIRECTIVES
app.directive('map', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {
		
	var directionsService = new google.maps.DirectionsService({
		 
	});     //Create a DirectionsService object which is required to communicate with the Google Maps API Direction Service
	var map;
	
	var route1 = [
		new google.maps.LatLng(53.277121, -9.053788),
		new google.maps.LatLng(53.275740, -9.058380),
		new google.maps.LatLng(53.274668, -9.061309),
		new google.maps.LatLng(53.271493, -9.059161),
		new google.maps.LatLng(53.271932, -9.058191),
		new google.maps.LatLng(53.271533, -9.056798),
		new google.maps.LatLng(53.270590, -9.057333)
	];
	
	var route2 = [
		new google.maps.LatLng(53.271542, -9.056760),
		new google.maps.LatLng(53.270349, -9.058045),
		new google.maps.LatLng(53.271972, -9.060620),
		new google.maps.LatLng(53.272030, -9.058323)
	];
	
	var route3 = [
		new google.maps.LatLng(53.275771, -9.058126),
		new google.maps.LatLng(53.273788, -9.057207)
	];
	
      function initialize() {
		var galway = new google.maps.LatLng(53.273361, -9.057331);
        var mapOptions = {
			center: galway,
			zoom: 15
		};
	
		map = new google.maps.Map($element[0], mapOptions);
		
	
		//Create a DirectionsRenderer object to render the directions results
		directionsDisplayRoute1= new google.maps.DirectionsRenderer({
			//preserveViewport: true,
			suppressMarkers: true,
			polylineOptions: {
				strokeColor: "#00cc00",
				strokeWeight: 6,
				strokeOpacity: 0.7,
				Zindex: 1,
			}
		});  
		
		directionsDisplayRoute2 = new google.maps.DirectionsRenderer({
			//preserveViewport: true,
			suppressMarkers: true,
			polylineOptions: {
				strokeColor: "red",
				strokeWeight: 6,
				strokeOpacity: 0.6,
				Zindex: 1
				
			}
		}); 
		
		
		directionsDisplayRoute3 = new google.maps.DirectionsRenderer({
			//preserveViewport: true,
			suppressMarkers: true,
			polylineOptions: {
				strokeColor: "blue",
				strokeWeight: 6,
				strokeOpacity: 0.6,
				Zindex: 1
			}
		}); 
			
		var waypointsRoute1 = [];
		for (var i = 0; i < route1.length; i++) {
			var address = route1[i];
			if (address !== "") {
				waypointsRoute1.push({
					location: address,
					stopover: false
				});
			}
		}
		
		var waypointsRoute2 = [];
		for (var i = 0; i < route2.length; i++) {
			var address = route2[i];
			if (address !== "") {
				waypointsRoute2.push({
					location: address,
					stopover: false
				});
			}
		}
		
		var waypointsRoute3 = [];
		for (var i = 0; i < route3.length; i++) {
			var address = route3[i];
			if (address !== "") {
				waypointsRoute3.push({
					location: address,
					stopover: false
				});
			}
		}
		
		
		
		var startRoute1 = new google.maps.LatLng(53.269840, -9.053495);     //Set the source/ origin
		var endRoute1 = new google.maps.LatLng(53.270013, -9.055799);  //Set the destination
		
		var startRoute2 = new google.maps.LatLng(53.271781, -9.055724);     //Set the source/ origin
		var endRoute2 = new google.maps.LatLng(53.271781, -9.055724);  //Set the destination
		
		var startRoute3 = new google.maps.LatLng(53.275410, -9.056859);     //Set the source/ origin
		var endRoute3 = new google.maps.LatLng(53.275410, -9.056859);  //Set the destination
		
		var requestRoute1 =
		{
            origin:startRoute1,
            destination:endRoute1,
			waypoints: waypointsRoute1, //an array of waypoints
            optimizeWaypoints: false, //set to true if you want google to determine the shortest route or false to use the order specified.
            travelMode: google.maps.DirectionsTravelMode.WALKING //Default travel mode is DRIVING. You can change to BICYCLING or WALKING and see the changes.

		};
		
		var requestRoute2 =
		{
            origin:startRoute2,
            destination:endRoute2,
			waypoints: waypointsRoute2, //an array of waypoints
            optimizeWaypoints: false, //set to true if you want google to determine the shortest route or false to use the order specified.
            travelMode: google.maps.DirectionsTravelMode.WALKING          //Default travel mode is DRIVING. You can change to BICYCLING or WALKING and see the changes.
		};
		
		var requestRoute3 =
		{
            origin:startRoute3,
            destination:endRoute3,
			waypoints: waypointsRoute3, //an array of waypoints
            optimizeWaypoints: false, //set to true if you want google to determine the shortest route or false to use the order specified.
            travelMode: google.maps.DirectionsTravelMode.WALKING          //Default travel mode is DRIVING. You can change to BICYCLING or WALKING and see the changes.
		};
		
		directionsService.route(requestRoute1, function(response, status)
		{
            if (status == google.maps.DirectionsStatus.OK) //Check if request is successful.
            {
            directionsDisplayRoute1.setDirections(response);         //Display the directions result
            }
		});
		
		directionsService.route(requestRoute2, function(response, status)
		{
            if (status == google.maps.DirectionsStatus.OK) //Check if request is successful.
            {
            directionsDisplayRoute2.setDirections(response);         //Display the directions result
            }
		});
		
		directionsService.route(requestRoute3, function(response, status)
		{
            if (status == google.maps.DirectionsStatus.OK) //Check if request is successful.
            {
            directionsDisplayRoute3.setDirections(response);         //Display the directions result
            }
		});

        $scope.onCreate({map: map});

        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
          e.preventDefault();
          return false;
        });
		
		//directionsDisplayRoute1.setMap(map);	
	}
	
      if (document.readyState === "complete") {
        initialize();
      } else {
        google.maps.event.addDomListener(window, 'load', initialize);
      }
	  
	$scope.getLocation = function () {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
		}
		else {
			$scope.error = "Geolocation is not supported by this browser.";
		}
	}
    }
  }
});
