const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  //tokeni al decode et ve kontrolünü gerçekleştir.
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    let token = req?.headers?.authorization?.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Lütfen Tekrar Oturum Açın");
    }
  } else {
    throw new Error("Token Bulunamadı");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const admin = await User.findOne({ email });
  if (admin.role !== "admin") {
    throw new Error("Yetkisiz Erişim");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
