import { db } from "../connect.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addUserService ,findByCredentialsService,getUserByEmailService} from "../service/authService.js";
import {sendBadRequest, sendNotFound, sendServerError} from "../helper/helperFunctions.js"
import { UserLoginValidator, UserValidator } from "../validator/authValidator.js";


export const Login = async(req,res)=>{
  try {
    const {email, password} = req.body;
    const {error} =UserLoginValidator(req.body);
    if(error){
      return sendBadRequest(res, error.details[0].message,"email");

    }
    // check if the user exists
    const user = await getUserByEmailService(email);
  
    if(!user){
      return sendNotFound(res, "user not found");

    }else{
      const loggedInUser = await findByCredentialsService({email, password});
      console.log(email, password);
      res.json({message:"logged in user successfully", loggedInUser})
    }
    
  } catch (error) {
    sendServerError(res, error.message)
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
     res.status(201).json({ message: "User created successfully", token });
        
        }
      }
    }
  } catch (error) {
    sendServerError(res, error.message);
  }
};

// export const Login = async (req, res) => {
//   try {
//     const loginQuery = "SELECT * FROM users WHERE username = @username";
//     const loginResult = await db.request()
//       .input('username', sql.VarChar, req.body.username)
//       .query(loginQuery);

//     if (loginResult.recordset.length === 0) {
//       return res.status(404).json("User not found!");
//     }

//     const user = loginResult.recordset[0];
//     const checkPassword = bcrypt.compareSync(req.body.password, user.password);

//     if (!checkPassword) {
//       return res.status(400).json("Wrong password or username!");
//     }

//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secretkey");

//     const { password, ...others } = user;

//     res.cookie("accessToken", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//     }).status(200).json(others);
//   } catch (err) {
//     return res.status(500).json(err.message);
//   }
// };
export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  }).status(200).json("User has been logged out.");
};