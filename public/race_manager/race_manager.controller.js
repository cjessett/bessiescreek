(function () {
    'use strict';

    angular
        .module('app')
        .controller('RaceManagerController', RaceManagerController);

    RaceManagerController.$inject = ['$location','UserService','$rootScope','RaceParticipantService','FlashService','RaceService','TeamService','ParticipantService','LapService','$mdDialog'];
    
    function RaceManagerController($location,UserService,$rootScope,RaceParticipantService,FlashService,RaceService,TeamService,ParticipantService,LapService,$mdDialog) {
        var vm = this;

        vm.participants = null;
        vm.races = null;
        vm.race_participants = [];
        vm.GetRaceParticipants = GetRaceParticipants;
        vm.GetRaceKey = GetRaceKey;
        vm.user = null;
        vm.EndLap = EndLap;
        vm.StartRace = StartRace;
        vm.StopRace = StopRace;
        vm.isGuest = isGuest;
        
        vm.OpenLapWindow = OpenLapWindow;
        vm.rpId = 0;

        //Lap Controller
        vm.GetLaps = GetLaps;
        vm.AddLap = AddLap;
        vm.RemoveLap = RemoveLap;
        vm.UpdateLap = UpdateLap;
        vm.laps = null;
        
        vm.newStartTime = "";
        vm.newEndTime="";
        vm.newLapNumber="";
        vm.newMiles = "";
        vm.cancelDialog = cancelDialog;
        vm.updated = false;
        vm.lap = null;
      
       

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
        }

        function cancelDialog(ev)
        {
             ev.preventDefault();
             if(vm.updated) { GetRaces();  }
             $mdDialog.cancel();
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
                    var i = 0;
                    for(i=0;i<vm.races.length;i++)
                    {
                        GetRaceParticipants(vm.races[i].id);
                    }
                });
        }

       function RefreshSelectedRace(race_id) {
             RaceService.GetAll()
                .then(function (response) {
                    vm.races = response;
                    
                    if(vm.races.length > 0)
                    {
                        var i = 0;
                        for(i=0;i<vm.races.length;i++)
                        {
                            GetRaceParticipants(race_id);
                        }
                    }
                });
        }

        function GetAllParticipants(){
            ParticipantService.GetAll()
                .then(function (response) {
                    vm.participants = response;
                });
        }

       

        function GetRaceKey(race_id)
        {
            var i = 0;
            for(i=0;i<vm.races.length;i++)
            {
                if(vm.races[i].id==race_id)
                    return i;
            }

            return 0;
        }

         function GetRaceParticipants(race_id) {
             RaceParticipantService.GetAllOrderByTag(race_id)
                .then(function (response) {
                    var key = GetRaceKey(race_id);
                    vm.race_participants[key] = response;
                });
        }
       
        function EndLap(race_id,race_participant_id){
           RaceParticipantService.EndLap(race_participant_id)
                .then(function (response) {
                    //FlashService.Success("Lap Ended");
                    GetRaceParticipants(race_id);
                });
        }

        function StartRace(race_id) {
            RaceService.StartRace(race_id)
                .then(function (response) {
                    //FlashService.Success("Race Started");
                     RefreshSelectedRace(race_id);
                });
        }

        function StopRace(race_id){
            if(confirm('Are you sure you want to stop the race?'))
            {
                RaceService.StopRace(race_id)
                .then(function (response) {
                    //FlashService.Success("Race Stopped");
                     RefreshSelectedRace(race_id);
                });
            }
           
        }

        function OpenLapWindow(race_participant_id,ev)
        {
          ev.preventDefault();
          vm.rpId = race_participant_id;

          LapService.GetLapDetails(vm.rpId)
                .then(function (response) {
                    vm.lap = response;

                     GetLaps();

                   

                    $mdDialog.show({
                            contentElement: '#lapDialog',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true
                        });
                });

         
        }

         function GetLaps() {
             
             LapService.GetLaps(vm.rpId)
                .then(function (response) {
                    vm.laps = response;
                   
                });
        }

         function AddLap() {
            
            LapService.Create({race_participant_id:vm.rpId,lap_number:vm.newLapNumber,start_time:vm.newStartTime,end_time:vm.newEndTime,miles:vm.newMiles}).then(function(response){
                if (response.success) {
                    vm.newStartTime = "";
                    vm.newEndTime="";
                    vm.newLapNumber="";
                    vm.newMiles = "";
                    vm.updated = true;
                    GetLaps();
                } else {
                    FlashService.Error(response.message);
                }
            });
        }

        function UpdateLap(lap){
            LapService.Update(lap).then(function(response){
                if (response.success) {
                    vm.updated = true;
                    GetLaps();
                } else {
                    FlashService.Error(response.message);
                }
            });
        }

        function RemoveLap(lap_id){
            LapService.Delete(lap_id).then(function(response){
                if (response.success) {
                    vm.updated = true;
                    GetLaps();
                } else {
                    FlashService.Error(response.message);
                }
            });
        }

    }

})();