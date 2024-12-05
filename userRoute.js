const router = require("express").Router();
const UserModel = require("./userModel");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
    const newUser = new UserModel({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_KEY).toString()
    });
    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({
            username: req.body.username
        });

        if (!user) {
            return res.status(401).json("User Not Found!!");
        }

        const hashedPass = CryptoJs.AES.decrypt(user.password, process.env.PASS_KEY);
        const originalPass = hashedPass.toString(CryptoJs.enc.Utf8);

        const currPass = req.body.password;
        const { password, ...others } = user._doc;

        if (originalPass !== currPass) {
            return res.status(401).json("Wrong Password!!");
        } else {
            const accessToken = jwt.sign({
                id: user._id,
            },
            process.env.JWT_KEY, { expiresIn: "1h" }
            );
            return res.status(200).json({ ...others, accessToken });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
