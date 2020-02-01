var db = require('./db');
var LapDb = function () {};

LapDb.prototype.getLaps = async (req,res) => {
	const text = `
		SELECT id, start_time, end_time, lap_number, miles, 
		CAST(extract(day from (select end_time - start_time)) AS TEXT) || 'd:' ||
		CAST(extract(hour from (select end_time - start_time)) AS TEXT) || 'h:' ||
		CAST(extract(minute from (select end_time - start_time)) AS TEXT) || 'm:' ||
		CAST(extract(second from (select date_trunc('second', end_time) - date_trunc('second', start_time))) AS TEXT) || 's'
		total_time
		FROM laps 
		WHERE race_participant_id = $1 
		ORDER BY lap_number
	`;
	const { rows } = await db.query(text, [req.params.id]);
	res.send(rows);
}

LapDb.prototype.getLapReport = async (req,res) => {
	const text = "select rp.tag,l.lap_number,l.end_time from laps l inner join race_participants rp on l.race_participant_id = rp.id where l.end_time is not null order by l.end_time desc";
	const { rows } = await db.query(text);
	res.send(rows);
} 

LapDb.prototype.getLapDetails = async (req,res) => {
	const text = "SELECT participant,race_name,tag,gender_bike_type,total_time,miles from vwStandings where id = $1";
	const { rows } = await db.query(text, [req.params.id]);
	res.send(rows[0]);
}

LapDb.prototype.updateLap = async (req,res) => {
	const client = await db.getClient();
	try {
		await client.query('BEGIN');
		
		const text = "Update laps set start_time = $1, end_time = $2, lap_number = $3 ,miles = $4 WHERE id = $5";
		const params = [req.body.start_time,req.body.end_time,req.body.lap_number,req.body.miles,req.params.id];
		await client.query(text, params);
		
		const updateRacersText = "update race_participants set current_lap = (select count(*) from laps where laps.race_participant_id = race_participants.id and laps.end_time is not null) where race_participants.id in (select race_participant_id from laps where id = $1) ";
		await client.query(updateRacersText, [req.body.race_participant_id]);
		
		await client.query('COMMIT');
		res.send({ success: true });
	} catch (e) {
		await client.query('ROLLBACK');
		throw e;
	} finally {
		client.release();
	}
}

LapDb.prototype.addLap = async (req,res) => {
	const client = await db.getClient();
	try {
		await client.query('BEGIN');
		
		const text = "insert into laps (race_participant_id,lap_number,start_time,end_time,miles) values($1,$2,$3,$4,$5)";
		const params = [req.body.race_participant_id,req.body.lap_number,req.body.start_time,req.body.end_time,req.body.miles];
		await client.query(text, params);
		
		const updateRacersText = "update race_participants set current_lap = (select count(*) from laps where laps.race_participant_id = race_participants.id and laps.end_time is not null) where race_participants.id = $1";
		await client.query(updateRacersText, [req.body.race_participant_id]);
		
		await client.query('COMMIT');
		res.send({ success: true });
	} catch (e) {
		await client.query('ROLLBACK');
		throw e;
	} finally {
		client.release();
	}
}

LapDb.prototype.deleteLap = async (req,res) => {
	const client = await db.getClient();
	try {
		await client.query('BEGIN');
		
		const text = "update race_participants set current_lap = (select count(*) from laps where laps.race_participant_id = race_participants.id and laps.end_time is not null) where race_participants.id in (select race_participant_id from laps where id = $1)"
		await client.query(text, [req.params.id]);
		
		const deleteLapsText = "DELETE from laps Where id = $1";
		await client.query(text, [req.params.id]);
		
		await client.query('COMMIT');
		res.send({ success: true });
	} catch (e) {
		await client.query('ROLLBACK');
		throw e;
	} finally {
		client.release();
	}
}

module.exports = LapDb;