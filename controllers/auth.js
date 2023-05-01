import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

// register
export const register = async (req, res) => {
    try {
        const { username, password } = req.body

        const isUsed = await User.findOne({ username })

        if (isUsed) {
            return res.json({ message: 'This username is used.' })
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User ({
            username,
            password: hash,
        })

        const token = jwt.sign( 
        {
            id: newUser._id, 
        }, 
            process.env.JWT_SECRET,
            { expiresIn: '90d' },
        )

        await newUser.save()

        res.json({
            newUser,
            message: 'Registration was successfull.'
        })
    }
    catch (error) {
        res.json({ message: "Error while adding user." })
    }
}

// login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        
        if (!user) {
            return res.json({
                message: "Can not find this user."
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.json({
                message: "Incorrect password."
            })
        }

        const token = jwt.sign( 
        {
            id: user._id, 
        }, 
            process.env.JWT_SECRET,
            { expiresIn: '90d' },
        )

        res.json({
            token, 
            user, 
            message: "Entered.",
        })
    }
    catch (error) {
        res.json({ message: "Error while authorization." })
    }
}

// get
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.json({
                message: "Can not find this user."
            })
        }

        const token = jwt.sign( 
            {
                id: user._id, 
            }, 
                process.env.JWT_SECRET,
                { expiresIn: '90d' },
            )

        res.json({
            user,
            token,
        })
    }
    catch (error) {
        res.json({ message: "No privilegies." })
    }
}