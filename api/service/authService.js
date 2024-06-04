import sql from 'mssql';
import { poolRequest } from '../utils/connectdb.js';
export const addUserService = async (user) => {
    try {
      const result = await poolRequest()
        .input('username', sql.VarChar, user.username)
        .input('email', sql.VarChar, user.email)
        .input('password', sql.VarChar, user.password)
        .input('coverpic', sql.VarChar, user.coverpic)
        .input('profilepic', sql.VarChar, user.profilepic)
        .input('city', sql.VarChar, user.city)
        .input('website', sql.VarChar, user.website)
        .query(`
          USE NetworkApp; 
          INSERT INTO Users (username, email, password, coverpic, profilepic, city, website) 
          VALUES (@username, @email, @password, @coverpic, @profilepic, @city, @website)
        `);
        
      return result;
    } catch (error) {
      return error;
    }
  };
  export const getUserByEmailService = async (email) => {
    try {
      const result = await poolRequest()
        .input("email", sql.VarChar(255), email)
        .query("SELECT * FROM users WHERE email = @email");
   
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  };