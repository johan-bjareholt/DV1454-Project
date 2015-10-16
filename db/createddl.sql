DROP TABLE IF EXISTS SummerRentals;
DROP TABLE IF EXISTS WinterRentals;

 DROP TABLE IF EXISTS Orders;

DROP TABLE IF EXISTS Accounts;
DROP TABLE IF EXISTS Lodges;

CREATE TABLE IF NOT EXISTS Accounts (
    email VARCHAR(40) NOT NULL PRIMARY KEY,
    password VARCHAR(30) NOT NULL,
    firstname VARCHAR(20) NOT NULL,
    lastname VARCHAR(30) NOT NULL
);

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

CREATE TABLE IF NOT EXISTS Orders (
    ordernr INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(40) NOT NULL,
    FOREIGN KEY (email) REFERENCES Accounts(email),
    lodgenr INT NOT NULL,
    FOREIGN KEY (lodgenr) REFERENCES Lodges(lodgenr),
    price FLOAT NOT NULL,
    startweek INT NOT NULL,
    endweek INT NOT NULL
);

CREATE TABLE IF NOT EXISTS WinterRentals (
    wrentalnr INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    ordernr INT NOT NULL,
    FOREIGN KEY (ordernr) REFERENCES Orders(ordernr),

    startweek INT NOT NULL,
    endweek INT NOT NULL,

    skitype VARCHAR(20) NOT NULL,
    skilength INT NOT NULL,
    skishoesize INT NOT NULL,
    skipolelength INT NOT NULL,
    skihelmetsize INT NOT NULL
);

CREATE TABLE IF NOT EXISTS SummerRentals (
    srentalnr INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    ordernr INT NOT NULL,
    FOREIGN KEY (ordernr) REFERENCES Orders(ordernr),

    startweek INT NOT NULL,
    endweek INT NOT NULL,

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
