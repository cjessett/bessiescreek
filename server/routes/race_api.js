var RaceDb = require('../db/RaceDb');
var raceDb = new RaceDb();

"use strict";
function api_races_get(req, res) {
    raceDb.getRaces(req, res);
}
exports.api_races_get = api_races_get;

function api_races_add(req, res) {
    raceDb.addRace(req, res);
}
exports.api_races_add = api_races_add;

function api_races_update(req, res) {
    console.log('Updating a race');
    raceDb.updateRace(req, res);
}
exports.api_races_update = api_races_update;

function api_races_delete(req, res) {
    console.log('Deleting a race');
    raceDb.deleteRace(req, res);
}
exports.api_races_delete = api_races_delete;


function api_races_start(req, res) {
    console.log('Starting a race');
    raceDb.startRace(req, res);
}
exports.api_races_start = api_races_start;

function api_races_stop(req, res) {
    console.log('Stopping a race');
    raceDb.endRace(req, res);
}
exports.api_races_stop = api_races_stop;

function api_races_add_particiant(req, res) {
    console.log('Adding a Race participant');
    raceDb.addParticipant(req, res);
}
exports.api_races_add_particiant = api_races_add_particiant;

function api_races_delete_particiant(req, res) {
    console.log('Deleting a Race participant');
    raceDb.deleteParticipant(req, res);
}
exports.api_races_delete_particiant = api_races_delete_particiant;

function api_races_get_particiants(req, res) {
    console.log('Getting Race Participants');
    raceDb.getParticipants(req, res);
}
exports.api_races_get_particiants = api_races_get_particiants;

function api_races_get_particiants_orderbytag(req, res) {
    console.log('Getting Race Participants');
    raceDb.getParticipantsOrderByTag(req, res);
}
exports.api_races_get_particiants_orderbytag = api_races_get_particiants_orderbytag;

function api_races_endlap(req, res) {
    console.log('Ending a lap and starting a new one');
    raceDb.endLap(req, res);
}
exports.api_races_endlap = api_races_endlap;

function api_races_get_results(req, res) {
    console.log('Getting Race Results');
    raceDb.getResults(req, res);
}
exports.api_races_get_results = api_races_get_results;