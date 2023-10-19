const { UserModel } = require("../models/register");
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
// for send welcome mail
const sendWelcomeMail = async (name, email, userId) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "jackayron5@gmail.com",
        pass: "unpptovcdhpfkzdv",
      },
    });

    const mailOptions = {
      from: "jackayron5@gmail.com",
      to: email,
      subject: "For verification mail",
      html: `<p>Hi ${name}, please click here to <a href="http://localhost:8080/user/verify?id=${userId}">verify</a> your mail</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};


const register = async(req,res)=>{
try {
    const {name,email,password} = req.body;

    const isUserPresent = await UserModel.findOne({email});

    if(isUserPresent) return res.status(400).send({msg:"User already exists"});

    const hasPassword = await bcrypt.hash(password,10);

    const newUser = new UserModel({name,email,password:hasPassword})
    await newUser.save()
      if (newUser) {
        sendWelcomeMail(name, email, newUser._id);
        res.status(200).json({ msg: "Registration successful", newUser });
      } else {
        res.status(401).json({ msg: "Registration failed" });
      }
} catch (error) {
    res.status(500).send(error.message);
}
}

module.exports = {register}