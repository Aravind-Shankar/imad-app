var express = require('express');   // handles listening on ports etc. URL parametrization handled here
var morgan = require('morgan'); // handles logging
var path = require('path');
var crypto = require('crypto');
var bodyParser = require('body-parser'); // POST req body parse

var Pool = require('pg').Pool;
var config = {
    user: 'ee14b012',
    database: 'ee14b012',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json()); // for each incoming req, if content type is JSON, use that as req body.

/*
 * article template fns
 */
function getTemplate(data) {
    var htmlTemplate = `
    <html>
        <head>
            <title>
                ${data.title}
            </title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link href="ui/style.css" rel="stylesheet" />
        </head>
        <body>
            <div class="container">
                <div>
                    <a href="/">Home</a>
                </div>
                <hr/>
                <h3>
                    ${data.heading}
                </h3>
                <div>
                    ${data.date.toDateString()}
                </div>
                <div>
                    ${data.content}
                </div>
            </div>
        </body>
    </html>
    `;
    return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input, salt) {
  var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');    // password-based key derivation function (pbkdf)
  return ["pbkdf2", "10000", salt, hashed.toString('hex')].join("$");
}
app.get('/hash/:input', function(req, res) {
  var hashedString = hash(req.params.input, 'welcome-to-randomness'); 
  res.send(hashedString);
});

app.post('/create-user', function(req, res) {
  // get creds from JSON (requires body-parser)
  var username = req.body.username;
  var password = req.body.password;
  
  var salt = crypto.getRandomBytes(128).toString('hex');
  var dbString = hash(password, salt);
  pool.query('insert into "user" (username, password) values ($1, $2)', [username, dbString], function(err, result) {
      if (err)
        res.status(500).send(err.toString());
      else
        res.send('Successfully created: ' + username);
  });
});

var pool = new Pool(config);
app.get('/test-db', function(req, res) {
  pool.query('select * from test', function(err, result) {
    if (err)
      res.status(500).send(err.toString());
    else {
      res.send(JSON.stringify(result.rows));      
    }
  });
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

var counter = 0;
app.get('/counter', function(req, res) {
    counter = counter + 1;
    res.send(counter.toString());
});

var names = [];
app.get('/submit-name', function(req, res) {
    names.push(req.query.name);
    res.send(JSON.stringify(names));
});

app.get('/articles/:art', function(req, res) {
   var articleName = req.params.art;
   
   // $1 for protection from SQL Injection. V.V.IMP.
   pool.query("select * from article where title = $1", articleName, function(err, result) {
            if (err)
                res.status(500).send(err.toString());
            else if (result.rows.length === 0)
                res.status(404).send("Article not found");
            else {
                var articleData = result.rows[0];
    
                res.send(getTemplate(articleData));          
            }
   });
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
