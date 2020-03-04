const express = require('express')
var bodyParser = require('body-parser');
const path = require('path')
const port = 6754 || process.env.PORT;
const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('pages/index')
})

app.listen(port, (err) => {
    err ? console.log(err) : console.log("Port is up on " + port)
})