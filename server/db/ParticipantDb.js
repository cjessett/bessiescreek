const db = require('./db');
const ParticipantDb = function () {};

ParticipantDb.prototype.getParticipants = async (req, res) => {
  const text = "SELECT id,name, address, address,primary_phone, alt_phone, alt_phone,email,gender, age, age,bike_type,age_group from participants order by name";
  try {
    const { rows } = await db.query(text);
    res.send(rows);
  } catch (e) {
    throw(e);
  }
}

ParticipantDb.prototype.getParticipantsOrderById = async (req, res) => {
  const text = "SELECT id,name, address, address,primary_phone, alt_phone, alt_phone,email,gender, age, age,bike_type,age_group from participants order by id";
  try {
    const { rows } = await db.query(text);
    res.send(rows);
  } catch (e) {
    throw(e);
  }
}

ParticipantDb.prototype.addParticipant = async (req,res) => {
  const text =  "INSERT INTO Participants(name,address,primary_phone,alt_phone,email,gender,age,bike_type,age_group) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)"
  const params = [req.body.name,req.body.address,req.body.primary_phone,req.body.alt_phone,req.body.email,req.body.gender,req.body.age,req.body.bike_type,req.body.age_group];
  try {
    await db.query(text, params);
    res.send({ success: true });
  } catch (e) {
    throw(e);
  }
}

ParticipantDb.prototype.deleteParticipant = async (req,res) => {
  const text = "DELETE from Participants where id = $1"
  try {
    await db.query(text, [req.params.id]);
    res.send({ success: true });
  } catch (e) {
    throw(e);
  }
}

ParticipantDb.prototype.updateParticipant = async (req,res) => {
  const text = "UPDATE Participants set name = $1,gender = $2,age = $3,bike_type=$4,age_group = $5 where id = $6"
  const params = [req.body.name,req.body.gender,req.body.age,req.body.bike_type,req.body.age_group,req.params.id];
  try {
    await db.query(text, params);
    res.send({ success: true });  
  } catch (e) {
    throw(e);
  }
}

module.exports = ParticipantDb;