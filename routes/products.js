var express = require('express');
var bodyParser = require('body-parser');
const shortid = require('shortid');

var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
var router = express.Router();

// Set some defaults
db.defaults({ products: [] })
  .write();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const products = db.get('products')  
  .value();
  res.render('../views/products/index', { products: products });
});

router.get('/create', function(req, res, next) {
  
  res.render('../views/products/create');
});
router.post('/create', function(req, res, next) {
  // console.log(req.body);
  let product = req.body;
  db.get('products')
  .push({ id: shortid.generate(), name: product.name, title: product.title})
  .write()
  res.redirect('/products');
});

router.get('/edit/:id', function(req, res, next) {
  
  const productId = req.params.id;
  const product = db.get('products') 
  .find({ id: productId }) 
  .value();
  console.log(product);
  res.render('../views/products/edit', { product: product });
});

module.exports = router;