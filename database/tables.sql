CREATE DATABASE toutiao;
USE toutiao;
CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(100) NOT NULL UNIQUE,
    hash VARCHAR(128) NOT NULL,
    avatar_url LONGTEXT,
    PRIMARY KEY (id,username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE news (
	item_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    article_genre VARCHAR(20) NOT NULL,
    single_mode BOOLEAN NOT NULL,
    title VARCHAR(200) NOT NULL,
    behot_time INT NOT NULL,
    source VARCHAR(100) NOT NULL,
    image_url LONGTEXT,
    content LONGTEXT ,
    comments_count INT DEFAULT 0,
    PRIMARY KEY (item_id),
    FOREIGN KEY (source) REFERENCES users(username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

