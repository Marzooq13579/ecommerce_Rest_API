import User from "../models/User.js";
import jwt from "jsonwebtoken";
const Verify = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers["authorization"]?.split(" ")[1];


    if (!token) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    

    //Check for Token Expiry
    if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ status: false, message: "Token expired" });
    }

    // Attach decoded user data to request object
    req.user = decoded;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: false, message: "Authorization Failed" });
  }
};

export default Verify;
