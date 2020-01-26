var Db = require('./db');
var LapDb = function () {};

LapDb.prototype.getLaps = function(req,res){
	var data = '[';
	var params = [];
  var i = 0;
	params.push(req.params.id);
      Db.db.each("SELECT id,start_time,ifnull(end_time,'') end_time,lap_number,miles,CAST((strftime('%s', ifnull(end_time,start_time)) - strftime('%s', start_time)) / (60 * 60 * 24) AS TEXT) || 'd:' || CAST(((strftime('%s',  ifnull(end_time,start_time)) - strftime('%s', start_time)) % (60 * 60 * 24)) / (60 * 60) AS TEXT) || 'h:' || CAST((((strftime('%s', ifnull(end_time,start_time)) - strftime('%s', start_time)) % (60 * 60 * 24)) % (60 * 60)) / 60 AS TEXT) || 'm:' ||   CAST((((strftime('%s', ifnull(end_time,start_time)) - strftime('%s', start_time)) % (60 * 60 * 24)) % (60 * 60)) % 60 AS TEXT) || 's'  total_time  from laps where race_participant_id = ? order by lap_number", params,function (err, row) {
          if (err) console.log(err);
          if (i > 0) { data = data + ","; } 
          i++;
          data = data + '{"id": ' + row.id + ',"start_time":"' + row.start_time + '","end_time":"' + row.end_time + '","lap_number":"' + row.lap_number + '","miles":"' + row.miles + '","total_time":"' + row.total_time + '"}';
      }, function (err, rows) { data = data + ']'; res.send(data); });
}

LapDb.prototype.getLapReport = function(req,res){
	var data = '[';
  var i = 0;
  Db.db.each("select rp.tag,l.lap_number,l.end_time from laps l inner join race_participants rp on l.race_participant_id = rp.id where l.end_time is not null order by l.end_time desc", function (err, row) {
      if (err) console.log(err);
      if (i > 0) { data = data + ","; } 
      i++;
      data = data + '{"tag": ' + row.tag + ',"end_time":"' + row.end_time + '","lap_number":' + row.lap_number + '}';
  }, function (err, rows) { data = data + ']'; res.send(data); });
}

LapDb.prototype.getLapDetails = function(req,res){
	var data = '';
	var params = [];
	params.push(req.params.id);
  Db.db.each("SELECT participant,race_name,tag,gender_bike_type,total_time,miles from vwStandings where id = ?", params,function (err, row) {
      if (err) console.log(err);
      data = '{"participant":"' + row.participant + '","race_name":"' + row.race_name + '","tag":"' + row.tag + '","gender_bike_type":"' + row.gender_bike_type + '","total_time":"' + row.total_time + '","miles":"' + row.miles + '"}';
  }, function (err, rows) {  res.send(data); });
}

LapDb.prototype.updateLap = function(req,res){
	Db.db.serialize(function () {
        var stmt = Db.db.prepare("Update laps set start_time=?, end_time = ?, lap_number=?,miles = ? Where id = ?");
        stmt.run(req.body.start_time,req.body.end_time,req.body.lap_number,req.body.miles,req.params.id);
        stmt.finalize();

        var stmt2 = Db.db.prepare("update race_participants set current_lap = (select count(*) from laps where laps.race_participant_id = race_participants.id and laps.end_time is not null) where race_participants.id in (select race_participant_id from laps where id= ?) ");
        stmt2.run(req.body.race_participant_id);
        stmt2.finalize();

        res.send('{"success": true }');
    });
}

LapDb.prototype.addLap = function(req,res){
	Db.db.serialize(function () {
        var stmt = Db.db.prepare("insert into laps (race_participant_id,lap_number,start_time,end_time,miles) values(?,?,?,?,?)");
        stmt.run(req.body.race_participant_id,req.body.lap_number,req.body.start_time,req.body.end_time,req.body.miles);
        stmt.finalize();

        var stmt2 = Db.db.prepare("update race_participants set current_lap = (select count(*) from laps where laps.race_participant_id = race_participants.id and laps.end_time is not null) where race_participants.id = ? ");
        stmt2.run(req.body.race_participant_id);
        stmt2.finalize();

        res.send('{"success": true }');
    });
}

LapDb.prototype.deleteLap = function(req,res)
{
	Db.db.serialize(function () {
        

        var stmt2 = Db.db.prepare("update race_participants set current_lap = (select count(*) from laps where laps.race_participant_id = race_participants.id and laps.end_time is not null) where race_participants.id in (select race_participant_id from laps where id = ?) ");
        stmt2.run(req.params.id);
        stmt2.finalize();

        var stmt = Db.db.prepare("DELETE from laps Where id = ?");
        stmt.run(req.params.id);
        stmt.finalize();

        res.send('{"success": true }');
    });
}

module.exports = LapDb;