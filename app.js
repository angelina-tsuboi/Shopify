require('./config/config');

const express = require('express')
var bodyParser = require('body-parser');
const path = require('path')
const port = 6754 || process.env.PORT;
const app = express()
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


var {mongoose} = require('./db/mongoose');
mongoose.connect('mongodb://localhost:27017/Shopify', {useNewUrlParser: true});
var {Product} = require('./models/product')
var {User} = require('./models/user');
var {CustomerInfo} = require('./models/customerinfo');
var {ProductInfo} = require('./models/productinfo');

let chargeAmount = 0;
let chargeDescription = "";

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('pages/index')
})

app.get('/signup', (req, res) => {
    res.render('pages/signup')
})

app.get('/cart', async(req, res) => {
    let pickUpName = req.query.pickUpName;
    console.log("pickUpName: get" +  pickUpName)
    try{
        productResult = await Product.find({pickUpName: pickUpName});
        console.log(`Product Result is ${productResult}`);
        productResult.forEach((product) => {
            chargeDescription += ` ${product.name}`;
        })
        calculatedResults = calculateOrder(productResult);
        chargeAmount = calculatedResults[3];
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

app.post('/loginUser', async (req, res) => {
    try{
        console.log("Got the data " + req.body.email)
        let firstName = req.body.first_name;
        let lastName = req.body.last_name;
        let email = req.body.email;
        let password = req.body.password;
        let ccNum = req.body.cc_number;
        let cvcNum = req.body.cvc_number;
        let expirDate = req.body.expirationDate;
        let newUser = new User({
            name: `${firstName} ${lastName}`,
            email: email,
            ccNumber: ccNum,
            cvcNumber: cvcNum,
            expirationDate: expirDate
        })
        let result = await newUser.save();

        console.log("Saved user successfully!" + result);
    }catch(err){
        console.log("Error saving new user: " + err)
    }
})

app.post('/charge', async(req,res) => {
    
    try {
        const customer = await stripe.customers.create({
            email: "angelina.t1832@gmail.com",
            source: req.body.stripeToken
        })
        
        const charge = await stripe.charges.create({
            amount: chargeAmount * 100,
            description: chargeDescription,
            currency: 'usd',
            customer: customer.id
        })
    
        console.log(req.body)
    
        let customerRecord = {
            name:req.body.stripeBillingName,
            email: req.body.stripeEmail,
            country: 
            req.body.stripeBillingAddressCountry,
            countryCode: req.body.stripeBillingAddressCountryCode,
            zip: req.body.stripeBillingAddressZip,
            address: req.body.stripeBillingAddressLine1,
            addressCity: req.body.stripeBillingAddressCity,
            addressState: req.body.stripeBillingAddressState
        }
    
        let productRecord = {
            productId:req.body.productId,
            token: req.body.stripeToken,
            tokenType: req.body.stripeTokenType,
        }
    
        let newCustomerInfo = new CustomerInfo(customerRecord)
        let newProductRecord = new ProductInfo(productRecord)
        const customerResult = await newCustomerInfo.save();
        const productResult = await newProductRecord.save();
        console.log(customerResult)
        console.log(productResult)
        res.status(200).send({cresult: customerResult, presult: productResult});
    } catch (error) {
        res.status(400).send({e: error});
    } 
})

app.listen(port, (err) => {
    err ? console.log(err) : console.log("Port is up on " + port)
})