const express = require("express")
const cartModel = require("../models/cart.model");
const { adminauth } = require("../middlewares/adminauth");

const adminOrderRoute = express.Router()

adminOrderRoute.get("/",adminauth,async(req,res)=>{
    try {
        const data = await cartModel.find({payment:true})
        console.log(data)
        if(data.length>0){
            res.send({mas:"hihihi", data: data });
        }
        else{
            res.send({msg:"No data found"})
        }
    

    } catch (e) {
        res.send({msg:e.message})
    }
})

adminOrderRoute.patch("/update/:id",adminauth,async(req,res)=>{
    const payload = req.body
    const id = req.params.id;
    try {
        await cartModel.findByIdAndUpdate(id, { ...payload });
        let UpdateProduct = await cartModel.findById(id)
        res.send({ msg: "Cart Updated", UpdateProduct: UpdateProduct })
    } catch (e) {
        res.send({ "msg": e.message })
    }
})

module.exports = {adminOrderRoute}

