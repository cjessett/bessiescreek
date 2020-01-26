var db = require('./db');
var TeamDb = function () { };

TeamDb.prototype.getTeams = function (req,res) {
    var data = '[';
    var i = 0;
    Db.db.serialize(function () {
        Db.db.each("SELECT id,description,name,gender,race_id from vwTeams order by name", function (err, row) {
            if (err) console.log(err);
            if (i > 0) { data = data + ","; } 
            i++;
            data = data + '{"id": ' + row.id + ',"description":"' + row.description + '","name":"' + row.name + '","gender":"' + row.gender + '","race_id":' + row.race_id + '}';
        }, function (err, rows) { data = data + ']'; res.send(data); });
    });
}

TeamDb.prototype.getTeamsByRace = function (req,res) {
   
    const text = 'SELECT id,description,name,gender,race_id from vwTeams where race_id = $1 order by name';
    db.query(text, [req.params.id], (err, result) => {
      if (err) console.log(err);
      res.send(result.rows)
    });
}

TeamDb.prototype.addTeam = function (req,res) {
    Db.db.serialize(function () {
        var stmt = Db.db.prepare("INSERT INTO Teams(race_id,name,gender) VALUES (?,?,?)");
        stmt.run(req.body.race_id,req.body.name,req.body.gender);
        stmt.finalize();
        res.send('{"success": true }');
    });
}

TeamDb.prototype.deleteTeam = function (req,res){
    Db.db.serialize(function () {
        var stmt = Db.db.prepare("DELETE from Teams Where id = ?");
        stmt.run(req.params.id);
        stmt.finalize();
        res.send('{"success": true }');
    });
}


TeamDb.prototype.updateTeam = function (req,res) {
    Db.db.serialize(function () {
        var stmt = Db.db.prepare("Update Teams set name = ?,gender = ? Where id = ?");
        stmt.run(req.body.name,req.body.gender,req.params.id);
        stmt.finalize();
        res.send('{"success": true }');
    });
}

TeamDb.prototype.getTeamMembers = function (req,res) {
    var data = '[';
    var i = 0;
    var params = [];
    var query = 'select id,team_id,participant_id,TeamName,ParticipantName from vwTeamMembers where team_id = ?';

    Db.db.serialize(function () {
         //team_id
        params.push(req.params.id);
        Db.db.each(query,params,function(err,row) { 
	    if(i > 0) data = data + ',';
        i++;
	    data= data +  '{"id":' + row.id + ',"team_id":' + row.team_id + ',"participant_id":' + row.participant_id + ',"team_name":"' + row.TeamName + '","participant_name":"' + row.ParticipantName + '"}';
             
   }, function(err,rows) { 
            //console.log('Returning ' + retVal);
            data = data + ']'; 
            res.send(data);
        });	
    });
}

TeamDb.prototype.addMember = function (req,res) {
    Db.db.serialize(function () {
        var stmt = Db.db.prepare("insert into team_members(team_id,participant_id) values(?,?)");
        stmt.run(req.body.team_id,req.body.participant_id);
        stmt.finalize();
        res.send('{"success": true }');
    });
}

TeamDb.prototype.removeMember = function (req,res){
    Db.db.serialize(function () {
        var stmt = Db.db.prepare("delete from team_members where id = ?");
        stmt.run(req.params.id);
        stmt.finalize();
        res.send('{"success": true }');
    });
}

module.exports = TeamDb;