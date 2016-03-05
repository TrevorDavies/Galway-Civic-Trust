angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

      .state('tabsController.home', {
    url: '/homePage',
    views: {
      'tab1': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('tabsController.tours', {
    url: '/tourPage',
    views: {
      'tab2': {
        templateUrl: 'templates/tours.html',
        controller: 'toursCtrl'
      }
    }
  })

  .state('tabsController.map', {
    url: '/mapPage',
    views: {
      'tab3': {
        templateUrl: 'templates/map.html',
        controller: 'mapCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

$urlRouterProvider.otherwise('/page1/homePage')



});
