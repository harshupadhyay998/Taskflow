import jwt from "jsonwebtoken";
import User from "../model/User.model.js";

const protect = async(req, res, next) => {
    try {
        console.log("========== AUTH DEBUG ==========");
        console.log("Headers:", req.headers);

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not Authorized, No Token",
            });
        }

        const token = authHeader.replace("Bearer ", "").trim();

        console.log("TOKEN =", token);
        console.log("SECRET =", process.env.JWT_SECRET_KEY);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED =", decoded);

        const user = await User.findById(decoded.id).select("-password");
        console.log("USER =", user);

        if (!user) {
            return res.status(401).json({
                message: "Invalid Token - User Not Found",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("AUTH ERROR =", error);

        return res.status(401).json({
            message: "Not Authorized Token Failed",
            error: error.message,
        });
    }
};

export default protect;