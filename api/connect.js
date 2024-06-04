import sql from 'mssql'

// Configuration object for the database connection
 export const db = {
  user: 'sa',
  password: 'Nyambura@25',
  server: 'localhost', // You can use 'localhost\\instance' to connect to a named instance
  database: 'NetworkApp',
  options: {
    encrypt: true, // Use this if you're connecting to Azure SQL
    trustServerCertificate: true // Change to false for production environments
  }
};

// Function to create a connection pool
const connectToDatabase = async () => {
  try {
    let pool = await sql.connect(db);
    console.log("Connected to the database successfully!");
    return pool;
  } catch (err) {
    console.error("Database connection failed: ", err);
  }
};

// Call the function to establish a connection
connectToDatabase();
;

