var express = require('express'),
	app = express(),
	publicDir = process.argv[2] || __dirname + '/',
	port = parseInt(process.env.PORT, 10) || 4567,
	hostname = process.env.HOSTNAME || 'localhost';

app.get("/", function (req, res) {
  res.redirect("/index.html");
});

app.use(express.static(publicDir));

app.listen(port, hostname);