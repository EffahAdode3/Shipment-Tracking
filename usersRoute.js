import  express  from "express";
import User from "../controllers/usersController.js";
import middleware from "../middleware/auth.js"
const router = express.Router();

router.post('/signup', User.signupAdmin)
router.post('/addshipment', User.signupForClient)
router.post('/login', middleware.generateToken, User.Login)
router.put('/update', middleware.tokenVerification, User.updateInfo)
router.get('/dashboard', middleware.tokenVerification, User.getAllShipment)
router.put('/tracking', User.findOneshipment )
export default router;