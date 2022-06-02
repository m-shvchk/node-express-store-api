const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort('name').select('name price')
  res.status(200).json({ products, nbHits: products.length});
};

const getAllProducts = async (req, res) => {

  const { featured, company, name, sort, fields } = req.query; 
  // here we are querying for featured products, all other queries will be ignored
  const queryObject = {};
  // set the property in the queryObject only if it was set in the request:
  if(featured) queryObject.featured = featured === 'true' ? true : false; //'TRUE' MUST BE A STRING

  if(company) queryObject.company = company // retrieve company name from the request query 

  if(name) queryObject.name = {$regex: name, $options: 'i' } // using mongobd query oerator - regex

  // console.log(queryObject);

  // Using a method on the Model without await returns an object (a Query object), not the result of a query (we need query object here to chain 'sort'):
  let result = Product.find(queryObject);

  if(sort){
    const sortList = sort.split(',').join(' '); // we send request with query params seperated by comma, but 'sort' requires space instead
    result = result.sort(sortList);
  } else{
    result = result.sort('createdAt') // default
  }

  if(fields){ // fields is a param name made by us to implement the 'select' method 
    const fieldsList = fields.split(',').join(' '); 
    result = result.select(fieldsList);
  }

  const products = await result

  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProductsStatic, getAllProducts };
