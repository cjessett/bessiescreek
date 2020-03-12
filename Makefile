seed: drop
	heroku pg:push bessiescreek DATABASE_URL --app bessiescreek
	
drop:
	heroku pg:reset --confirm bessiescreek