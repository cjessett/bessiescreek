var db = require('./db');
var TeamDb = function () { };

TeamDb.prototype.getTeams = async (req,res) => {
  const text = "SELECT id,description,name,gender,race_id from vwTeams order by name";
  const { rows } = await db.query(text);
  res.send(rows);
}

TeamDb.prototype.getTeamsByRace = async (req,res) => {
  const text = 'SELECT id,description,name,gender,race_id from vwTeams where race_id = $1 order by name';
  const { rows } = await db.query(text, [req.params.id]);
  res.send(rows);
}

TeamDb.prototype.addTeam = async (req,res) => {
  const text = "INSERT INTO Teams(race_id,name,gender) VALUES (?,?,?)";
  const params = [req.body.race_id,req.body.name,req.body.gender]
  await db.query(text, params);
  res.send({ success: true });
}

TeamDb.prototype.deleteTeam = async (req,res) => {
  const text = "DELETE from Teams Where id = $1";
  await db.query(text, [req.params.id]);
  res.send({ success: true });
}

TeamDb.prototype.updateTeam = async (req,res) => {
  
  const text = "Update Teams set name = $1,gender = $2 Where id = $3";
  const params = [req.body.name,req.body.gender,req.params.id];
  await db.query(text, params);
  res.send({ success: true });
}

TeamDb.prototype.getTeamMembers = async (req,res) => {
  const text = 'select id,team_id,participant_id,TeamName as team_name,ParticipantName as participant_name from vwTeamMembers where team_id = $1';
  const { rows } = await db.query(text, [req.params.id]);
  res.send(rows);
}

TeamDb.prototype.addMember = async (req,res) => {
  const text = "insert into team_members(team_id,participant_id) values($1,$2)"
  const params = [req.body.team_id,req.body.participant_id];
  await db.query(text, params);
  res.send({ success: true });
}

TeamDb.prototype.removeMember = async (req,res) => {
  const text = "delete from team_members where id = $1";
  const params = [req.params.id];
  await db.query(text, params);
  res.send({ success: true });
}

module.exports = TeamDb;