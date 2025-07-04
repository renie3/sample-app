import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("You are not authenticated");

  jwt.verify(token, process.env.JWT, async (err, user) => {
    if (err) return res.status(403)("Token is not valid");

    req.userId = user.id;
    req.isAdmin = user.isAdmin;
    next();
  });
};
