var db = require('./db');
var UserDb = function () {};

UserDb.prototype.getUser = function(req, res) {
  const text = isNaN(req.params.id) ?
    'select id,firstName,lastName,username,password,createdOn from Users where username = $1' :
    'select id,firstName,lastName,username,password,createdOn from Users where id = $1';
  db.query(text, [req.params.id], (err, result) => {
    if (err) console.log(err);
    console.log(result.rows)
    res.send(result.rows[0]);
  });
}

UserDb.prototype.getUsers =  function(req,res) {
    var retVal = '[]';
    res.end(retVal);
}

UserDb.prototype.authenticate = function(req, res) {
     //console.log('Authenticating user ' + req.body.username );
    var found = false;
    var text = 'select * from users where username = $1 and password = $2';
    const params = [req.body.username, req.body.password];
        
    db.query(text, params, (err, result) => {
      if (err) console.log(err);
      console.log(result.rows[0])
      if (result.rows[0].id) {
        res.send('{"success": true }');
      } else {
        res.send('{"success": false,"message":"Username or password is incorrect" }');
      }
    });
}

UserDb.prototype.addUser = function(req,res){
   console.log('Adding user ' + req.body.username);

    Db.db.serialize(function () {
        var found = false;

        var params = [];
        var query = 'select * from Users where upper(username) = upper(?)';
        var retVal = '{}';

        params.push(req.body.username);

        Db.db.each(query, params, function (err, row) {
            found = true;
        }, function (err, rows) {
            //
        });

        if (!found)
        {
            var stmt = Db.db.prepare("INSERT INTO users(firstName,lastName,username,password,createdOn) VALUES (?,?,?,?,datetime('now','localtime'))");
            stmt.run(req.body.firstName,req.body.lastName,req.body.username,req.body.password);
            stmt.finalize();
            res.send('{"success": true }');
        }
        else
        {
            res.send('{"success": false,"message":"User name is already taken." }');
        }
       
       
    });
}


module.exports = UserDb;