const express =  require("express")
const userRoute = express.Router();
const userController = require("../controller/register");


userRoute.post("/register",userController.register);



module.exports = {
    userRoute
}
