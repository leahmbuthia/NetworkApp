import { db } from "../connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addUserService ,getUserByEmailService} from "../service/authService.js";
import {sendBadRequest, sendNotFound, sendServerError} from "../helper/helperFunctions.js"
import { UserLoginValidator, UserValidator } from "../validator/authValidator.js";


export const Login = async(req,res)=>{
  try {
    const {email, password} = req.body;
    console.log(email,password);
    const {error} =UserLoginValidator(req.body);
    if(error){
      return sendBadRequest(res, error.details[0].message,"email");
    }
    
    // check if the user exists
    const user = await getUserByEmailService(email);
  
    if(!user){
      return sendNotFound(res, "User not found");
    } else {
      // Now, you have the user object. Check if the password matches.
      const isValidPassword = await comparePassword(password, user.password);
      
      if (isValidPassword) {
        // Password matches, user is logged in successfully
        res.json({ message: "Logged in user successfully", user });
      } else {
        // Password doesn't match
        return sendNotFound(res, "Incorrect password");
      }
    }
    
  } catch (error) {
    sendServerError(res, error.message);
  }
}


export const register = async(req, res) => {
  try {
    const {
      username,
      email,
      password,
      coverpic,
      profilepic,
      city,
      website,
    } = req.body;

    // Check if the user already exists
    const existingUser = await getUserByEmailService(email);
    if (existingUser) {
      return res
        .status(400)
        .send("User with the provided email already exists");
    } else {
      // Validate user data
      const { error } = UserValidator({
        username,
        email,
        password,
        coverpic,
        profilepic,
        city,
        website,
      });

      if (error) {
        return res.status(400).send(error.details[0].message);
      } else {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 8);
        const registeredUser = {
          username,
          email,
          password: hashedPassword,
          coverpic,
          profilepic,
          city,
          website,
        };

        // Add the user to the database
        const result = await addUserService(registeredUser);

        if (result.message) {
          sendServerError(res, result.message);
        } else {
          // Generate JWT token
          const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "24h",
          });
     // Send JWT token along with success response
     res.status(201).json({ message: "User created successfully", token, registeredUser });
        
        }
      }
    }
  } catch (error) {
    sendServerError(res, error.message);
  }
};

export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  }).status(200).json("User has been logged out.");
};