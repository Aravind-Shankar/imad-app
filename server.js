var express = require('express');   // handles listening on ports etc. URL parametrization handled here
var morgan = require('morgan'); // handles logging
var path = require('path');

var app = express();
app.use(morgan('combined'));

/*
 * article template fns
 */
function getTemplate(index) {
    var i = index;
    var htmlTemplate = `
    <html>
        <head>
            <title>
                Article ${i} - Aravind S
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
                    Article ${i}
                </h3>
                <div>
                    Feb 16, 2018
                </div>
                <div>
                    <p>
                        Sample content for Article ${i}. Sample content for Article ${i}. Sample content for Article ${i}.
                    </p>
                    <p>
                        Sample content for Article ${i}. Sample content for Article ${i}. Sample content for Article ${i}.
                    </p>
                    <p>
                        Sample content for Article ${i}. Sample content for Article ${i}. Sample content for Article ${i}.
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
    return htmlTemplate;
}

var articles = {
    'article-one' : 1,
    'article-two' : 2,
    'article-three' : 3
};

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
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

app.get('/:art', function(req, res) {
   res.send(getTemplate(articles[req.params.art]));
});

var names = [];
app.get('/submit-name/:inName', function(req, res) {
    names.push(req.params.inName);
    res.send(JSON.stringify(names));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
