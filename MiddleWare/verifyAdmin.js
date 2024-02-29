import Verify from "./Verify.js";

const verifyAdmin = async (req, res, next) => {
  try {
    // Call the regular verify middleware first
    await Verify(req, res, next);

    console.log("req.user is",req.user)

    // Check if the user is an admin based on the 'isAdmin' field
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ status: false, message: "Forbidden: Admin access required" });
    }

    next();
  } catch (err) {
    next(err);
  }
};
export default verifyAdmin;


