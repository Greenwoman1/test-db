const User = require("../../User/User")

const jwt = require("jsonwebtoken")



function generateTokens(user) {
  const accessToken = jwt.sign({ id: user.id }, "secret", { expiresIn: "15m" }); 
  const refreshToken = jwt.sign({ id: user.id }, "refreshSecret", { expiresIn: "7d" });
  return { accessToken, refreshToken };
}
async function authentication(req, res, next) {
  try {
      if (!req.headers.authorization) throw { name: "Invalid token" };
      let [type, token] = req.headers.authorization.split(" ");
      if (type !== "Bearer") throw { name: "Invalid token" };
      
      let payload;
      try {
          payload = jwt.verify(token, "secret");
      } catch (error) {
          return res.status(401).json({ message: "Access token expired" });
      }

      let user = await User.findByPk(payload.id);
      if (!user) throw { name: "Invalid token" };
      req.user = {
          id: user.id
      };
      next();
  } catch (error) {
      res.status(401).json(error);
  }
}


async function refresh(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(401);

  try {
      const payload = jwt.verify(refreshToken, "refreshSecret");
      const user = await User.findByPk(payload.id);
      if (!user) throw { name: "Invalid token" };

      const { accessToken } = generateTokens(user);
      res.json({ accessToken });
  } catch (error) {
      res.status(403).json({ message: "Invalid refresh token" });
  }
}

module.exports = {
  authentication, refresh, generateTokens
}