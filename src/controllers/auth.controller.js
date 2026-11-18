const bcrypt = require("bcryptjs")
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken")
const User = require("../schema/users.schema.js");
const CustomErrorHandler = require("../error/error.js");
const { generateTokens, access_token } = require("../utils/token.generator.js");

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
            password: hashedPassword,
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

        const checkPassword = await bcrypt.compare(password, foundedEmail.password);

        if (checkPassword) {
            const payload = { id: foundedEmail.id, email: foundedEmail.email };
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
                expiresIn: "7d",
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

const Logout = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } })

        res.clearCookies("accessToken")
        res.clearCookies("refreshToken")

        res.status(200).json({ messaage: "OK" })
    } catch (error) {
        next(error)
    }
}

const Refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            throw CustomErrorHandler.UnAuthorized("Refresh token topilmadi")
        }

        const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_ACCESS_SECRET)

        const user = await User.findById(decode.id);
        if (!user || user.isBlocked || user.tokenVersion !== decode.tokenVersion) {
            throw CustomErrorHandler.UnAuthorized("Refresh token yaroqsiz")
        }

        const tokens = generateTokens(User)

        res.cookies("accessToken", tokens.accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000
        })
        res.status(200).json({
            message: "Access token yangilandi",
            accessToken: tokens.accessToken
        })
    } catch (error) {
        next(error)
    }
}

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({ data: user })
    } catch (error) {
        next(error)
    }
}

const updateMe = async (req, res, next) => {
    try {
        const { fullName, email } = req.body

        if (email && email !== req.user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                throw CustomErrorHandler.BadRequest("Bu email band")
            }
        }

        const updatedUser = await User.User.findByIdAndUpdate(
            req.user._id,
            {
                ...(fullName && { fullName }),
                ...(email && { email }),
                ...(avatar && { avatar })
            },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            message: "Profil yangilandi",
            data: updatedUser
        });
    } catch (error) {
        next(error)
    }
}

const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            throw CustomErrorHandler.BadRequest("Eski va yangi parol kiritilishi shart");
        }

        const user = await User.findById(req.user._id).select("+password");

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw CustomErrorHandler.BadRequest("Eski parol noto'g'ri");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.tokenVersion += 1; // Parol o'zgarganda eski sessiyalarni uzish
        await user.save();

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).json({
            message: "Parol muvaffaqiyatli o'zgartirildi. Qaytadan tizimga kiring"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    Register,
    Login,
    Logout,
    Refresh,
    getMe,
    updateMe,
    changePassword
}