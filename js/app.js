var app = angular.module('calendar', [
	'ui.router','LocalStorageModule'
]);

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/calendar');
        $stateProvider
            .state('calendar',{
                url:'/calendar',
                templateUrl:'/templates/calendar.html',
                controller:'CalendarCtrl'
            })
            .state('day',{
                url: '/day/:date',
                templateUrl:'/templates/day.html',
                controller: 'DayCtrl'
            })
    }
])