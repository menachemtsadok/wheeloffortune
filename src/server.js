const fs           = require('fs'),       // pull the standard filesystem library in
      express      = require('express'),  // pull the webserver library that we installed in
      path         = require('path');
      bodyParser   = require('body-parser');

const app          = express();           // express exposes as a generator function
const server       = require('http').createServer(app);
const io      = require('socket.io')(server);

io.on('connection', client => {
      console.log('a user conntent');
      client.on('create',room => client.join(room));
      client.on('event', data => { console.log('userconnte') });
      client.on('disconnect', () => { console.log("client disconnected") });
      client.on('send_letter', data=> io.sockets.in(data.room).emit('letter_sent',data.letter));
    });


// const htmlDocument = `${fs.readFileSync('./html/index.html')}`,  // stuffing the binary into a string
      jsDocument   = `${fs.readFileSync('./src/js/client.js')}`;   // is a quick type change

// this just repeats the header nonsense for us
const sendAs       = (res, mime, doc) => {
        res.setHeader("Content-Type", mime);
        res.send(doc);
      };

      // // these functions implement the endpoint behaviors
      // rootHandler  = (req, res) => sendAs(res, "text/html",              htmlDocument),
      cliJsHandler = (req, res) => sendAs(res, "application/javascript", jsDocument),     


      dataHandler  = (req, res) => res.json({ randomNumber: Math.trunc(Math.random() * 100) }),

      puzzleHandler = (req, res) => res.json({ puzzle1: "WHEEL OF FORTUNE"});


// server.use gets applied to every inbound request, then next() defers as incomplete
// this allows us to put CORS headers on everything conveniently
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies


// and these are the actual endpoints, which call the functions above
// server.get('/',          rootHandler);   // this says "when a GET request is made for '/', call this function"
app.get('/client.js', cliJsHandler);
app.get('/data',      dataHandler);
app.get('/puzzles', puzzleHandler);

var puzzles;
var current = 1;

app.post('/puzzle', function(req, res) {

      // here you can use your request object
      // like req.body.token  req.body
      puzzles = req.body;
      console.log(puzzles)
      //Send base64 of current time
      res.send(current);

  });
// finally, start the server
server.listen(3000, () => { console.log('server now running on http://127.0.0.1:3000/') } );

function currentPuzzle() {
      var rows = [[], [], [], []];
      var puzzle = puzzles["puzzle" + current];
      console.log(puzzle);
      for(var i = 0; i < 4; i++) {
            for(var j = 0; j < puzzle[i].length; j++) {
                  rows[i].push(1);
            }
      }
      console.log(rows);
      return rows;
}
