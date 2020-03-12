require('./config/config');

const express = require('express')
var bodyParser = require('body-parser');
const path = require('path')
const port = 6754 || process.env.PORT;
const app = express()
var {mongoose} = require('./db/mongoose');
mongoose.connect('mongodb://localhost:27017/Shopify', {useNewUrlParser: true});
var {Product} = require('./models/product')

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('pages/index')
})

app.get('/cart', async(req, res) => {
    let pickUpName = req.query.pickUpName;
    console.log("pickUpName: get" +  pickUpName)
    try{
        productResult = await Product.find({pickUpName: pickUpName});
        console.log(`Product Result is ${productResult}`);
        calculatedResults = calculateOrder(productResult);
        res.render('pages/cart', {pickUpName, calculatedResults})
    }catch(err){
        console.log("Failed to load orders data: " + err)
        res.status(400).send("Failed to load data");
    }

    function calculateOrder(results){
        let subtotal = 0;
        let tax = 0;
        let shipping = 0;
        let total = 0;
        results.forEach((product)=> {
            subtotal += parseInt(product.price.slice(1))
        })
        tax = subtotal * 0.06;
        shipping = results.length * 3.00;
        total = subtotal + tax + shipping;
        return [subtotal, tax, shipping, total];
    }
})

app.post('/cart', async(req, res) => {
    let pickUpName = req.body.pickUpName;
    console.log("pickUpName: post " +  pickUpName)
    try{
        productResult = await Product.find({pickUpName: pickUpName});
        calculateOrder();
        console.log(`Product Result is ${productResult}`);
        res.render('pages/cart', {productResult})
    }catch(err){
        console.log("Failed to load orders data: " + err)
        res.status(400).send("Failed to load data");
    }
})

app.post('/order', (req, res) => {
    var newProduct = new Product({
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        pickUpName: req.body.pickUpName
    })

    newProduct.save((err) => {
        err ? console.log("There was an error saving product data: " + err) : console.log("Product data saved!")
    })
})

app.post('/removeOrder', (req, res) => {
    console.log("Got the remove order thingy " + req.body.orderId)
    try{
        console.log(req.body.orderId);
        Product.deleteOne({_id: `${req.body.orderId}` }).then(()=> {
            console.log("This was a total success")
        })
    }catch(err){
        console.log("There was an error removing the data: " + err)
    }
})

app.listen(port, (err) => {
    err ? console.log(err) : console.log("Port is up on " + port)
})