const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const UserModel = require("../models/user.model")
const { auth } = require("../middlewares/auth")
const { adminauth } = require("../middlewares/adminauth")

const userRouter = express.Router()

userRouter.get("/", adminauth, async (req, res) => {
    try {
        let User = await UserModel.find()
        if (User.length > 0) {
            res.send({ users: User });
        } else {
            res.send({ msg: `No user found` })
        }
    } catch (e) {
        res.send({ msg: "Error", reason: e.message })
    }
})

userRouter.get("/banned/:id", adminauth, async (req, res) => {
    const id = req.params.id
    try {
        let User = await UserModel.findById(id)
        if (User.length > 0) {
            res.send({ users: User });
        } else {
            res.send({ msg: `No user found` })
        }
    } catch (e) {
        res.send({ msg: "Error", reason: e.message })
    }
})


userRouter.post("/register", async (req, res) => {
    const { name, email, phone_number, password } = req.body
    console.log(req.body)
    try {
        let ExistingUser = await UserModel.findOne({ email: email })
        if (ExistingUser) {
            res.send({ msg: "User Already Exists, Try Login" })
        } else {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) throw err
                const date = new Date()
                const curyear = date.getFullYear()
                const curmonth = date.getMonth()
                const curday = date.getDay() 
                let newUser = new UserModel({ name, email, phone_number, password: hash,year:curyear,day:curday ,month:curmonth })
                await newUser.save();
                res.send({ msg: "New User Added", user: newUser })
            })
        }
    } catch (e) {
        console.log(e)
        res.send(`Registration Error: - ${e.message}`)
    }
})


userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        let User = await UserModel.find({ email: email })
        if (User.length > 0) {
            bcrypt.compare(password, User[0].password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ userId: User[0]._id },"tough-request");
                    res.send({ msg: `Login Success ! WelcomeBack ${User[0].name}`, token: token, user: User });
                } else {
                    res.send({ msg: "Wrong Password" })
                }
            })
        } else {
            res.send({ msg: `Email ${email} does not Exist. Try Registring` })
        }
    } catch (e) {
        res.send({ msg: "Error", reason: e.message })
    }
})
userRouter.patch("/updateaddress/:id", async (req, res) => {
    const id = req.params.id;
    console.log(req.body,id);
    try {
        await UserModel.findByIdAndUpdate({_id:id},req.body)
        const user = await UserModel.findOne({_id:id})
        user.address = req.body.address;
        res.send({msg:"Address has been updated",user : user})
    } catch (e) {
        console.log(e)
        res.send({ msg: "Error", reason: e.message })
    }
})

userRouter.patch("/update/:id",adminauth, async (req, res) => {
    const payload = req.body
    const id = req.params.id;
    try {
        await UserModel.findByIdAndUpdate(id, { ...payload });
        let UpdatePost = await UserModel.findById(id)
        res.send({ msg: `User with ${id} Updated`, Updated_Post: UpdatePost })
    } catch (e) {
        res.send({ "msg": e.message })
    }
})

userRouter.delete("/delete/:id",adminauth, async (req, res) => {
    const id = req.params.id;
    try {
        await UserModel.findByIdAndDelete(id);
        res.send({ msg: `User with ${id} Deleted` })
    } catch (e) {
        res.send({ "msg": e.message })
    }
})


module.exports = userRouter