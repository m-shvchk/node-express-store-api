require("dotenv").config();
// async errors

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const productsRouter = require("./routes/products")

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

// middleware

app.use(express.json()); // we don't use it here, just not to forget the syntax

// routes

app.get("/", (req, res) => {
  res.send("<h1>Store API</h1><a href='api/v1/products'>products route</a>");
});

// products routes
app.use('/api/v1/products', productsRouter)

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // connect DB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening at port ${port}...`));
  } catch (err) {
    console.log(err);
  }
};

start();
