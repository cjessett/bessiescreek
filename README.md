# NodeRace

## Routes
'/'

'/login'

'/register'

'/race'

'/race_participant'

'/race_manager'

'/race_results'

'/race_results_public'

'/team'

'/team_member'

'/format'

 '/participant'

 '/lap'

'/lap_report'


#### DB

Reset db
```
heroku pg:reset
```

Push local db
```
heroku pg:push bessiescreek DATABASE_URL --app bessiescreek
```

Change primary key from `INT` to `SERIAL`
```
CREATE SEQUENCE race_id_seq MINVALUE <last ID from races>;
ALTER TABLE test ALTER id SET DEFAULT nextval('race_id_seq');

INSERT INTO races(description, scheduled_date) VALUES ('race name', '2020-04-05');
```


```
CREATE OR REPLACE FUNCTION changeIdToSerial (table_name VARCHAR)
RETURNS integer AS $$
DECLARE 
  seq_id varchar;
  max_id varchar;
BEGIN
  EXECUTE format('%I_id_seq', table_name) INTO seq_id;
  EXECUTE format('SELECT MAX(id) FROM %I', table_name) INTO max_id;
  EXECUTE 'CREATE SEQUENCE $1 MINVALUE $2' USING seq_id, max_id;
  ALTER TABLE table_name ALTER id SET DEFAULT nextval(seq_id);
END;
$$
LANGUAGE plpgsql;
```