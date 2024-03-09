import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import ErrorHandler from "../utils/error.js"
import  jwt  from "jsonwebtoken"

export const Signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json("created succesfully")
    } catch (error) {
        next(error);
    }

}

export const Signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validuser = await User.findOne({ email });
        if (!validuser) return next(ErrorHandler(404, "user not found"));
        const validpassword = bcryptjs.compareSync(password, validuser.password);
        if (!validpassword) return next(ErrorHandler(401, "wrong credentials"));
        const Token = jwt.sign({id:validuser._id},process.env.JWT_SECRET)
        const {password:pass, ...rest} = validuser._doc;
        res.cookie('token',Token,{httpOnly:true}).status(200).json(rest);
    } catch (error) {
        next(error);
    }
}