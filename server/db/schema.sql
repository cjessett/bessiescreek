CREATE TABLE participants(id integer primary key, name text not null, address text, primary_phone text not null,alt_phone text,email text not null, gender text, age int default 50, bike_type text, age_group int);
CREATE TABLE races(id integer primary key, description text not null,scheduled_date date not null,start_time datetime,end_time datetime);
CREATE TABLE teams(id integer primary key,race_id integer not null,name text not null, gender text);
CREATE TABLE formats(id integer primary key,description text not null);
CREATE TABLE laps(id integer primary key, lap_number integer not null default 1,race_participant_id integer not null, start_time datetime,end_time datetime, miles default 21.3);
CREATE TABLE team_members(id integer primary key,team_id integer not null,participant_id integer not null);
CREATE TABLE Users(id integer primary key,firstName text not null,lastName text not null,userName text not null, password text not null,createdOn datetime);
CREATE TABLE race_participants(id integer primary key,race_id integer not null,participant_id integer,team_id integer,current_lap integer not null default 1,tag integer not null default 1, bike_type text);
CREATE TABLE age_groups (id integer primary key,description text not null);
CREATE TABLE genders (gender text not null,description text not null);

CREATE VIEW vwTeamMembers as select tm.id,tm.participant_id,tm.team_id,t.name TeamName,p.name ParticipantName,t.gender
from team_members tm inner join teams t on tm.team_id = t.id
inner join participants p on tm.participant_id = p.id
/* vwTeamMembers(id,participant_id,team_id,TeamName,ParticipantName,gender) */;
CREATE VIEW vwTeams as select t.id,r.description,t.gender,t.name,r.id race_id from teams t inner join races r
on t.race_id = r.id
/* vwTeams(id,description,gender,name,race_id) */;

CREATE VIEW vwStandings as select rp.id, rp.race_id,r.description race_name, coalesce(p.name, t.name) participant,
rp.current_lap,rp.tag,l.start_time,l.end_time, 
CAST(extract(day from (select l.end_time - l.start_time)) AS TEXT) || 'd:' ||
CAST(extract(hour from (select l.end_time - l.start_time)) AS TEXT) || 'h:' ||
CAST(extract(minute from (select l.end_time - l.start_time)) AS TEXT) || 'm:' ||
CAST(extract(second from (select l.end_time - l.start_time)) AS TEXT) || 's'
total_time,t.id team_id,p.id participant_id
, g.description || ' ' || coalesce(rp.bike_type,p.bike_type) gender_bike_type

,coalesce(p.gender,t.gender) gender
,coalesce(p.age,0) age
,coalesce(ag.description,'') age_group
,coalesce(rp.bike_type,p.bike_type) bike_type
,case
  WHEN CAST(POSITION('511' IN r.description) AS BOOLEAN) then 'Y'
  ELSE 'N'
END distance_race
,l.miles
,case
  WHEN r.end_time is Null then 'N'
  ELSE 'Y'
END race_finished
from race_participants rp
inner join races r on rp.race_id = r.id
left join participants p on rp.participant_id = p.id
left join teams t on rp.team_id = t.id
left join (select race_participant_id,min(start_time) start_time,max(end_time) end_time,sum(CAST (miles AS decimal)) miles
from laps group by  race_participant_id) l on rp.id  = l.race_participant_id
left join age_groups ag on p.age_group = ag.id
left join genders g on p.gender = g.gender
order by rp.current_lap desc, extract(day from (select l.end_time - l.start_time))
/* vwStandings(id,race_id,race_name,participant,current_lap,tag,start_time,end_time,total_time,team_id,participant_id,gender_bike_type,gender,age,age_group,bike_type,distance_race,miles,race_finished) */;