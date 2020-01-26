(function () {
    'use strict';

    angular
        .module('app')
        .controller('RaceParticipantController', RaceParticipantController);

    RaceParticipantController.$inject = ['$location','UserService','$rootScope','RaceParticipantService','FlashService','RaceService','TeamService','ParticipantService'];
    
    function RaceParticipantController($location,UserService,$rootScope,RaceParticipantService,FlashService,RaceService,TeamService,ParticipantService) {
        var vm = this;

        vm.teams = null;
        vm.participants = null;
        vm.races = null;
        vm.race_participants = null;
        vm.GetRaceParticipants = GetRaceParticipants;
        vm.GetTeams = GetTeams;
        vm.user = null;
        vm.AddParticipant = AddParticipant;
        vm.RemoveParticipant = RemoveParticipant;
        vm.SetBikeType = SetBikeType;
        vm.selectedRace = "";
        vm.newTeam = "";
        vm.newParticipant = "";
        vm.newTag = "";
        vm.newBikeType = "";
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
            GetRaces();
            GetAllParticipants();
        }

       
        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        function GetRaces() {
             RaceService.GetAll()
                .then(function (response) {
                    vm.races = response;
                    if(vm.races.length > 0)
                    {
                        vm.selectedRace = vm.races[0];
                        GetTeams();
                        GetRaceParticipants();
                    }
                });
        }

        function GetAllParticipants(){
            ParticipantService.GetAll()
                .then(function (response) {
                    vm.participants = response;
                });
        }

        function GetRaceParticipants() {
             RaceParticipantService.GetAll(vm.selectedRace.id)
                .then(function (response) {
                    vm.race_participants = response;
                });
        }

        function GetTeams() {
             TeamService.GetTeamsByRace(vm.selectedRace.id)
                .then(function (response) {
                    vm.teams = response;
                });
        }

        function SetBikeType()
        {
            var i = 0;
            for(i=0;i<vm.participants.length;i++)
            {
                if(vm.participants[i].id == vm.newParticipant)
                {
                    vm.newBikeType = vm.participants[i].bike_type;
                    break;
                }
            }
        }

        function AddParticipant()
        {
            if(confirm('This participant will be removed from other races. Do you want to continue?'))
            {
                    RaceParticipantService.Create({race_id:vm.selectedRace.id,participant_id:vm.newParticipant,tag:vm.newTag,bike_type:vm.newBikeType}).then(function(response){
                    if (response.success) {
                        vm.newTeam = "";
                        vm.newParticipant = "";
                        vm.newTag = "";
                        vm.newBikeType = "";
                        FlashService.Success("Race Participant Added");
                        GetRaceParticipants();
                    } else {
                        FlashService.Error(response.message);
                    }
                });
            }
            
        }

      

        function RemoveParticipant(id)
        {
            RaceParticipantService.Delete(id).then(function(response){
                if (response.success) {
                    FlashService.Success("Race Participant Deleted");
                    GetRaceParticipants();
                } else {
                    FlashService.Error(response.message);
                }
            });
        }
    }

})();