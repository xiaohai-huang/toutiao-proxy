CREATE TABLE news (
	item_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    article_genre VARCHAR(20) NOT NULL,
    single_mode BOOLEAN NOT NULL,
    title VARCHAR(200) NOT NULL,
    behot_time INT NOT NULL,
    source VARCHAR(100) NOT NULL,
    image_url LONGTEXT,
    media_avatar_url TEXT,
    content LONGTEXT ,
    comments_count INT DEFAULT 0,
    PRIMARY KEY (item_id)
);

CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
	username VARCHAR(45) NOT NULL UNIQUE,
    hash VARCHAR(60) NOT NULL,
    avatar_url TEXT,
    PRIMARY KEY (id)
);