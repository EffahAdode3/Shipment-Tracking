import User from "../model/usersModel.js";
import Shipment from "../model/shipment.js";
import nodemailer from 'nodemailer';
import bcryptjs from "bcryptjs";
import dotenv from 'dotenv'
dotenv.config();

function generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }
const login = process.env.LOGIN
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });
  function sendClientDetails(firstName, lastName, email,  password, item_name, details, destination, current_location, item_cost, statuses, tracking_no, login) {
    const mailOptions = {
      from: 'maximnyansa75@gmail.com',
      to: email,
      subject: 'Login Details and Item Information',
      html: `
        <p>Dear ${firstName} ${lastName},</p>
        <p>Welcome to Our Movis logistics!</p>
        <p>Your account has been successfully created. Below are your login details:</p>
        <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>Please use the above credentials to login to your account.</p>
        <p>Item Information:</p>
        <ul>
        
            <li><strong>Item Name:</strong> ${item_name}</li>
            <li><strong>Item Cost:</strong> ${item_cost}</li>  
            <li><strong>Details:</strong> ${details}</li>
            <li><strong>Current Location:</strong> ${current_location}</li>
            <li><strong>Destination:</strong> ${destination}</li>   
            <li><strong>Statuses:</strong> ${statuses}</li>

            <p>To view the status and location of your shipment use<li><strong>Tracking Number:</strong> ${tracking_no}</li></p>  
        </ul>   
        <a href="${login}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px;">
          Click here to login 
         </a>
        <p>Thank you,</p>
        <p>Movis logistics</p>
      `
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending verification email:', error);
      } else {
        console.log('Verification email sent:', info.response);
      }
    });
  };
  

// sign up for admin
const signupAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, role } = req.body;
        const existingAdmin = await User.findOne({ where: { email } });
        if (existingAdmin) {
            return res.status(409).json({ message: 'Admin Already Registed' });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            role
        });
        if (newUser) {
            return res.status(201).json({ message: 'Admin Add successfully' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};

// login 
const Login = async(req, res, next) =>{
    const token = req.token;
    const User = req.body;

    if(User){
      return res.status(200).json({message:" Successfull login",token, user:req.user});    
    }
};

// sign in for client
// Add Shipment

const signupForClient = async (req, res) => {
  try {
      const { firstName, lastName, email, password, phoneNumber, address, item_name, statuses, details, destination, current_location, item_cost } = req.body;
      const existingClient = await User.findOne({ where: { email } });
      let userid = null;
      if (existingClient) {
           userid = existingClient.id
          //return res.status(409).json({ message: 'Email is taken' });
      }else{

      // Create a new client
      const newClient = await User.create({
          firstName,
          lastName,
          email,
          password: await bcryptjs.hash(password, 10),
          phoneNumber,
      });

      userid = newClient.id
    }
      // Create a shipment associated with the new client
      if (true) {
          const tracking_Number = generateVerificationCode();
          sendClientDetails(firstName, lastName, email, password, item_name, details, destination, current_location, item_cost, statuses, tracking_Number, login);
          const shipmentData = {
              item_name,
              details,
              destination,
              current_location,
              item_cost,
              address,
              statuses,
              tracking_no: tracking_Number,
              client_id: userid // Associate the shipment with the new client
          };
          const shipmentDetails = await Shipment.create(shipmentData);
          if (shipmentDetails) {
              return res.status(201).json({ message: "Successfully" });
          }
      }

  } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error");
  }
};

// update
const updateInfo = async (req, res) => {
  try {
    const { address, item_name, statuses, details, destination, current_location, item_cost, tracking_no } = req.body;
    const updateClientShipment = await Shipment.findOne({ where: { tracking_no } });
    if  (!updateClientShipment){
    return res.status(409).json({ message: "Shipment was not found"})
    }
    const shipmentData = {
      item_name,
      details,
      destination,
      current_location,
      item_cost,
      address,
      statuses,
  };
  const updateDetails = await Shipment.update(shipmentData);
  if (updateDetails) {
      return res.status(201).json({ message: "Shipment has been Updated" });
}
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}

// Get all Shipment

const getAllShipment = async (req, res) => {
  try {
    console.log(req.User_id)
    let allShipment = [];
    // const user = await User.findOne({
    //   where: {
    //     id: req.User_id
    //   }
    // })
    const user = await User.findByPk(req.User_id);
    if(user.role == "admin"){
      allShipment = await Shipment.findAll();
    }else{
      allShipment = await Shipment.findAll({
        where: {
          client_id: user.id
        }
      });
    }
    
    if (allShipment.length === 0) {
      return res.status(409).json({ message: "No Shipment found" });
    }
    return res.status(200).json({
      message: "Success",
      // data: allProduct,
      allShipment
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get one shipment 
const findOneshipment = async (req, res) => {
  try {
    const { tracking_no } = req.body;
    const find_tracking_Number = await Shipment.findAll({ where: { tracking_no } });
    if(find_tracking_Number.length === 0 ){
      return res.status(409).json({ message: `No Shipment with tracking number ${tracking_no} exist` });
    }
    return res.status(200).json({
      message: "Success",
     find_tracking_Number
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default{signupAdmin,Login, signupForClient, updateInfo, getAllShipment, findOneshipment}