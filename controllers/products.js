const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  const search = 'a'
  const products = await Product.find({
    name: {$regex: search, $options: 'i' }
  })
  res.status(200).json({ products, nbHits: products.length});
};

const getAllProducts = async (req, res) => {

  const { featured, company, name } = req.query; 
  // here we are querying for featured products, all other queries will be ignored
  const queryObject = {};
  // set the property in the queryObject only if it was set in the request:
  if(featured) queryObject.featured = featured === 'true' ? true : false; //'TRUE' MUST BE A STRING

  if(company) queryObject.company = company // retrieve company name from the request query 

  if(name) queryObject.name = {$regex: name, $options: 'i' } // using mongobd query oerator - regex

  console.log(queryObject);
  const products = await Product.find(queryObject);
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProductsStatic, getAllProducts };
