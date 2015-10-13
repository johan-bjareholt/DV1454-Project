
DROP TABLE IF EXISTS Accounts;

CREATE TABLE IF NOT EXISTS Accounts (
    email VARCHAR(40) NOT NULL PRIMARY KEY,
    password VARCHAR(30) NOT NULL,
    firstname VARCHAR(20) NOT NULL,
    lastname VARCHAR(30) NOT NULL
);

--DROP TABLE IF EXISTS Lodges;

CREATE TABLE IF NOT EXISTS Lodges (
    lodgenr INT NOT NULL PRIMARY KEY,
    adress VARCHAR(50) NOT NULL,
    bedcount INT NOT NULL,
    roomcount INT NOT NULL,
    kitchenstandard INT NOT NULL,
    pricehigh FLOAT NOT NULL,
    pricelow FLOAT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL
);

--DROP TABLE IF EXISTS Orders;

CREATE TABLE IF NOT EXISTS Orders (
    ordernr INT NOT NULL PRIMARY KEY,
    lodgenr INT NOT NULL,
    price FLOAT NOT NULL,
    startdate DATE NOT NULL,
    enddate DATE NOT NULL
);

--DROP TABLE IF EXISTS Customer;

CREATE TABLE IF NOT EXISTS Customer (
    customernr INT NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    birthdate DATE NOT NULL
);

--DROP TABLE IF EXISTS WinterRentals;

CREATE TABLE IF NOT EXISTS WinterRentals (
    wrentalnr INT NOT NULL PRIMARY KEY,
    ordernr INT NOT NULL,
    customernr INT NOT NULL,

    rentalstart DATE NOT NULL,
    rentalend DATE NOT NULL,

    skitype VARCHAR(20) NOT NULL,
    skilength INT NOT NULL,
    skishoesize INT NOT NULL,
    skipolelength INT NOT NULL,
    skihelmetsize INT NOT NULL
);

--DROP TABLE IF EXISTS SummerRentals;

CREATE TABLE IF NOT EXISTS SummerRentals (
    srentalnr INT NOT NULL PRIMARY KEY,
    customernr INT NOT NULL,
    rentalstart DATE NOT NULL,
    rentalend DATE NOT NULL,

    biketype VARCHAR(25) NOT NULL,
    bikebrand VARCHAR(25) NOT NULL,
    bikemodel VARCHAR(25) NOT NULL,
    bikehelmetsize VARCHAR(5) NOT NULL
);

-- Test values
INSERT IGNORE INTO Lodges VALUES
(1001, "Street 1", 3, 2, 3, 100, 50,
"Cottage 1, 3 rooms 3 beds", "A cozy cottage"),
(1002, "Street 2", 4, 5, 3, 100, 50,
"Cottage 2, 4 rooms 5 beds", "A nice cottage"),
(1101, "Street 3", 4, 5, 3, 100, 50,
"Cabin 1, 2 rooms 2 beds", "A cozy cabin");
