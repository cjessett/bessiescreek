(function () {
    'use strict';

    angular
        .module('app')
        .controller('RaceResultsController', RaceResultsController);

    RaceResultsController.$inject = ['$location','UserService','$rootScope','FlashService','RaceService','LapService','$mdDialog'];
    
    function RaceResultsController($location,UserService,$rootScope,FlashService,RaceService,LapService,$mdDialog) {
        var vm = this;

        vm.races = null;
        vm.race_results = null;
        vm.GetRaceResults = GetRaceResults;
        vm.user = null;
        vm.selectedRace = "";
        vm.selectedBikeType = "";
        vm.selectedGender = "";
        vm.GetPlace=GetPlace;
        vm.OpenLapWindow = OpenLapWindow;
        vm.rpId = 0;
        vm.isGuest = isGuest;

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
        vm.GetGender = GetGender;
        vm.GetRaceStatus = GetRaceStatus;
        vm.toDate = toDate;


        initController();

       function isGuest()
        {
            if(vm.user)
                return vm.user.username.toLowerCase()=='guest';
            else
                return true;
        }

        function toDate(date_str)
        {
            var dt = Date.parse(date_str);
            return dt;
        }


        function cancelDialog(ev)
        {
             ev.preventDefault();
             if(vm.updated) { GetRaces(); GetRaceResults(); }
             $mdDialog.cancel();
        }

         function initController() {
            loadCurrentUser();
            GetRaces();
            GetRaceResults();
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
                });
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
                            contentElement: '#myDialog',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true
                        });
                });

          
        }

        function CollectGenderBikeTypes()
        {
            if(!vm.races) return;
            var i = 0,j=0,k=0;
            var found = false;

            for(i=0;i<vm.races.length;i++)
            {
                vm.races[i].gender_bike_types = [];

                for(j=0;j<vm.race_results.length;j++)
                {
                    if(vm.race_results[j].race_name==vm.races[i].description)
                    {
                        found = false;
                        for(k=0;k<vm.races[i].gender_bike_types.length;k++)
                        {
                            if(vm.races[i].gender_bike_types[k]==vm.race_results[j].gender_bike_type)
                            {
                                found = true;
                                break;
                            }
                        }

                        if(!found)
                        {
                             vm.races[i].gender_bike_types.push(vm.race_results[j].gender_bike_type);
                        }
                    }
                }
            }
        }

        function GetPlace(row,index)
        {
              if(row.distance_race=='Y')
              {
                if(row.laps_completed==0)
                {
                    return 'DNS';        
                }
                else if(row.laps_completed < 24)
                {
                    return 'DNF';
                }
                else
                {
                    return '' + index;
                }
              }
              else
                return '' + index;  
        }

        function GetGender(gender)
        {
             switch(gender)
             {
                 case "F":
                    return "Solo Female";
                 case "M":
                    return "Solo Male";
                 case "TF2":
                    return "Team Female 2 Person";
                 case "TM2":
                    return "Team Male 2 Person";
                 case "TF4":
                    return "Team Female 4 Person";
                 case "TM4":
                    return "Team Male 4 Person";
                 case "TX2":
                    return "Team Mixed 2 Person";
                 case "TX4":
                    return "Team Mixed 4 Person";
                case "TFT":
                     return "Team Female Tandem";
                case "TMT":
                     return "Team Male Tandem";
                case "TXT":
                    return "Team Mixed Tandem";
             }
        }

       

        function GetRaceResults() {
             RaceService.GetRaceResults(0)
                .then(function (response) {
                    vm.updated = false;
                    vm.race_results = response;
                    CollectGenderBikeTypes();
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

        function GetRaceStatus(race)
        {
            if(race.end_time)
            {
                return "Final";
            }      
            else
            {
               if(race.start_time) return "In Progress";
               else return "Not Started";
            }
        }

    }

})();

