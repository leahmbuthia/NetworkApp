import sql from 'mssql';

const config = {
  user: 'sa',
  password: 'Nyambura@25',
  server: 'localhost',
  database: 'NetworkApp',
  options: {
    encrypt: true, // Use encryption (optional, depending on your SQL Server setup)
    trustServerCertificate: true // If you are using a self-signed certificate
  }
};

async function connectToDatabase() {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to the database');
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
}

export default connectToDatabase;
