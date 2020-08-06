-- \? help
-- \c - connect database
-- \d (table-name) list of tables
-- 

CREATE TABLE products (
    id INT PRIMARY KEY, 
    name VARCHAR(50),
    price INT,
    on_sale boolean
);

CREATE TABLE restaurants (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(50) NOT NULL,
    price_range INT NOT NULL check(price_range >= 1 and price_range <= 5)
);

CREATE TABLE reviews (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    restaurant_id  BIGINT NOT NULL REFERENCES restaurants(id),
    name VARCHAR(50) NOT NULL,
    review TEXT NOT NULL,
    rating INT NOT NULL check(rating >=1 and rating <= 5)
);



INSERT INTO restaurants (id, name, location, price_range) VALUES(123, 'Mcdonalds', 'New York', 3);