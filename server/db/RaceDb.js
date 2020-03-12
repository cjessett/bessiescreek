var db = require('./db');
var RaceDb = function () {};

const { LAP_DISTANCE } = process.env;

RaceDb.prototype.getRaces = async (req, res) => {
  const text = "SELECT id, description, TO_CHAR(scheduled_date :: DATE, 'mm/dd/yyyy') as scheduled_date, start_time, end_time from races order by description";
  try {
    const { rows } = await db.query(text);
    res.send(rows);
  } catch (e) {
    throw e;
  }
}

RaceDb.prototype.addRace = async (req,res) => {
  const text =  "INSERT INTO Races(description,scheduled_date) VALUES ($1, $2)";
  const params = [req.body.description, req.body.scheduled_date];
  try {
    await db.query(text, params);
    res.send({ success: true });
  } catch (e) {
    throw e;
  }
}

RaceDb.prototype.deleteRace = async (req,res) => {
  const text = "DELETE from races WHERE id = $1";
  try {
    await db.query(text, [req.params.id]);
    res.send({ success: true });
  } catch (e) {
    throw e;
  }
}

RaceDb.prototype.updateRace = async (req,res) => {
  const text = "UPDATE races SET description = $1, scheduled_date = $2 WHERE id = $3";
  const params = [req.body.description, req.body.scheduled_date, req.params.id];
  try {
    await db.query(text, params);
    res.send({ success: true });
  } catch (e) {
    throw e;
  }
}

RaceDb.prototype.startRace = async (req,res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    
    const text = "INSERT into laps(lap_number,race_participant_id,start_time,miles) select 1,id,NOW(),0 from race_participants where race_id = $1";
    await client.query(text, [req.params.id]);
    
    const updateRaceStartTime = "Update Races set start_time = NOW() Where id = $1";
    await client.query(updateRaceStartTime, [req.params.id]);
    
    await client.query('COMMIT');
    res.send({ success: true });
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

RaceDb.prototype.endRace = async (req,res) => {
  const text = "UPDATE races set end_time = NOW() WHERE id = $1";
  try {
    await db.query(text, [req.params.id]);
    res.send({ success: true });
  } catch (e) {
    throw e
  }
}

RaceDb.prototype.endLap = async (req,res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    
    const text = "UPDATE laps set end_time = NOW(), miles = $1 where race_participant_id = $2 and end_time is null";
    await client.query(text, [LAP_DISTANCE, req.params.id]);
    
    const updateRacersLaps = "update race_participants set current_lap = (select count(*) from laps where laps.race_participant_id = race_participants.id and laps.end_time is not null) where id = $1";
    await client.query(updateRacersLaps, [req.params.id]);
    
    const updateLap = "insert into laps (lap_number,race_participant_id,start_time,miles) select current_lap+1,id, NOW(),0 from race_participants  where id = $1";
    await client.query(updateLap, [req.params.id]);

    await client.query('COMMIT');
    res.send({ success: true });
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

RaceDb.prototype.addParticipant = async (req,res) => {
  const client = await db.getClient();
  const { participant_id, race_id, tag, bike_type } = req.body;
  try {
    await client.query('BEGIN');
    
    const text = "DELETE FROM laps where race_participant_id in (select id from race_participants where participant_id = $1)";
    await client.query(text, [participant_id]);
    
    const deleteRaceParticipantText = "DELETE FROM race_participants where participant_id = $1";
    await client.query(deleteRaceParticipantText, [participant_id]);
    
    const addRaceParticipantText = "INSERT INTO race_participants(race_id,participant_id,current_lap,tag,bike_type) VALUES ($1,$2,$3,$4,$5)"
    await client.query(addRaceParticipantText, [race_id, participant_id, 0, tag, bike_type]);
    
    await client.query('COMMIT');
    res.send({ success: true });
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

RaceDb.prototype.deleteParticipant = async (req,res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    
    const text = "delete from laps where race_participant_id = ?";
    await client.query(text, [req.params.id]);
    
    const deleteRaceParticipantText = "delete from race_participants where id = ?";
    await client.query(deleteRaceParticipantText, [req.params.id]);
    
    await client.query('COMMIT');
    res.send({ success: true });
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

RaceDb.prototype.getParticipants = async (req,res) => {
  const text = "SELECT rp.id,rp.race_id,rp.team_id,rp.participant_id,rp.current_lap, tag , p.name as participant_name, t.name as team_name, rp.bike_type as bike_type ,l.miles from race_participants rp left join teams t on rp.team_id = t.id left join participants p on rp.participant_id = p.id left join (select sum(miles) miles,race_participant_id from laps group by race_participant_id) l on l.race_participant_id = rp.id where rp.race_id = $1"
  try {
    const { rows } = await db.query(text, [req.params.id]);
    res.send(rows);
  } catch (e) {
    throw e;
  }
}

RaceDb.prototype.getParticipantsOrderByTag = async (req,res) => {
  const text = "SELECT rp.id, rp.race_id, rp.team_id, rp.participant_id, rp.current_lap, tag, p.name as participant_name, t.name team_name, rp.bike_type as bike_type, l.miles from race_participants rp left join teams t on rp.team_id = t.id left join participants p on rp.participant_id = p.id left join (select sum(miles) miles,race_participant_id from laps group by race_participant_id) l on l.race_participant_id = rp.id where rp.race_id = $1 order by rp.tag"
  try {
    const { rows } = await db.query(text, [req.params.id]);
    res.send(rows);
  } catch (e) {
    throw e;
  }
}

RaceDb.prototype.getResults = async (req,res) => {
  const text = "SELECT id,race_name,participant,gender,age,bike_type,tag,total_time,current_lap,start_time, end_time,distance_race,gender_bike_type,age_group,miles from vwStandings where race_finished = 'Y' or start_time is not null order by race_name,gender_bike_type,current_lap desc";
  const { rows } = await db.query(text);
  res.send(rows);
}

module.exports = RaceDb;
