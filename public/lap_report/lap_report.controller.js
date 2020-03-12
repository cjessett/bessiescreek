(function () {
    'use strict';

    angular
        .module('app')
        .controller('LapReportController', LapReportController);

    LapReportController.$inject = ['$location','UserService','$rootScope','RaceParticipantService','FlashService','RaceService','TeamService','ParticipantService','LapService','$mdDialog'];
    
    function LapReportController($location,UserService,$rootScope,RaceParticipantService,FlashService,RaceService,TeamService,ParticipantService,LapService,$mdDialog) {
        var vm = this;
        vm.laps = [];
        vm.user = null;
        vm.isGuest = isGuest;
        vm.toDate = toDate;
        vm.rpId = 0;
      

        initController();

        function isGuest()
        {
            if(vm.user)
                return vm.user.username.toLowerCase()=='guest';
            else
                return true;
        }


         function initController() {
            loadCurrentUser();
            GetLapReport();
        }

        function toDate(date_str)
        {
            var dt = Date.parse(date_str);
            return dt;
        }
        
        
        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        function GetLapReport() {
             LapService.GetLapReport()
                .then(function (response) {
                    vm.laps= response;
                   
                });
        }
       

    }

})();