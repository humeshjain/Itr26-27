// console.log("hello world! hiii I am Humesh");
//here the import statement is used to import the express module, which is a web framework for Node.js. The morgan module is also imported, which is a middleware for logging HTTP requests.
const express = require("express"); // first line
const morgan = require("morgan");
const sequelize = require("sequelize"); // installed sequelize package is imported to connect to the database and perform database operations. Sequelize is an Object-Relational Mapping (ORM) library for Node.js that provides an easy-to-use interface for interacting with relational databases like PostgreSQL, MySQL, SQLite, etc.

const { DataTypes } = require("sequelize"); // DataTypes is an object provided by Sequelize that contains various data types that can be used to define the structure of database tables. It allows you to specify the type of data that each column in a table should hold, such as strings, integers, dates, etc. In this code snippet, DataTypes is imported from the sequelize package to define the data types for the Product model.


// database connection with sequelize
const db = new sequelize("test_db", "postgres", "humesh", {
  host: "localhost",
  dialect: "postgres",
});

// table creation using sequelize

const Product = db.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {  

    type: DataTypes.STRING,
    allowNull: false,
  },
}); 



// Database Alternative dummy data

const products = [
  {
    id: 1,
    title: "Product 1",
    price: 10.99,
    description: "This is product 1", 
    category: "Category 1",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    title: "Product 2",
    price: 19.99, 
    description: "This is product 2",
    category: "Category 2",
    image: "https://via.placeholder.com/150",
  },
]

console.log("products", products);

// data base connectio


//here the server setup is done using the express() function, which creates an instance of an Express application. The morgan middleware is used to log HTTP requests in the console. Finally, the server is set to listen on port 3000, and a message is logged to the console when the server starts running.
const server = express(); // second line

//here all server configurations are done, like using morgan middleware for logging HTTP requests in the console. The server is set to listen on port 3000, and a message is logged to the console when the server starts running.
server.use(morgan("combined"));
// express.json() middleware is used to parse incoming JSON requests and make the data available in the req.body property of the request object. This allows the server to handle JSON data sent from the client, such as when creating a new product using a POST request.
server.use(express.json());

// here we created GET to test on browser that it is working and returning "Hello World!" message when we access the root URL ("/") of the server. The server is set to listen on port 3000, and a message is logged to the console when the server starts running.
server.get("/", (req, res) => {
  res.send("Hello World!");
});


// we have tested route here - /api/student 
// we have send a JSON response
// tested on postman and it is working fine
// test on browser and it is working fine
server.get("/api/student", (request, response) => {
    response.json({ message: "Hii I am a student" });
});


// GET PUT CREATE DELETE PATCH are the HTTP methods used to perform CRUD operations on the server.

// GET METHOD TEST ENDPOINT

server.get('/api/products',(req,res)=>{

  res.status(200).json({
    message: "Products fetched successfully",
    products: products,
    error: false
  })

})

// Create a new product POST METHOD TEST ENDPOINT
server.post('/api/products',(req,res)=>{
 
  console.log("req.body", req.body);

 const {id,title,price,description,category,image}= req.body;

  const newProduct = { id, title, price, description, category, image };
  products.push(newProduct);
  res.status(201).json({
    message: "Product created successfully",
    product: newProduct,
    error: false
  })
})

//here the server is set to listen on port 3000, and a message is logged to the console when the server starts running.
server.listen(3000, () => { 

  db.authenticate()
  .then(() => {
    console.log('Database connected...'); 
  })
  .then(() => {
    db.sync({ force: true }) // force: true will drop the table if it already exists
    .then(() => {
      console.log('Database synced...');
    })
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  })

  console.log("Server is running on port 3000");
})

// get andd post method we have implemented with post method and dummy data 
// now we will implement using database with real database data 
// get put post delete patch methods we will implement with database using sequelize and postgresql database
// try all this methods on postman and test it on browser also
// connect with rect.js frontend and test all the methods on postman and browser
// in react create a form to create a new product and display all the products in a list with delete and update buttons for each product

// sequelize ORM website to understand how to connect with database and perform CRUD operations using sequelize and postgresql database