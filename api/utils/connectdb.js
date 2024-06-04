import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config();
const { SQL_USER,SQL_PASSWORD,SQL_SERVER,SQL_DB,
 SQL_ENCRYPT,SQL_TRUST_SERVER_CERTIFICATE } = process.env

const sqlConfig={
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DB,
    server: SQL_SERVER,
    pool:{
        max:10,
        min:0,
        idleTimeoutMillis: 30000
        
    },
    options: {
            encrypt: Boolean(SQL_ENCRYPT), 
            trustServerCertificate: Boolean(SQL_TRUST_SERVER_CERTIFICATE)
          }
    
}

let appPool;
let poolRequest;

try {
    appPool = await sql.connect(sqlConfig);
    poolRequest = () => appPool.request();
    if(appPool){
        console.log("Connected to the database")
    }else{
        console.log("Error connecting the db ");
    }
} catch (error) {
    console.log(error);
}

export { poolRequest, sql }