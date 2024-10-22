const User = require("../User/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateTokens } = require("./utils");


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user.id }, 'secret', { expiresIn: '15s' }); 
    const refreshToken = jwt.sign({ id: user.id }, 'refreshSecret', { expiresIn: '7d' });


    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, 
        sameSite: 'strict', 
    });

    // const user: {
    //   accessTokenExpDate: any;
    //   refreshTokenExpDate: any;
    //   accessToken: string;
    //   refreshToken: string;
    //   username: undefined;
    //   id: string;
    //   email: string;
    //   firstName: string;
    //   lastName: string;
    //   role: number;}

    const user1 = {
        accessToken,
        refreshToken,
        username: user.firstName,
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'admin',
    }


    return res.status(200).json(user1);
} catch (error) {
    res.status(500).json({ message: error.message });
}
}


const register = async (req, res) => {
  try {
    const {firstName, lastName, email, password} = req.body;

    const exist = await User.findOne({ where: { email } });

    if (exist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({firstName, lastName, email, password});

    res.status(201).json({user});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function refresh(req, res) {

  try {
    const { refreshToken : token} = req.body;

    if (!token) return res.sendStatus(401);
      const payload = jwt.verify(token, "refreshSecret");
      const user = await User.findByPk(payload.id);
      if (!user) throw { name: "Invalid token" };

      const { accessToken , refreshToken} = generateTokens(user);
      res.status(200).json({ accessToken, refreshToken });

  } catch (error) {
    console.log(error)
      res.status(403).json(error);
  }
}
module.exports = {
  login, register, refresh
}