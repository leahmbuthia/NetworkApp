import sql from 'mssql';
import { poolRequest } from '../utils/connectdb.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
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
  export const findByCredentialsService = async ({ email, password }) => {
    try {
      const userFoundResponse = await poolRequest()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM users WHERE email = @email');
  
      if (userFoundResponse.recordset[0]) {
        const storedPassword = userFoundResponse.recordset[0].password;
        const isPasswordValid = await bcrypt.compare(password, storedPassword);
  
        if (isPasswordValid) {
          const token = jwt.sign(
            {
              id: userFoundResponse.recordset[0].id,
              email: userFoundResponse.recordset[0].email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );
  
          const { password, ...userData } = userFoundResponse.recordset[0];
          return { user: userData, token: `JWT ${token}` };
        } else {
          return { error: 'Invalid Credentials' };
        }
      } else {
        return { error: 'Invalid Credentials' };
      }
    } catch (error) {
      return { error: error.message };
    }};