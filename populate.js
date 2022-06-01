require("dotenv").config();

const connectDB = require("./db/connect"); // we need another connection to populate DB
const Product = require("./models/product");

const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI); // connect to DB
    await Product.deleteMany(); // delete everything from the DB (optional)
    await Product.create(jsonProducts); //pass array of products to <model>.create to populate DB
    console.log("Success");
    // exit process in Node (the DB was populatedm no need to keep the process running):
    process.exit(0); // 0 === success
  } catch (err) {
    console.log(err);
    process.exit(1); // 1 === application error or an invalid reference
  }
};

start();
