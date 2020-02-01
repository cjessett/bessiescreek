(function () {
    'use strict';
    //'ui.grid', 'ui.grid.resizeColumns','ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav'

    angular
        .module('app', ['ngRoute', 'ngCookies','smart-table','ngMaterial'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider','$mdThemingProvider'];
    function config($routeProvider, $locationProvider,$mdThemingProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
            })
            .when('/login', { 
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })
            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm'
            })
            .when('/race', {
                controller: 'RaceController',
                templateUrl: 'race/race.view.html',
                controllerAs: 'vm'
            })
            .when('/race_participant', {
                controller: 'RaceParticipantController',
                templateUrl: 'race_participant/race_participant.view.html',
                controllerAs: 'vm'
            })
            .when('/race_manager', {
                controller: 'RaceManagerController',
                templateUrl: 'race_manager/race_manager.view.html',
                controllerAs: 'vm'
            })
            .when('/race_results', {
                controller: 'RaceResultsController',
                templateUrl: 'race_results/race_results.view.html',
                controllerAs: 'vm'
            })
            .when('/race_results_public', {
                controller: 'RaceResultsController',
                templateUrl: 'race_results_public/race_results_public.view.html',
                controllerAs: 'vm'
            })
            .when('/team', {
                controller: 'TeamController',
                templateUrl: 'team/team.view.html',
                controllerAs: 'vm'
            })
            .when('/team_member', {
                controller: 'TeamMemberController',
                templateUrl: 'team_member/team_member.view.html',
                controllerAs: 'vm'
            })
            .when('/format', {
                controller: 'FormatController',
                templateUrl: 'format/format.view.html',
                controllerAs: 'vm'
            })
             .when('/participant', {
                controller: 'ParticipantController',
                templateUrl: 'participant/participant.view.html',
                controllerAs: 'vm'
            })
             .when('/lap', {
                controller: 'LapController',
                templateUrl: 'lap/lap.view.html',
                controllerAs: 'vm'
            })
            .when('/lap_report', {
                controller: 'LapReportController',
                templateUrl: 'lap_report/lap_report.view.html',
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/login' });

            $mdThemingProvider.theme('default');
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    function run($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/race_results_public']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
          
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();