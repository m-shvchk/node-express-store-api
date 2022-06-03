const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  // const products = await Product.find({}).sort('name').select('name price').limit(10).skip(1)
  const products = await Product.find({price:{$gt: 30}}).sort('price').select('name price')

  res.status(200).json({ products, nbHits: products.length});
};

const getAllProducts = async (req, res) => {

  const { featured, company, name, sort, fields, numericFilters } = req.query;
  
  const queryObject = {};
  // set the property in the queryObject only if it was set in the request:
  if(featured) queryObject.featured = featured === 'true' ? true : false; //'TRUE' MUST BE A STRING

  if(company) queryObject.company = company // retrieve company name from the request query 

  if(name) queryObject.name = {$regex: name, $options: 'i' } // using mongobd query oerator - regex

  if(numericFilters){
    const operatorMap = { 
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    } // maps our operators to ones that mongoose understands
    const regEx = /\b(>|>=|=|<=|<)\b/g // match chars in a string
    let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`) // replace our operators with mongoose operators ('-' - for further spliting)
    console.log(filters)

    const options = ['price', 'rating']
    filters = filters.split(',').forEach(item => {
      const [field, operator, value] = item.split('-') // price-$gt-30 --> field=price, operator=$gt, value=30
      if(options.includes(field)){
        queryObject[field] ={[operator]: Number(value)} // dynamic key: const obj = {[prop]: 'bar'};
      }
    })
   } 
  console.log(queryObject);

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

  const page = Number(req.query.page) || 1; 
  const limit = Number(req.query.limit) || 10; // Query.prototype.limit() specifies the maximum number of documents the query will return
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit) // Query.prototype.skip() - how many documents to skip

  const products = await result

  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProductsStatic, getAllProducts };
