# CS355-Project-01
Database project 01. Select/edit/delete/add a high school. Select/edit/delete/add a team within that specific high school. Select/edit/delete/add players and coaches to rosters within that specific team. 

#MySQL Script 
use mlarson; 

-- Project 01 HIGH SCHOOL SPORT TEAM DATABASE
-- AUTHOR: MACKENZIE LARSON 
-- DATE:4/5/15

-- DROP TABLES IF EXISTS 

DROP TABLE IF EXISTS Roster;
DROP TABLE IF EXISTS CRoster;
DROP TABLE IF EXISTS HSSPORT;
DROP TABLE IF EXISTS Player; 
DROP TABLE IF EXISTS Coach;
DROP TABLE IF EXISTS HS;
 
-- CREATING TABLES 

CREATE TABLE HS(
	HSID INT PRIMARY KEY AUTO_INCREMENT,
	Name VARCHAR(200),
    Address VARCHAR(200)  
    ); 
          
CREATE TABLE Player(
	PlayerID INT PRIMARY KEY AUTO_INCREMENT,
	First_Name VARCHAR(50),
    Last_Name VARCHAR(50),
    HSName VARCHAR(200), 
    Number INT, 
    Age INT, 
    Phone_Num VARCHAR(50), 
    Email VARCHAR(100), 
    Address VARCHAR(200)
    ); 
    
CREATE TABLE Coach(
	CoachID INT PRIMARY KEY AUTO_INCREMENT,
	Name VARCHAR(200), 
    Phone_Num VARCHAR(50), 
    Email VARCHAR(100), 
    Address VARCHAR(200)
    );

CREATE TABLE HSSPORT(
	HSSPORTID INT PRIMARY KEY AUTO_INCREMENT, 
	HSName VARCHAR(200), 
    SportName VARCHAR(200), 
    SportClass VARCHAR(200), 
    SportGender VARCHAR(200)
    );    
    
CREATE TABLE Roster(
	HSTeamID INT, 
    PlayerID INT,
    PRIMARY KEY (HSTeamID, PlayerID),
    FOREIGN KEY (PlayerID) REFERENCES Player(PlayerID), 
    FOREIGN KEY (HSTeamID) REFERENCES HSSPORT(HSSPORTID)
    );
    
CREATE TABLE CRoster(
	HSTeamID INT, 
    CoachID INT, 
    PRIMARY KEY (HSTeamID, CoachID),
    FOREIGN KEY (HSTeamID) REFERENCES HSSPORT(HSSPORTID),
    FOREIGN KEY (CoachID) REFERENCES Coach(CoachID)
    );

-- INSERT SAMPLE DATA 
INSERT INTO HS(Name, Address) VALUES ('CHS', '9870 Broadmoor Dr, San Ramon, CA 94583');
INSERT INTO HS(Name, Address) VALUES ('DVHS', '10550 Albion Rd, San Ramon, CA 94582');
INSERT INTO HS(Name, Address) VALUES ('SRVHS', '501 Danville Blvd, Danville, CA 94526');

INSERT INTO HSSPORT(HSName, SportName, SportClass, SportGender) VALUES ('CHS', 'Volleyball', 'VARSITY', 'Men');
INSERT INTO HSSPORT(HSName, SportName, SportClass, SportGender) VALUES ('CHS', 'Volleyball', 'VARSITY', 'Women');
INSERT INTO HSSPORT(HSName, SportName, SportClass, SportGender) VALUES ('CHS', 'Water Polo', 'VARSITY', 'Women');
INSERT INTO HSSPORT(HSName, SportName, SportClass, SportGender) VALUES ('CHS', 'Water Polo', 'JV', 'Men');

INSERT INTO HSSPORT(HSName, SportName, SportClass, SportGender) VALUES ('DVHS', 'Football', 'VARSITY', 'Men');

INSERT INTO HSSPORT(HSName, SportName, SportClass, SportGender) VALUES ('SRVHS', 'Under water basket weaving', 'VARSITY', 'Men');
 
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('Josh', 'Larson', 'CHS', 17, 16, '925-803-7531', 'jlarson@pacbell.net','520 Columbia Creek Drive');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('Mary', 'Larson', 'CHS', 5, 20, '925-803-7531', 'mlarson@pacbell.net','520 Columbia Creek Drive');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('TEST', 'TESTER', 'CHS', 22, 15, '900-800-0001', 'TESTERMAN@gmail.com','123 Overthere Place');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('TEST2', 'TESTER2', 'CHS', 45, 12, '900-800-0000', 'testerlady@pacbell.net','456 Whatever Ave');

INSERT INTO Roster(PlayerID, HSTeamID) VALUES (1, 1); 
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (2, 1);
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (3, 1); 
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (4, 1);

INSERT INTO Coach(Name, Phone_Num, Email, Address) VALUES ('Mike Hagardy', '900-800-NUMBER', 'mikeisacoach@gmail.com', '123 NYOB Lane'); 
INSERT INTO Coach(Name, Phone_Num, Email, Address) VALUES ('Courtney G', '900-800-Callit', 'courtneyisacoach@gmail.com', '456 Treehouse Place');
INSERT INTO CRoster(CoachID, HSTeamID) VALUES (1, 1); 
INSERT INTO CRoster(CoachID, HSTeamID) VALUES (2, 1); 

INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('Paula', 'Larson', 'CHS', 44, 12, '259-302-7531', 'soemthing@pacbell.net','520 Columbia Creek Drive');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('Mack', 'Larson', 'CHS', 33, 4, '529-803-0009', 'yepp@pacbell.net','520 Columbia Creek Drive');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('TEST3', 'TESTER3', 'CHS', 12, 44, '900-800-0001', 'THISISATEST@gmail.com','123 Overthere Place');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('TEST4', 'TESTER4', 'CHS', 5, 13, '900-800-0567', 'testerperson@pacbell.net','456 Whatever Ave');

INSERT INTO Roster(PlayerID, HSTeamID) VALUES (5, 2); 
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (6, 2);
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (7, 2); 
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (8, 2);

INSERT INTO Coach(Name, Phone_Num, Email, Address) VALUES ('HEAD COACH', '900-800-2000', 'THISISACOACHEXAMPLE@gmail.com', '456 Penny Lane'); 
INSERT INTO Coach(Name, Phone_Num, Email, Address) VALUES ('ASSIST COACH', '900-800-5555', 'WHATISLIFE@gmail.com', '777 Brookside Place');
INSERT INTO CRoster(CoachID, HSTeamID) VALUES (3, 2); 
INSERT INTO CRoster(CoachID, HSTeamID) VALUES (4, 2); 

INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('NAME5', 'BOOPY', 'CHS', 78, 12, '990-302-7531', 'soemthing1@pacbell.net','520 Columbia Creek Drive');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('NAME6', 'SUZIE', 'CHS', 43, 4, '456-803-0009', 'yepp@pacbell.net','520 Columbia Creek Drive');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('NAME7', 'LEROY', 'CHS', 3, 12, '902-800-0001', 'testit@gmail.com','123 Overthere Place');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('NAME8', 'JOHNSON', 'CHS', 5, 53, '900-800-0567', 'tester2person@pacbell.net','456 Whatever Ave');

INSERT INTO Roster(PlayerID, HSTeamID) VALUES (9, 3); 
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (10, 3);
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (11, 3); 
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (12, 3);

INSERT INTO Coach(Name, Phone_Num, Email, Address) VALUES ('another HEAD COACH', '900-800-2100', 'coachesrock@gmail.com', '456 lane'); 
INSERT INTO Coach(Name, Phone_Num, Email, Address) VALUES ('some ASSIST COACH', '900-800-3355', 'whoarewe@gmail.com', '98 Bellview Place');
INSERT INTO CRoster(CoachID, HSTeamID) VALUES (5, 3); 
INSERT INTO CRoster(CoachID, HSTeamID) VALUES (6, 3); 

INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('Charlie', 'THINKING', 'CHS', 78, 12, '990-302-7531', 'sewing1@pacbell.net','520 Columbia Creek Drive');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('Dennis', 'OF FALSE', 'CHS', 43, 4, '456-803-0009', 'woah@pacbell.net','520 Columbia Creek Drive');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('Mac', 'NAMES', 'CHS', 3, 12, '902-800-0001', 'ididathing@gmail.com','123 Overthere Place');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('Dee', 'IS HARD', 'CHS', 5, 53, '900-800-0567', 'yippeee@pacbell.net','456 Whatever Ave');

INSERT INTO Roster(PlayerID, HSTeamID) VALUES (13, 4); 
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (14, 4);
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (15, 4); 
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (16, 4);

INSERT INTO Coach(Name, Phone_Num, Email, Address) VALUES ('COACH TEST', '700-800-2000', 'THISISACOACHEXAMPLE@gmail.com', '456 COACH Lane'); 
INSERT INTO CRoster(CoachID, HSTeamID) VALUES (7, 4); 
 

INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('MAYBE', 'I', 'DVHS', 78, 12, '990-302-7531', 'soemthing1@pacbell.net','520 Columbia Creek Drive');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('SHOULD', 'USE', 'DVHS', 43, 4, '456-803-0009', 'yepp@pacbell.net','520 Columbia Creek Drive');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('REAL', 'NAMES', 'DVHS', 3, 12, '902-800-0001', 'testit@gmail.com','123 Overthere Place');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('NOW', '???', 'DVHS', 5, 53, '900-800-0567', 'tester2person@pacbell.net','456 Whatever Ave');

INSERT INTO Roster(PlayerID, HSTeamID) VALUES (17, 5); 
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (18, 5);
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (19, 5); 
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (20, 5);

INSERT INTO Coach(Name, Phone_Num, Email, Address) VALUES ('COACH TEST2', '720-800-2000', 'THISISACOACHEXAMPLE@gmail.com', '444 COACH Lane'); 
INSERT INTO CRoster(CoachID, HSTeamID) VALUES (8, 5); 

INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('NAH', 'THIS', 'SRVHS', 78, 12, '990-302-7531', 'soemthing1@pacbell.net','520 Columbia Creek Drive');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('HELPS', 'PASS', 'SRVHS', 43, 4, '456-803-0009', 'yepp@pacbell.net','520 Columbia Creek Drive');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('THE', 'TIME', 'SRVHS', 3, 12, '902-800-0001', 'testit@gmail.com','123 Overthere Place');
INSERT INTO Player(First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('VERY', 'TIREEDDDD', 'SRVHS', 5, 53, '900-800-0567', 'tester2person@pacbell.net','456 Whatever Ave');

INSERT INTO Roster(PlayerID, HSTeamID) VALUES (21, 6); 
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (22, 6);
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (23, 6); 
INSERT INTO Roster(PlayerID, HSTeamID) VALUES (24, 6);

INSERT INTO Coach(Name, Phone_Num, Email, Address) VALUES ('COACH TEST3', '700-800-2500', 'COACHEXAMPLE@gmail.com', '7652 COACH Lane'); 
INSERT INTO CRoster(CoachID, HSTeamID) VALUES (9, 6); 

 
