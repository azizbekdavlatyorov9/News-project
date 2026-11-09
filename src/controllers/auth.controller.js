const bcrypt = require("bcrypt")
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken") 
const User = require("../Schema/users.schema");

const Register = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: " Name, email and password are required" });
    }
    try {
        const foundedEmail = await User.findOne({ email });

        if (foundedEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new User({
            id: v4(),
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        return res.status(201).json({ message: "Registered successfully" });

    } catch (error) {
        next(error);
    }

}
const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const foundedEmail = await User.findOne({ email });

        if (!foundedEmail) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }

        if (foundedEmail.isBlocked) {
            return res.status(403).json({ message: "User is blocked", reason: foundedUser.blockReason },
            )
        }

        const checkPassword = await bcrypt.compare(password, foundedUser.password);

        if (checkPassword) {
            const payload = { id: foundedEmail.id, email: foundedEmail.email };
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn: "5s",
            })

            return res.status(200).json({
                message: "Success",
                token,
            })
        } else {
            return res.status(401).json({ message: "Wrong password" })
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    Register,
    Login
}