DROP TABLE IF EXISTS family CASCADE;
DROP TABLE IF EXISTS member CASCADE;
DROP TABLE IF EXISTS account_member CASCADE;
DROP TABLE IF EXISTS guest_member CASCADE;
DROP TABLE IF EXISTS event CASCADE;
DROP TABLE IF EXISTS period;
DROP TABLE IF EXISTS alert;
DROP TABLE IF EXISTS participation CASCADE;
DROP TABLE IF EXISTS shopping_list CASCADE;
DROP TABLE IF EXISTS shopping_item;
DROP TABLE IF EXISTS tasks_list CASCADE;
DROP TABLE IF EXISTS task;
DROP TYPE IF EXISTS account_member_theme CASCADE;
DROP TYPE IF EXISTS account_member_lang CASCADE;

CREATE TYPE account_member_theme AS ENUM (
    'dark',
    'light'
    );

CREATE TYPE account_member_lang AS ENUM (
    'en',
    'fr'
    );

CREATE TABLE family
(
    id_family              serial PRIMARY KEY,
    name                   varchar NOT NULL,
    color                  varchar NOT NULL,       
    image_content          bytea,
    image_content_type     text,
    invite_code            varchar UNIQUE,
    invite_expiration_date timestamp
);

CREATE TABLE member
(
    id_member          serial PRIMARY KEY,
    name               varchar NOT NULL,
    image_content      bytea,
    image_content_type text,
    color              varchar NOT NULL,
    id_family          int     NOT NULL REFERENCES family (id_family)
);

CREATE TABLE account_member
(
    id_member     int PRIMARY KEY REFERENCES member (id_member) ON DELETE CASCADE,
    email         varchar NOT NULL UNIQUE,
    password_hash varchar NOT NULL,
    lang          account_member_lang  DEFAULT 'fr',
    theme         account_member_theme DEFAULT 'light',
    location      varchar
);

CREATE TABLE guest_member
(
    id_member int PRIMARY KEY REFERENCES member (id_member) ON DELETE CASCADE
);

CREATE TABLE event
(
    id_event    serial PRIMARY KEY,
    name        varchar NOT NULL,
    description varchar,
    color       varchar NOT NULL,
    isVisible   bool    NOT NULL,
    id_family   int     NOT NULL REFERENCES family (id_family) ON DELETE CASCADE
);

CREATE TABLE participation
(
    id_member int REFERENCES member (id_member) ON DELETE CASCADE,
    id_event  int REFERENCES event (id_event) ON DELETE CASCADE,
    PRIMARY KEY (id_member, id_event)
);

CREATE TABLE period
(
    id_period       serial PRIMARY KEY,
    start_date_time timestamp NOT NULL,
    end_date_time   timestamp NOT NULL,
    id_event        int       NOT NULL REFERENCES event (id_event) ON DELETE CASCADE
);

CREATE TABLE alert
(
    id_alert  serial PRIMARY KEY,
    date_time timestamp PRIMARY KEY,
    id_event  int NOT NULL REFERENCES event (id_event) ON DELETE CASCADE
);

CREATE TABLE shopping_list
(
    id_shopping_list serial PRIMARY KEY,
    name             varchar NOT NULL,
    id_family        int     NOT NULL REFERENCES family (id_family) ON DELETE CASCADE
);

CREATE TABLE shopping_item
(
    id_shopping_item serial PRIMARY KEY,
    name             varchar NOT NULL,
    is_checked       bool DEFAULT 'false',
    id_shopping_list int     NOT NULL REFERENCES shopping_list (id_shopping_list) ON DELETE CASCADE
);

CREATE TABLE tasks_list
(
    id_tasks_list serial PRIMARY KEY,
    name          varchar NOT NULL,
    id_family     int     NOT NULL REFERENCES family (id_family) ON DELETE CASCADE
);

CREATE TABLE task
(
    id_task       serial PRIMARY KEY,
    name          varchar NOT NULL,
    description   varchar,
    is_checked    bool DEFAULT 'false',
    id_tasks_list int     NOT NULL REFERENCES tasks_list (id_tasks_list) ON DELETE CASCADE
);
