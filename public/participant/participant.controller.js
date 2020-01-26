(function () {
    'use strict';

    angular
        .module('app')
        .controller('ParticipantController', ParticipantController);

  
    ParticipantController.$inject = ['$location','UserService','$rootScope','ParticipantService','FlashService'];
    function ParticipantController($location,UserService, $rootScope,ParticipantService,FlashService) {
        var vm = this;

        vm.GetAll = GetAll;
        vm.user = null;
        vm.AddParticipant = AddParticipant;
        vm.RemoveParticipant = RemoveParticipant;
        vm.UpdateParticipant = UpdateParticipant;
        vm.isGuest = isGuest;
        
        vm.newName = "";
        vm.newAddress="";
        vm.newPrimaryPhone="";
        vm.newAltPhone="";
        vm.newEmail="";
        vm.newGender = "M";
        vm.newAge = "";
        vm.newAgeGroup = "8";
        vm.newBikeType = "Standard";

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
             ParticipantService.GetAllOrderById()
                .then(function (response) {
                    vm.participants = response;
                });
        };

        function AddParticipant() {
            ParticipantService.Create({name:vm.newName,address:vm.newAddress,primary_phone:'',alt_phone:'',email:'',gender:vm.newGender,age:vm.newAge,bike_type:vm.newBikeType,age_group:vm.newAgeGroup}).then(function(response){
                if (response.success) {
                    vm.newName = "";
                    vm.newAddress="";
                    //vm.newPrimaryPhone="";
                    //vm.newAltPhone="";
                    //vm.newEmail="";
                    vm.newGender = "M";
                    vm.newAge = "";
                    vm.newBikeType = "Standard";
                    vm.newAgeGroup = "8";
                    FlashService.Success("Participant Added");
                    GetAll();
                } else {
                    FlashService.Error(response.message);
                }
            });
        }

        function UpdateParticipant(participant){
            ParticipantService.Update(participant).then(function(response){
                if (response.success) {
                    FlashService.Success("Participant Updated");
                    GetAll();
                } else {
                    FlashService.Error(response.message);
                }
            });
        }

        function RemoveParticipant(participant_id){
            ParticipantService.Delete(participant_id).then(function(response){
                if (response.success) {
                    FlashService.Success("Participant Deleted");
                    GetAll();
                } else {
                    FlashService.Error(response.message);
                }
            });
        }
    }

})();