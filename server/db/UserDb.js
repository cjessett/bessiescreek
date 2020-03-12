var db = require('./db');
var UserDb = function () {};

UserDb.prototype.getUser = async function (req, res) {
  const text = isNaN(req.params.id) ?
    'select id,firstName,lastName,username,password,createdOn from Users where username = $1' :
    'select id,firstName,lastName,username,password,createdOn from Users where id = $1';
  const { rows } = await db.query(text, [req.params.id]);
  res.send(rows[0]);
}

UserDb.prototype.getUsers =  function(req,res) {
    res.send([]);
}

UserDb.prototype.authenticate = async function(req, res) {
  const text = 'select * from users where username = $1 and password = $2';
  const params = [req.body.username, req.body.password];
  
  try {
    const { rows } = await db.query(text, params);
    if (rows[0]) {
      res.send({ success: true });
    } else {
      res.send({ success: false, message: "Username or password is incorrect" });
    }
  } catch (e) {
    throw e;
  }
}

UserDb.prototype.addUser = async function(req,res){
   console.log(`Adding user: ${req.body.username}`);
   let found = false;
   const client = await db.getClient();
   
   try {
     await client.query('BEGIN');
     const text = 'SELECT * FROM users WHERE username = $1';
     const { rows } = await client.query(text, [req.body.username]);
     found = rows && rows[0] && rows[0].id;
     
     if (!found) {
       const createUserText = 'INSERT INTO users(firstName, lastName, username, password, createdOn) VALUES ($1, $2, $3, $4, NOW()) RETURNING id';
       const { firstName, lastName, username, password } = req.body;
       const params = [firstName, lastName, username, password];
       const { rows } = await client.query(createUserText, params);
       await client.query('COMMIT');
       res.send({ success: true, id: rows[0].id });
     }
   } catch (e) {
     await client.query('ROLLBACK');
     throw e
   } finally {
     client.release();
   }
}

module.exports = UserDb;