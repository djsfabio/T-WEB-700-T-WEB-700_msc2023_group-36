create database if not exists api_db;

/**
 * Create User table
 * @apiDefine Error
 */
create table if not exists api_db.users (
    id int(11) not null auto_increment,
    name varchar(100) not null,
    email varchar(255) not null unique,
    password varchar(255) default null,
    role varchar(20) not null,
    is_active tinyint(1) not null default 0,

    auth_id varchar(255),

    subscribed_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp,

    constraint PK_USER_ID primary key (id)
);

/*
 create crypto_currencies table
*/
create table if not exists api_db.crypto_currencies (
    id int(11) not null auto_increment,
    name varchar(255) not null,
    current_price float not null,
    lower_price float not null,
    highest_price varchar(255),
    picture_url varchar(255),
    visible tinyint(1) not null default 0,

    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp,

    user_id int(11) not null,

    constraint PK_CRYPTO_CURR_ID primary key (id),
    constraint FK_CRYPTO_CURR_ID foreign key (user_id) references api_db.users(id) on delete cascade
);

/*
 create user crypto currencies relationship table
*/
create table if not exists api_db.users_crypto_currencies (
    id int(11) not null auto_increment,
    user_id int(11) not null,
    crypto_currency_id int(11) not null,

    shared tinyint(1) not null default 0,

    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp,

    constraint FK_USER_ID foreign key (user_id) references api_db.users(id) on delete cascade,
    constraint FK_CRYPTO_ID foreign key (crypto_currency_id) references api_db.crypto_currencies(id) on delete cascade,
    constraint PK_USER_CRYPTO_ID primary key (id)
);

/*
 create article table
*/
create table if not exists api_db.articles (
    id int(11) not null auto_increment,
    title varchar(255) not null,
    summary text,
    source varchar(255),
    article_url varchar(255),
    image_url varchar(255),
    visible tinyint(1) not null default 0,

    created_at datetime not null default current_timestamp,
    updated_at datetime not null default current_timestamp,

    user_id int(11) not null,

    constraint PK_ARTICLE_ID primary key (id),
    constraint FK_ARTICLE_USER_ID foreign key (user_id) references api_db.users(id) on delete cascade
);

/*
    Drop all tables
*/
drop table if exists api_db.articles;
drop table if exists api_db.users_crypto_currencies;
drop table if exists api_db.crypto_currencies;
drop table if exists api_db.users;
