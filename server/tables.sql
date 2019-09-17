

DROP TABLE IF EXISTS characters;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS users_characters;

CREATE TABLE IF NOT EXISTS characters (
	id SERIAL PRIMARY KEY,
	name TEXT,
	art TEXT,
	home_thumbnail TEXT,
	home_sprite TEXT,
	battle_thumbnail TEXT DEFAULT NULL,
	spritesheet TEXT DEFAULT NULL,
	reverse_spritesheet TEXT DEFAULT NULL,
	health INTEGER,
	attack INTEGER,
	description TEXT,
	subtitle TEXT
);

CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	username TEXT,
	password TEXT
);

CREATE TABLE IF NOT EXISTS users_characters (
	id SERIAL PRIMARY KEY,
	character_id INTEGER,
	slot INTEGER DEFAULT NULL,
	user_id INTEGER
);