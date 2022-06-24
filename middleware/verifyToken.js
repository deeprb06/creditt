import jwt from 'jsonwebtoken';

// create function for verify token
const auth = (req, res, next) => {
  const token = req.header('auth-token');

  if (!token) return res.status(400).send({ message: 'Acess denied!' });

  try {
    //   checking for valid token
    const validToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = validToken;
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
