/***************
AUTHOR: Mackenzie Larson
DATE: 4/6/15

PROJECT 01:
HIGH SCHOOL SPORT TEAM DATABASE PROJECT
* CREATE/EDIT/DELETE/SELECT A HIGH SCHOOL
* CREATE/EDIT/DELETE/SELECT A SPORT WITHIN A SPECIFIC HIGH SCHOOL
* CREATE/EDIT/DELETE/SELECT A PLAYER WITHIN A SPECIFIC SPORT WITHIN A SPECIFIC HIGH SCHOOL
* CREATE/EDIT/DELETE/SELECT A COACH WITHIN A SPECIFIC SPORT WITHIN A SPECIFIC HIGH SCHOOL
*****************/


// Module dependencies

var express    = require('express'),
    mysql      = require('mysql');

// Application initialization

var connection = mysql.createConnection({
    host     : 'cwolf.cs.sonoma.edu',
    user     : 'mlarson',
    password : '3913707'
});

var app = module.exports = express.createServer();

// Database setup

connection.query('USE mlarson', function (err) {
    if (err) throw err;
});

// Configuration

app.use(express.bodyParser());

// Main page with two links to view the table and drop down menu

var htmlHeader = '<html><head><title>Project 01</title></head><body>';
var htmlFooter = '</body></html>';

function handleError(res, error) {
    console.log(error);
    res.send(error.toString());
}

function buildUserViewHS(result) {

    // Build the HTML table from the data in the HS table
    var responseHTML = htmlHeader + '<h1>High School Information</h1>';

    //Dynamic populating rows from the records returned
    for (var i=0; i < result.length; i++) {
        responseHTML += '<ul><li>Name: ' + result[i].Name + '</li>' +
            '<li>Address: ' + result[i].Address + '</li></ul>'
    }

    responseHTML += htmlFooter;

    return responseHTML;
}

//HOME PAGE
app.get('/', function(req, res) {
    req.query.name
    res.send('<html><head><title>Project 01</title></head><body>' +
            '<h1>Mackenzie Larson CS355 Project 01</h1>' +
                 '<h2>High school sports teams database. Select a high school and view sport teams at that school. Then select a team and view player and coach information.</h2>' +
            '<a href="/highschool/add">Add a High School</a><br />' +
            '<a href="/highschool/edit">Edit a High School</a><br />' +
            '<a href="/highschool/delete">Remove a High School</a><br />' +
            '<a href="/highschool/dropdown">Select a High School</a><br />' +
             '</body></html>'
    );
 });

//ADD A HIGHSCHOOL
app.get('/highschool/add', function(req, res) {
     var responseHTML = htmlHeader;

    responseHTML += '<h1>Add a High School</h1>' +
        '<form action="/highschool/insert" method="GET">' +
        '<input type="hidden" name="HSID" id="HSID" />' +
        '<label for="name">Name</label> <input type="text" name="name" id="name" /><br />' +
        '<label for="name">Address</label> <input type="text" name="address" id="address" /><br />' +
        '<input type="submit" />' +
        '</form>';

    responseHTML += htmlFooter;
    res.send(responseHTML);

});

//INSERT A HIGHSCHOOL
app.get('/highschool/insert', function(req,res) {
    var myQry= 'INSERT INTO HS(Name,Address) VALUES (' +
        '\'' + req.query.name + '\', ' +
        '\'' + req.query.address + '\'' +
        ')';

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
             else {
                connection.query('SELECT * FROM HS WHERE HSID = ' + result.insertId,
                    function (err, result) {
                        if (err) {
                            handleError(res, err);
                        }
                        else if(result.length == 1) {
                            res.send(buildUserViewHS(result));
                        }
                        else {
                            res.send('No info found for that highschool.');
                        }
                    });
            }
        }
    );

});

//SELECT A HIGHSCHOOL TO BE EDITED
app.get('/highschool/edit', function (req, res) {

  var myQry = 'SELECT * FROM HS';

  console.log(myQry);

  connection.query(myQry,
        function (err, result) {
            if (err) {
              console.log(err);
                      throw err;
                      res.send('An error occured');

            }
            else {
              // Build the HTML table from the data in the Student table
              var responseHTML = '<h1>Select a High School to be Edited</h1>';
              responseHTML += '<form method="GET" action="/hs/edit">';
              responseHTML += 'Select a High School: <select name="name" id="name">';

              //Dynamic populating rows from the records returned
              for (var i=0; i < result.length; i++) {
                responseHTML += '<option value="' + result[i].Name + '">' + result[i].Name + '</option>';
              }

              responseHTML += '</select>';
              responseHTML += '&nbsp;<input type="submit" />';
              responseHTML += '</form>';
              res.send(responseHTML);
            }
        }
    );
});


//EDIT A HS
app.get('/hs/edit', function(req,res) {
 var myQry = 'SELECT * FROM HS WHERE Name= "' + req.query.name + '"';

    console.log(myQry);

    connection.query(myQry, function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {

                // Build the HTML table from the data in the Student table
                var responseHTML = htmlHeader + '<h1>Edit High School Information</h1>';

                responseHTML += '<form action="/hs/update" method="GET">';
                //Dynamic populating rows from the records returned
                if (result.length == 1) {

                    //using an inline or ternary if to replace null with an empty string, otherwise null
                    //will appear in the input field
                    var location = (result[0].Location == null) ? '' : result[0].Location;

                    responseHTML += 'HS Name: <input type="text" name="name" id="name" value="' + result[0].Name + '" /><br />' +
                        'Address: <input type="text" name="address" id="address" value="' + result[0].Address + '" /><br />' +
                        '<input type="hidden" name="HSID" id="HSID" value="' + result[0].HSID + '" />' +
                        '<input type="submit" />' +
                        '</form>' +
                        htmlFooter;

                    res.send(responseHTML);
                }
                else {
                    res.send('More than one record was returned.')
                }
            }
        }
    );
});

//UPDATE A HIGHSCHOOL
app.get('/hs/update', function (req, res) {

    var myQry = 'UPDATE HS SET Name="' + req.query.name +
       '", Address="' + req.query.address  + '" WHERE HSID=' + req.query.HSID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM HS WHERE Name= "' + req.query.name + '"',
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send('An error occurred');
                        }
                        if(result.length == 1) {

                            res.send('<p>High school updated!</p><p><a href="/">Back </a></p>');

                        }
                        else {
                            res.send('No course found for that courseID.');
                        }
                    });
            }
        }
    );
});



//SELECT A HIGHSCHOOL TO BE DELETED
app.get('/highschool/delete', function (req, res) {

  var myQry = 'SELECT * FROM HS';

  console.log(myQry);

  connection.query(myQry,
        function (err, result) {
            if (err) {
              console.log(err);
                      throw err;
                      res.send('An error occured');

            }
            else {
              // Build the HTML table from the data in the Student table
              var responseHTML = '<h1>Remove a High School</h1>';
              responseHTML += '<form method="GET" action="/hs/remove">';
              responseHTML += 'Select a High School: <select name="name" id="name">';

              //Dynamic populating rows from the records returned
              for (var i=0; i < result.length; i++) {
                responseHTML += '<option value="' + result[i].Name + '">' + result[i].Name + '</option>';
              }

              responseHTML += '</select>';
              responseHTML += '&nbsp;<input type="submit" />';
              responseHTML += '</form>';
              res.send(responseHTML);
            }
        }
    );
});

//REMOVE A HS
app.get('/hs/remove', function (req, res) {

    var myQry = 'DELETE FROM HS WHERE Name= "' + req.query.name + '"';


    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                res.send('The High School ' + req.query.name + ' was successfully deleted.');
            }
        }
    );
});

//SELECT A HIGHSCHOOL FROM A DROP DOWN MENU
app.get('/highschool/dropdown', function (req, res) {

  var myQry = 'SELECT * FROM HS';

  console.log(myQry);

  connection.query(myQry,
        function (err, result) {
            if (err) {
              console.log(err);
                      throw err;
                      res.send('An error occured');

            }
            else {
              // Build the HTML table from the data in the Student table
              var responseHTML = '<h1>Select a high school to view sport teams</h1>';
              responseHTML += '<form method="GET" action="/hs/table">';
              responseHTML += 'Select a high school: <select name="name" id="name">';

              //Dynamic populating rows from the records returned
              for (var i=0; i < result.length; i++) {
                responseHTML += '<option value="' + result[i].Name + '">' + result[i].Name + '</option>';
              }

              responseHTML += '</select>';
              responseHTML += '&nbsp;<input type="submit" />';
              responseHTML += '</form>';
              res.send(responseHTML);
            }
        }
    );
});

// VIEW A HIGHSCHOOL
app.get('/hs/table', function (req, res) {

  var myQry = 'SELECT * FROM HS WHERE Name= "' + req.query.name + '"';
  var responseHTML;
  console.log(myQry);

  connection.query(myQry,
        function (err, result) {
            if (err) {
              console.log(err);
                      throw err;
                      res.send('An error occured');

            }
            else {
              // Build the HTML table from the data in the Student table
              responseHTML = '<h1>' + result[0].Name + ' Information</h1>';

              //Dynamic populating rows from the records returned
              for (var i=0; i < result.length; i++) {
                responseHTML += '<ul><li>Highschool Name: ' + result[i].Name + '</li><li>Address: ' + result[i].Address + '</li></ul>'
              }
            }

        });
     var myQry = 'SELECT * FROM HSSPORT WHERE HSName = "' + req.query.name + '"';

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                // Build the HTML table from the data in the Student table
                responseHTML += '<table border=1>' +
                    '<th>Name</th>' +
                    '<th>Class</th>' +
                    '<th>Gender</th>' +
                    '<th><!-- More Info Column --></th>' +
                    '<th><!-- Edit Info Column --></th>' +
                    '<th><!-- Delete Col --></th>' +
                    '</tr>';

                //Dynamic populating rows from the records returned
                for (var i=0; i < result.length; i++) {
                    responseHTML +=
                        '<td>' + result[i].SportName + '</td>' +
                        '<td>' + result[i].SportClass + '</td>' +
                        '<td>' + result[i].SportGender + '</td>' +
                        '<td><a href="/sport/teaminfo?HSSPORTID=' + result[i].HSSPORTID + '">View Team Info</a>' +
                        '<td><a href="/sport/edit?HSSPORTID=' + result[i].HSSPORTID + '">Edit Sport</a>' +
                        '<td><a href="/sport/delete?HSSPORTID=' + result[i].HSSPORTID + '">Delete Sport</a>' +
                        '</tr>'
                }

                responseHTML += '</table>';
                responseHTML += '<a href="/sport/add">Add a Sport</a><br />';
                res.send(responseHTML);
            }
        });

});


//ADD SPORT
app.get('/sport/add', function(req,res){
 var responseHTML = htmlHeader;

    responseHTML += '<h1>Add a Sport</h1>' +
        '<h2>When adding a sport, make sure the high school that you enter matches the name of the high school exactly that you want the sport inserted into!</h2>' +
        '<form action="/sport/insert" method="GET">' +
        '<input type="hidden" name="HSID" id="HSID" />' +


        '<label for="name">HS Name</label> <input type="text" name="HSName" id="HSName" /><br />' +
        '<label for="name">Sport Name</label> <input type="text" name="SportName" id="SportName" /><br />' +
        '<label for="name">Class Name</label> <input type="text" name="ClassName" id="ClassName" /><br />' +
        '<label for="name">Gender Name</label> <input type="text" name="GenderName" id="GenderName" /><br />' +

        '<input type="submit" />' +
        '</form>';

    responseHTML += htmlFooter;
    res.send(responseHTML);

});


// Insert INTO HSSPORT
app.get('/sport/insert', function(req, res) {
    var qry = 'INSERT INTO HSSPORT (HSName, SportName, SportClass, SportGender) VALUES ('
        + '\'' + req.query.HSName + '\', '
        + '\'' + req.query.SportName + '\', '
        + '\'' + req.query.ClassName + '\', '
        + '\'' + req.query.GenderName + '\')';

    console.log(qry);

    connection.query(qry,req.query, function(err, result) {
        if(err) {
            handleError(res, err);
        }
        else {
            //After inserting the grade forward to the list of grades rout

            res.send('<p>Sport added!</p><p><a href="/">Back </a></p>');

        }
    });
});



//EDIT A SPORT
app.get('/sport/edit', function (req, res) {
    var myQry = 'SELECT * from HSSPORT WHERE HSSPORTID= ' + req.query.HSSPORTID;
    console.log(myQry);
    connection.query(myQry, function (err, result) {
        if (err) {
            handleError(res, err);
            }
        else {
            var responseHTML = htmlHeader + '<h1>Edit Sport Info</h1>';

            responseHTML += '<form action="/sport/update" method="GET">';
            if (result.length == 1) {
                var location = (result[0].Location == null) ? '' : result[0].Location;
                responseHTML += 'HS Name: <input type="text" name="name" id="name" value="' + result[0].HSName + '" /><br />' +
                    'Sport Name: <input type="text" name="sname" id="sname" value="' + result[0].SportName + '" /><br />' +
                    'Sport Class: <input type="text" name="sclass" id="sclass" value="' + result[0].SportClass + '" /><br />' +
                    'Sport Gender: <input type="text" name="sgender" id="sgender" value="' + result[0].SportGender + '" /><br />' +
                        '<input type="hidden" name="HSSPORTID" id="HSSPORTID" value="' + result[0].HSSPORTID + '" />' +
                        '<input type="submit" />' +
                        '</form>' +
                        htmlFooter;

                    res.send(responseHTML);
                }
                else {
                    res.send('More than one record was returned.')
                }
            }
        }
    );
});

// Update SPORT
app.get('/sport/update', function (req, res) {

    var myQry = 'UPDATE HSSPORT SET HSName="' + req.query.name +
       '", SportName="' + req.query.sname  + '", SportClass="' + req.query.sclass  + '", SportGender="' + req.query.sgender  + '" WHERE HSSPORTID=' + req.query.HSSPORTID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM HSSPORT WHERE HSName= "' + req.query.name + '"',
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send('An error occurred');
                        }
                        //if(result.length == 1) {
                        else {
                            res.send('The sport, ' + req.query.sname + ' was successfully updated!');
                        }
                        //else {
                          //  res.send('No sport found for that sportID.');
                       //x }
                    });
            }
        }
    );
});



//REMOVE A SPORT
app.get('/sport/delete', function (req, res) {

    var myQry = 'DELETE FROM HSSPORT WHERE SportName= "' + req.query.SportName + '"';


    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                res.send('The sport ' + req.query.SportName + ' was successfully deleted.');
            }
        }
    );
});



//MORE INFO ABOUT A SPORT
app.get('/sport/teaminfo', function (req, res) {
    var RosterQry = 'SELECT p.*, h.*, r.* FROM HSSPORT as h left join Roster as r  on h.HSSPORTID= r.HSTeamID left JOIN Player as p ON r.PlayerID= p.PlayerID WHERE h.HSSPORTID =' + req.query.HSSPORTID;
    var responseHTML = htmlHeader;
    var HSTeamID;
    var PlayerID;
    connection.query(RosterQry, function(err, PlayerInfo){
        if(err){
            console.log(err);
            res.send("Something bad happened");
        }



        else{
            HSTeamID = req.query.HSSPORTID;
            responseHTML +=
                '<h1>' + PlayerInfo[0].HSName + ' ' + PlayerInfo[0].SportName + ' ' + PlayerInfo[0].SportClass + ' Roster</h1>' +
                '<table border=1>' +
                '<th>First Name</th>' +
                '<th>Last Name</th>' +
                '<th>High School</th>' +
                '<th>Number</th>' +




                '<th><!-- Edit Info Column --></th>' +
                '<th><!-- VIEW MORE COL --></th>' +
                '<th><!-- Delete Column --></th>' +
                '</tr>';

            for (var i=0; i < PlayerInfo.length; i++) {
                    responseHTML +=
                    '<tr><td>' + PlayerInfo[i].First_Name + '</td>' +
                    '<td>' + PlayerInfo[i].Last_Name + '</td>' +
                    '<td>' + PlayerInfo[i].HSName + '</td>' +
                    '<td>' + PlayerInfo[i].Number + '</td>' +




                    '<td><a href="/player/edit?HSTeamID=' + HSTeamID + '&PlayerID=' + PlayerInfo[i].PlayerID +'">Edit Player</a></td>' +
                    '<td><a href="/player/viewmore?HSTeamID=' + HSTeamID + '&PlayerID=' + PlayerInfo[i].PlayerID +'">View More</a></td>' +
                    '<td><a href="/player/delete?HSTeamID=' + HSTeamID + '&PlayerID=' + PlayerInfo[i].PlayerID + '">Delete Player</a></td>' +
                    '</tr>'
                }

        }
        responseHTML += '</table>' +
        '<a href="/player/add/?HSTeamID=' + HSTeamID + '">Add to Player Roster</a><br />';
//COACH TABLE BELOW
        var RosterQry = 'SELECT c.*, h.*, cr.* FROM HSSPORT as h left join CRoster as cr on h.HSSPORTID= cr.HSTeamID left JOIN Coach as c ON cr.CoachID= c.CoachID WHERE h.HSSPORTID =' + req.query.HSSPORTID;

        var HSTeamID;
        var CoachID;
        connection.query(RosterQry, function(err, CoachInfo){
            if(err){
                console.log(err);
                res.send("Something bad happened");
            }

            else{
                HSTeamID = req.query.HSSPORTID;
                responseHTML +=
                '<h1>Coach Roster</h1>' +
                '<table border=1>' +
                '<th>Name</th>' +
                '<th>Phone</th>' +
                '<th><!-- Edit Info Column --></th>' +
                '<th><!-- VIEW MORE COL --></th>' +
                '<th><!-- Delete Column --></th>' +
                '</tr>';
                for (var i=0; i < CoachInfo.length; i++) {
                    responseHTML +=
                    '<tr><td>' + CoachInfo[i].Name + '</td>' +
                    '<td>' + CoachInfo[i].Phone_Num + '</td>' +
                    '<td><a href="/coach/edit?HSTeamID=' + HSTeamID + '&CoachID=' + CoachInfo[i].CoachID +'">Edit Coach</a></td>' +
                    '<td><a href="/coach/viewmore?HSTeamID=' + HSTeamID + '&CoachID=' + CoachInfo[i].CoachID +'">View More</a></td>' +
                    '<td><a href="/coach/delete?HSTeamID=' + HSTeamID + '&CoachID=' + CoachInfo[i].CoachID + '">Delete Coach</a></td>' +
                    '</tr>'
                }

            }
            responseHTML += '</table>' +
                '<a href="/coach/add/?HSTeamID=' + HSTeamID + '">Add to Coach Roster</a><br />' + htmlFooter;



            res.send(responseHTML);
        });

    });
});

//ADD A COACH
app.get('/coach/add', function (req, res) {
var responseHTML = htmlHeader;
    console.log(req.query.HSTeamID);
    responseHTML += '<h1>Add a Coach</h1>' +
        '<form action="/coach/insert" method="GET">' +
        '<input type="hidden" name="HSTeamID" id= "HSTeamID" value=' + req.query.HSTeamID + ' />' +
        '<label for="name">Name</label> <input type="text" name="name" id="name" /><br />' +
        '<label for="name">Phone</label> <input type="text" name="phone" id="phone" /><br />' +
        '<label for="name">Email</label> <input type="text" name="email" id="email" /><br />' +
         '<label for="name">Address</label> <input type="text" name="address" id="address" /><br />' +
        '<input type="submit" />' +
        '</form>';

    responseHTML += htmlFooter;
    res.send(responseHTML);

});

// Insert A COACH
app.get('/coach/insert', function(req, res) {
    var qry = 'INSERT INTO Coach (Name, Phone_Num, Email, Address) VALUES ('
        + '"' + req.query.name + '", '
        + '"' + req.query.phone + '", '
        + '"' + req.query.email + '", '
        + '"' + req.query.address + '")';
    var CoachID;
    console.log(qry);

    connection.query(qry, function(err, result) {
        if(err) {
            handleError(res, err);
        }
        else {
            var Coachqry = 'SELECT * FROM Coach WHERE Name = "' + req.query.name + '"';
            console.log(Coachqry);
            connection.query(Coachqry, function(err, coachinfo){
                if(err){
                    handleError(res, err);
                }
                else{
                    console.log(coachinfo[0].CoachID);
                    CoachID = coachinfo[0].CoachID;
                    res.redirect('/Croster/insert/?HSTeamID=' + req.query.HSTeamID + '&CoachID=' + CoachID);

                    }
            });
        }
    });
});

//INSERT A COACH INTO CROSTER
app.get('/Croster/insert', function(req, res) {
    var RosterQry = 'INSERT INTO CRoster (CoachID, HSTeamID) VALUES ('
        + req.query.CoachID + ', '
        + req.query.HSTeamID + ')';

    connection.query(RosterQry, function(err, result) {
        if(err) {
            handleError(res, err);
        }
        else {
            res.send('Coach inserted');
        }
    });
});

//DELETE A COACH
app.get('/coach/delete', function (req, res) {

    var myQry = 'DELETE FROM CRoster WHERE CoachID= ' + req.query.CoachID + ' and HSTeamID =' + req.query.HSTeamID;


    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                res.send('The coach was successfully deleted.');
            }
        }
    );
});

//EDIT A COACH
app.get('/coach/edit', function (req, res) {
    var myQry=  'SELECT * FROM CRoster JOIN Coach on CRoster.CoachID=Coach.CoachID WHERE CRoster.CoachID= ' + req.query.CoachID + ' and CRoster.HSTeamID=' + req.query.HSTeamID;
    console.log(myQry);
    connection.query(myQry, function (err, result) {
        if (err) {
            handleError(res, err);
            }
        else {
            var responseHTML = htmlHeader + '<h1>Edit Coach Information</h1>';

            responseHTML += '<form action="/coach/update" method="GET">';
            if (result.length == 1) {
                var location = (result[0].Location == null) ? '' : result[0].Location;
                responseHTML +=
                    'Name: <input type="text" name="name" id="name" value="' + result[0].Name + '" /><br />' +
                    'Phone: <input type="text" name="phone" id="phone" value="' + result[0].Phone_Num + '" /><br />' +
                    'Email: <input type="text" name="email" id="email" value="' + result[0].Email + '" /><br />' +
                    'Address: <input type="text" name="address" id="address" value="' + result[0].Address + '" /><br />' +


                '<input type="hidden" name="CoachID" id="CoachID" value="' + result[0].CoachID + '" />' +
                        '<input type="submit" />' +
                        '</form>' +
                        htmlFooter;

                    res.send(responseHTML);
                }
                else {
                    res.send('More than one record was returned.')
                }
            }
        }
    );
});

//UPDATE A COACH
app.get('/coach/update', function (req, res) {

    var myQry = 'UPDATE Coach SET Name="' + req.query.name +
        '", Phone_Num="' + req.query.phone  +
        '", Email="' + req.query.email +
        '", Address="' + req.query.address  +
        '" WHERE CoachID=' + req.query.CoachID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM Coach WHERE CoachID= "' + req.query.CoachID + '"',
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send('An error occurred');
                        }
                        if(result.length == 1) {
                            res.send('Coach updated!');
                        }
                        else {
                            res.send('No Coach  FOUND FOR THAT ID.');
                        }
                    });
            }
        }
    );
});

//VIEW MORE OF A COACH
app.get('/coach/viewmore', function (req, res) {
var myQry = 'SELECT * FROM CRoster WHERE CoachID= ' + req.query.CoachID + ' and HSTeamID=' + req.query.HSTeamID;
  var responseHTML;
  console.log(myQry);

  connection.query(myQry,
        function (err, result) {
            if (err) {
              console.log(err);
                      throw err;
                      res.send('An error occured');

            }
            else {

        var myQry = 'SELECT c.*, h.*, cr.* FROM CRoster as cr JOIN Coach as c ON cr.CoachID= c.CoachID JOIN HSSPORT as h ON cr.HSTeamID=h.HSSPORTID WHERE c.CoachID= ' + req.query.CoachID;

             var responseHTML;
                 console.log(myQry);

                connection.query(myQry,
                                 function (err, result) {
                                     if (err) {
                                         console.log(err);
                                         throw err;
                                         res.send('An error occured');

                                     }
                                     else{
                                         responseHTML = '<h1>' + result[0].Name + ' Information</h1>';

                                         for (var i=0; i < result.length; i++) {
                                             responseHTML += '<ul><li>Name: ' + result[i].Name +
                                                 '</li><li>Phone: ' + result[i].Phone_Num +
                                                 '</li><li>Email: ' + result[i].Email +
                                                 '</li><li>Address: ' + result[i].Address + '</li></ul>'
                                         }
                                         res.send(responseHTML);
                                     }

                                 });
            }
        });
});


//ADD A PLAYER
app.get('/player/add', function (req, res) {
var responseHTML = htmlHeader;
    console.log(req.query.HSTeamID);
    responseHTML += '<h1>Add a PLAYER</h1>' +
        '<form action="/player/insert" method="GET">' +
        '<input type="hidden" name="HSTeamID" id= "HSTeamID" value=' + req.query.HSTeamID + ' />' +
        '<label for="name">First Name</label> <input type="text" name="FName" id="FName" /><br />' +
        '<label for="name">Last Name</label> <input type="text" name="LName" id="LName" /><br />' +
        '<label for="name">HS Name</label> <input type="text" name="HSName" id="HSName" /><br />' +
         '<label for="name">Number</label> <input type="text" name="number" id="number" /><br />' +
         '<label for="name">Age</label> <input type="text" name="age" id="age" /><br />' +
         '<label for="name">Phone Num</label> <input type="text" name="phone" id="phone" /><br />' +
         '<label for="name">Email</label> <input type="text" name="email" id="email" /><br />' +
         '<label for="name">Address</label> <input type="text" name="address" id="address" /><br />' +
        '<input type="submit" />' +
        '</form>';

    responseHTML += htmlFooter;
    res.send(responseHTML);

});
// Insert INTO PLAYER
app.get('/player/insert', function(req, res) {
    var qry = 'INSERT INTO Player (First_Name, Last_Name, HSName, Number, Age, Phone_Num, Email, Address) VALUES ('
        + '"' + req.query.FName + '", '
        + '"' + req.query.LName + '", '
        + '"' + req.query.HSName + '", '
        + '"' + req.query.number + '", '
        + '"' + req.query.age + '", '
        + '"' + req.query.phone + '", '
        + '"' + req.query.email + '", '
        + '"' + req.query.address + '")';
    var PlayerID;
    console.log(qry);

    connection.query(qry, function(err, result) {
        if(err) {
            handleError(res, err);
        }
        else {
            var Playerqry = 'SELECT * FROM Player WHERE First_Name = "' + req.query.FName + '" AND Last_Name = "' + req.query.LName + '"';
            console.log(Playerqry);
            connection.query(Playerqry, function(err, playerinfo){
                if(err){
                    handleError(res, err);
                }
                else{
                    console.log(playerinfo[0].PlayerID);
                    PlayerID = playerinfo[0].PlayerID;
                    res.redirect('/roster/insert/?HSTeamID=' + req.query.HSTeamID + '&PlayerID=' + PlayerID);

                    }
            });
        }
    });
});

app.get('/roster/insert', function(req, res) {
    var RosterQry = 'INSERT INTO Roster (PlayerID, HSTeamID) VALUES ('
        + req.query.PlayerID + ', '
        + req.query.HSTeamID + ')';

    connection.query(RosterQry, function(err, result) {
        if(err) {
            handleError(res, err);
        }
        else {
            res.send('Player inserted.');
        }

    });
});


//EDIT A PLAYER
app.get('/player/edit', function (req, res) {
    var myQry = 'SELECT * FROM Roster JOIN Player on Roster.PlayerID=Player.PlayerID WHERE Roster.PlayerID= ' + req.query.PlayerID + ' and Roster.HSTeamID=' + req.query.HSTeamID;
    console.log(myQry);
    connection.query(myQry, function (err, result) {
        if (err) {
            handleError(res, err);
            }
        else {
            var responseHTML = htmlHeader + '<h1>Edit Player Info</h1>';

            responseHTML += '<form action="/player/update" method="GET">';
            if (result.length == 1) {
                var location = (result[0].Location == null) ? '' : result[0].Location;
                responseHTML +=
                    'First Name: <input type="text" name="fname" id="fname" value="' + result[0].First_Name + '" /><br />' +
                    'Last Name: <input type="text" name="lname" id="lname" value="' + result[0].Last_Name + '" /><br />' +
                    'HS Name: <input type="text" name="hsname" id="hsname" value="' + result[0].HSName + '" /><br />' +
                    'Number: <input type="text" name="number" id="number" value="' + result[0].Number + '" /><br />' +
                    'Age: <input type="text" name="age" id="age" value="' + result[0].Age + '" /><br />' +
                    'Phone Number: <input type="text" name="phone" id="phone" value="' + result[0].Phone_Num + '" /><br />' +
                    'Email: <input type="text" name="email" id="email" value="' + result[0].Email + '" /><br />' +
                    'Addresss: <input type="text" name="address" id="address" value="' + result[0].Address + '" /><br />' +

                        '<input type="hidden" name="PlayerID" id="PlayerID" value="' + result[0].PlayerID + '" />' +
                        '<input type="submit" />' +
                        '</form>' +
                        htmlFooter;

                    res.send(responseHTML);
                }
                else {
                    res.send('More than one record was returned.')
                }
            }
        }
    );
});

// Update PLAYER
app.get('/player/update', function (req, res) {

    var myQry = 'UPDATE Player SET First_Name="' + req.query.fname +
        '", Last_Name="' + req.query.lname  +
        '", HSName="' + req.query.hsname +
        '", Number="' + req.query.number  +
        '", Age="' + req.query.age +
        '", Phone_Num="' + req.query.phone +
        '", Email="' + req.query.email +
        '", Address="' + req.query.address +
        '" WHERE PlayerID=' + req.query.PlayerID;

    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                connection.query('SELECT * FROM Player WHERE PlayerID= "' + req.query.PlayerID + '"',
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send('An error occurred');
                        }
                        if(result.length == 1) {
                            res.send('Player Updated');
                        }
                        else {
                            res.send('No PLAYER FOUND FOR THAT ID.');
                        }
                    });
            }
        }
    );
});


//VIEW MORE OF PLAYER
app.get('/player/viewmore', function (req, res) {
var myQry = 'SELECT * FROM Roster WHERE PlayerID= ' + req.query.PlayerID + ' and HSTeamID=' + req.query.HSTeamID;
  var responseHTML;
  console.log(myQry);

  connection.query(myQry,
        function (err, result) {
            if (err) {
              console.log(err);
                      throw err;
                      res.send('An error occured');

            }
            else {

        var myQry = 'SELECT p.*, h.*, r.* FROM Roster as r JOIN Player as p ON r.PlayerID= p.PlayerID JOIN HSSPORT as h ON r.HSTeamID=h.HSSPORTID WHERE p.PlayerID= ' + req.query.PlayerID;
             var responseHTML;
                 console.log(myQry);

                connection.query(myQry,
                                 function (err, result) {
                                     if (err) {
                                         console.log(err);
                                         throw err;
                                         res.send('An error occured');

                                     }
                                     else{
                                         responseHTML = '<h1>' + result[0].First_Name + ' Information</h1>';

                                         for (var i=0; i < result.length; i++) {
                                             responseHTML += '<ul><li>First Name: ' + result[i].First_Name +
                                                 '</li><li>Last Name: ' + result[i].Last_Name +
                                                 '</li><li>Age: ' + result[i].Age +
                                                 '</li><li>Phone: ' + result[i].Phone_Num +
                                                 '</li><li>Email: ' + result[i].Email +
                                                 '</li><li>Address: ' + result[i].Address + '</li></ul>'
                                         }
                                         res.send(responseHTML);
                                     }

                                 });
            }
        });
});

//REMOVE A PLAYER
app.get('/player/delete', function (req, res) {

    var myQry = 'DELETE FROM Roster WHERE PlayerID= ' + req.query.PlayerID + ' and HSTeamID =' + req.query.HSTeamID;


    console.log(myQry);

    connection.query(myQry,
        function (err, result) {
            if (err) {
                handleError(res, err);
            }
            else {
                res.send('The player was successfully deleted.');
            }
        }
    );
});


// Begin listening

app.listen(8022);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
