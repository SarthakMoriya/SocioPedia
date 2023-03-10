import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Users from '../Models/userModel.js'



export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body

        const salt = await bcrypt.genSalt();
        //earlier we use 10 or 12 as salt to encrypt password doesnt make any difference
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await Users.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.trunc(Math.random() * 100),
            impressions: Math.trunc(Math.random() * 100),
        })

        res.status(201).json({ msg: "Registered Successfully...!", user: newUser })

    } catch (error) {
        res.status(500).json({ msg: "Registeration Failed...!", error })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email })

        if (!user) return res.status(401).json({ msg: "User does not exist...!" })

        const checkPassword = await bcrypt.compare(user.password, password)

        if (!checkPassword) return res.status(401).json({ msg: "Invalid Credentials...!" })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,process.env.JWT_EXPIRES_IN)
        delete user.password

        res.status(201).json({ msg: "Login Success...!", token: token, user: user })
    } catch (error) {
        res.status(500).json({ msg: "Registeration Failed...!", error })
    }
}