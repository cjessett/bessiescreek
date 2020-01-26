(function () {
    'use strict';

    angular
        .module('app')
        .controller('RaceController', RaceController);

    RaceController.$inject = ['$location','UserService','$rootScope','RaceService','FlashService'];
    
    function RaceController($location,UserService,$rootScope,RaceService,FlashService) {
        var vm = this;

        vm.GetAll = GetAll;
        vm.user = null;
        vm.AddRace = AddRace;
        vm.RemoveRace = RemoveRace;
        vm.UpdateRace = UpdateRace;
        vm.newDescription = "";
        vm.newScheduledDate = "";
         vm.isGuest = isGuest;


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
            GetAll();
        }

       
        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        function GetAll() {
             RaceService.GetAll()
                .then(function (response) {
                    vm.races = response;
                });
        }

        function AddRace()
        {
            RaceService.Create({description:vm.newDescription,scheduled_date:vm.newScheduledDate}).then(function(response){
                if (response.success) {
                   vm.newDescription = "";
                    vm.newScheduledDate = "";
                    FlashService.Success("Race Added");
                    GetAll();
                } else {
                    FlashService.Error(response.message);
                }
            });
        }

        function UpdateRace(race)
        {
            RaceService.Update(race).then(function(response){
                if (response.success) {
                    FlashService.Success("Race Updated");
                    GetAll();
                } else {
                    FlashService.Error(response.message);
                }
            });
        }

        function RemoveRace(id)
        {
            RaceService.Delete(id).then(function(response){
                if (response.success) {
                    FlashService.Success("Race Deleted");
                    GetAll();
                } else {
                    FlashService.Error(response.message);
                }
            });
        }
    }

})();