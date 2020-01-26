var Db = require('./db');
var FormatDb = function () { };

FormatDb.prototype.getFormats = function (req,res) {
    var data = '[';
    var i = 0;
    Db.db.each("SELECT id,description from formats", function (err, row) {
        if (err) console.log(err);
        if (i > 0) { data = data + ","; } i++;
        data = data + '{"id": ' + row.id + ',"description":"' + row.description + '"}';
    }, function (err, rows) { data = data + ']'; res.send(data); });
}

FormatDb.prototype.addFormat = function (req,res) {
    var stmt = Db.db.prepare("INSERT INTO formats(description) VALUES (?)");
    stmt.run(req.body.description, res.send('{"success": true }'));
}

FormatDb.prototype.updateFormat = function (req,res) {

    var stmt = Db.db.prepare("UPDATE formats set description=? where id = ?");
    console.log(req.body.description + ',' + req.params.id);
    stmt.run(req.body.description,req.params.id, res.send('{"success": true }'));
}

FormatDb.prototype.removeFormat = function(req,res){
    var stmt = Db.db.prepare("delete from formats where id = ?");
    stmt.run(req.params.id, res.send('{"success": true }'));
}

module.exports = FormatDb;