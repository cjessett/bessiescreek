"use strict";
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var winston = require('winston');
var expressWinston = require('express-winston');
var express = require('express');

var formatAPIRoutes = require('./server/routes/format_api');
var participantAPIRoutes = require('./server/routes/participant_api');
var raceAPIRoutes = require('./server/routes/race_api');
var userAPIRoutes = require('./server/routes/user_api');
var teamAPIRoutes = require('./server/routes/team_api');
var lapAPIRoutes = require('./server/routes/lap_api');

require('dotenv').config();

var app = express();

// logger
app.use(expressWinston.logger({
  transports: [new winston.transports.Console(
    {
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }
  )],
  meta: false,
  msg: "HTTP {{req.method}} {{req.url}}", 
  expressFormat: true,
  colorize: true,
}));

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.get('/', function (req, res) {  res.send('Hello World!'); } );

app.get('/api/formats', formatAPIRoutes.api_formats_get);
app.post('/api/formats', formatAPIRoutes.api_formats_add);
app.put('/api/formats/:id', formatAPIRoutes.api_formats_update);
app.delete('/api/formats/:id', formatAPIRoutes.api_formats_delete);

app.get('/api/races', raceAPIRoutes.api_races_get);
app.post('/api/races', raceAPIRoutes.api_races_add);
app.put('/api/races/:id', raceAPIRoutes.api_races_update);
app.delete('/api/races/:id', raceAPIRoutes.api_races_delete);
app.put('/api/start_race/:id', raceAPIRoutes.api_races_start);
app.put('/api/stop_race/:id', raceAPIRoutes.api_races_stop);
app.put('/api/end_lap/:id', raceAPIRoutes.api_races_endlap);
app.get('/api/race_results/:id', raceAPIRoutes.api_races_get_results);

app.get('/api/race_participants/:id', raceAPIRoutes.api_races_get_particiants);
app.get('/api/race_participants_order_by_tag/:id', raceAPIRoutes.api_races_get_particiants_orderbytag);
app.post('/api/race_participants', raceAPIRoutes.api_races_add_particiant);
app.delete('/api/race_participants/:id', raceAPIRoutes.api_races_delete_particiant);

app.get('/api/users/:id',userAPIRoutes.api_user_get);
app.get('/api/users', userAPIRoutes.api_users_get);
app.post('/api/users',userAPIRoutes.api_user_post);
app.post('/api/authenticate',  userAPIRoutes.api_user_authenticate);
app.get('/api/teams', teamAPIRoutes.api_teams_get);
app.get('/api/teams/:id', teamAPIRoutes.api_teams_getByRace);
app.post('/api/teams',teamAPIRoutes.api_teams_add);
app.put('/api/teams/:id',teamAPIRoutes.api_teams_update);
app.delete('/api/teams/:id',teamAPIRoutes.api_teams_delete);
app.get('/api/team_members/:id', teamAPIRoutes.api_teams_getMembers);
app.post('/api/team_members',teamAPIRoutes.api_teams_addMember);
app.delete('/api/team_members/:id',teamAPIRoutes.api_teams_removeMember);

app.get('/api/participants', participantAPIRoutes.api_participants_get);
app.get('/api/participants_order_by_id', participantAPIRoutes.api_participants_orderbyid_get);
app.post('/api/participants', participantAPIRoutes.api_participants_add);
app.put('/api/participants/:id', participantAPIRoutes.api_participants_update);
app.delete('/api/participants/:id', participantAPIRoutes.api_participants_delete);

app.get('/api/lap_report',lapAPIRoutes.api_laps_get_report);
app.get('/api/laps/:id',lapAPIRoutes.api_laps_get);
app.post('/api/laps',lapAPIRoutes.api_laps_addLap);
app.put('/api/laps/:id',lapAPIRoutes.api_laps_updateLap);
app.delete('/api/laps/:id',lapAPIRoutes.api_laps_deleteLap);
app.get('/api/lap/:id',lapAPIRoutes.api_lap_getDetails);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
