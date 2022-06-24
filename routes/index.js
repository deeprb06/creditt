import express from 'express';
import userController from '../controllers/userController';
import auth from '../middleware/verifyToken';
import { userupload } from '../middleware/multer';
const router = express.Router();

// get user information
router.get('/', auth, userController.getUserInfo);

// handling register router
router.post('/register', userController.register);

// handling login router
router.post('/login', userController.userLogin);

// get all pagination user
router.get('/alluser', auth, userController.getAllUsers);

// image upload
router.put(
  '/profile',
  auth,
  userupload.single('profile_img'),
  userController.updateProfile,
);

// delete user routes
router.delete('/:id', userController.userDelete);

// delete user routes
router.get('/all', userController.getAllUsers);

export default router;
