// Import user model
import User from '../models/user';
import validation from '../validation/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class userController {
  // register user

  static async register(req, res) {
    // getting data from body
    const { email, password } = req.body;

    try {
      // implement joi validation
      const { error } = validation.register(req.body);

      //sending an error responce
      if (error)
        return res.status(400).json({ message: error.details[0].message });

      // checking for an email already present in database
      const user = await User.findOne({ email });

      // sending error responce if email not exits
      if (user)
        return res
          .status(400)
          .json({ message: 'You are already exits user , Please Login!' });

      //Encrypt user password
      const hashpassword = await bcrypt.hash(password, 10);

      // create a new user
      const newuser = await User.create({
        ...req.body,
        password: hashpassword,
      });

      res
        .status(201)
        .json({ message: 'user create successfully', data: newuser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error, message: 'Internal Server Error' });
    }
  }

  // getting user information
  static async getUserInfo(req, res) {
    const { userid } = req.user;

    try {
      const user = await User.findOne({ _id: userid });
      // sending error responce if email not exits

      res.status(201).json({ data: user, message: 'successfull.' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error, message: 'Internal Server Error' });
    }
  }

  //   login user
  static async userLogin(req, res) {
    // getting data from body
    const { email, password } = req.body;

    try {
      // implement joi validation
      const { error } = validation.login(req.body);

      //sending an error responce
      if (error) return res.status(400).json(error.details[0].message);

      // checking for an email already present in database
      const user = await User.findOne({ email });

      // sending error responce if email not exits
      if (!user)
        return res
          .status(400)
          .json({ message: 'Email not found , Please Signup' });

      // compare hashpassword for login
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass)
        return res.status(400).send({ message: 'Incorrect Password' });

      // create an assign token
      const token = jwt.sign({ userid: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: '1h',
      });

      res
        .header('auth-token')
        .send({ message: `Welcome to dashboard ${user.name}`, token });
    } catch (error) {
      res.status(400).json({ message: error });
      console.log(error);
      res.status(500).json({ error: error, message: 'Internal Server Error' });
    }
  }

  // user profile update
  static async updateProfile(req, res) {
    const { userid } = req.user;
    const filename = req.file.filename;
    try {
      const user = await User.findOne({ _id: userid });
      if (!user)
        return res.status(400).json({ message: 'User is not exists.' });

      let updatedata = await User.findOneAndUpdate(
        { _id: userid },
        { $set: { profile: filename } },
        { new: true },
      );

      res.status(201).json({ data: updatedata, message: 'profile update.' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error, message: 'Internal Server Error' });
    }
  }

  // getting all user data
  static async getAllUsers(req, res) {
    try {
      let { page, size, sort } = req.query;

      if (!page) page = 1;

      if (!size) size = 5;

      // for pagination
      let limit = parseInt(size);
      let skip = (page - 1) * size;

      // for sorting query
      let sortquery = {};
      if ((sort['key'] = 'name')) {
        sortquery = { name: sort['order'] };
      } else if ((sort['key'] = 'createdAt')) {
        sortquery = { createdAt: sort['order'] };
      }

      //   counting total number of user
      const usercount = await User.find().countDocuments();

      const users = await User.find().limit(limit).skip(skip).sort(sortquery);

      const res_json = {
        page: page,
        size: size,
        totalusers: usercount,
        users: users,
      };

      res
        .status(201)
        .json({ data: res_json, message: 'All Data with pagination' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error, message: 'Internal Server Error' });
    }
  }

  //   user delete
  static async userDelete(req, res) {
    try {
      await User.deleteOne({ id: req.params.id });

      res.status(200).send({ message: 'User has been deleted' });
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: error, message: 'Internal Server Error' });
    }
  }
}
export default userController;
