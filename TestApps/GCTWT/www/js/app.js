
angular.module('GCTWT', ['ionic','ngCordova','GCTWT.controllers', 'GCTWT.services'])
//this forces the tabs to bottom of the page for android, ios default bottom
.config(function($ionicConfigProvider){
  $ionicConfigProvider.tabs.position('bottom');
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})///end GCTWT

.config(function($stateProvider, $urlRouterProvider) {
$stateProvider
// setup an abstract state for the tabs directive
.state('home', {
  url: '/home',
  views: {
    'tab-home': {
      templateUrl: 'templates/tab-home.html',
      controller: 'HomeCtrl'
    }
  }
})
.state('maps', {
  url: '/maps',
  views: {
    'tab-maps': {
      templateUrl: 'templates/tab-maps.html',
      controller: 'MapCtrl'
    }
  }
})
.state('tours', {
  url: '/tours',
  views: {
    'tab-tours': {
      templateUrl: 'templates/tab-tours.html',
      controller: 'ToursCtrl'

    }
  }
})


.state('mytour', {
  url: '/mytour',
  views: {
    'tab-mytour': {
      templateUrl: 'templates/tab-mytour.html',
      controller: 'SavedTourCtrl'
    }
  }
})

.state('locations', {
  url: '/tours/:aId',
  views: {
    'tab-tours': {
      templateUrl: 'templates/locations.html',
      controller: 'LocationsCtrl'

    }
  }

})

.state('details', {
  url: '/details/:aId',
  views: {
    'tab-tours': {
      templateUrl: 'templates/details.html',
      controller: 'DetailsCtrl'
    }
  }
});

// if none of the above states are matched, use this as the fallback
$urlRouterProvider.otherwise('/home');
});
