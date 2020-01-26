const db = require('./db');
const ParticipantDb = function () {};

ParticipantDb.prototype.getParticipants = (req, res) => {
  const text = "SELECT id,name, address, address,primary_phone, alt_phone, alt_phone,email,gender, age, age,bike_type,age_group from participants order by name";
  db.query(text, (err, result) => {
    if (err) console.log(err);
    res.send(result.rows);
  });
}

ParticipantDb.prototype.getParticipantsOrderById = (req, res) => {
  const text = "SELECT id,name, address, address,primary_phone, alt_phone, alt_phone,email,gender, age, age,bike_type,age_group from participants order by id";
  db.query(text, (err, result) => {
    if (err) console.log(err);
    res.send(result.rows);
  });
}

ParticipantDb.prototype.addParticipant = function(req,res) {
  const text =  "INSERT INTO Participants(name,address,primary_phone,alt_phone,email,gender,age,bike_type,age_group) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)"
  const params = [req.body.name,req.body.address,req.body.primary_phone,req.body.alt_phone,req.body.email,req.body.gender,req.body.age,req.body.bike_type,req.body.age_group];
  db.query(text, params, (err, result) => {
    if (err) console.log(err);
    res.send({ success: true });
  });
}


ParticipantDb.prototype.deleteParticipant = function(req,res) {
  const text = "DELETE from Participants where id = $1"
  db.query(text, req.params.id, (err, result) => {
    if (err) console.log(err);
    res.send({ success: true });
  });
}


ParticipantDb.prototype.updateParticipant = function(req,res) {
  const text = "UPDATE Participants set name = $1,gender = $2,age = $3,bike_type=$4,age_group = $5 where id = $6"
  const params = [req.body.name,req.body.gender,req.body.age,req.body.bike_type,req.body.age_group,req.params.id];
  db.query(text, params, (err, result) => {
    if (err) console.log(err);
    res.send({ success: true });
  });
}

module.exports = ParticipantDb;