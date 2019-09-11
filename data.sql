\c jobly

DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees integer,
    description text,
    logo_url text
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title text NOT NULL,
    salary float NOT NULL,
    equity float NOT NULL,
    company_handle text NOT NULL REFERENCES companies ON DELETE CASCADE,
    date_posted date DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT equity_limit CHECK ((equity <= (1)::double precision))
);

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    photo_url text DEFAULT 'http://www.orientjphysicalsciences.org/images/user.jpg',
    is_admin boolean DEFAULT false
);