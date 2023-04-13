const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { cloudinaryUploadImage } = require("../utils/cloudinary");

const convertToUnicode = (str) => {
  //kullanıcı username'i türkçe karakterlerden ve boşluklardan arındırıyoruz ki url olarak yazıldığında sonuç alabilelim.
  //ör:Happy Codinğ =>happycoding
  const trMap = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    I: "i",
    Ö: "o",
    Ş: "ş",
    Ü: "u",
  };

  let newStr = str.replace(/[çğıöşü]/gi, function (matched) {
    return trMap[matched];
  });

  newStr = newStr.replace(/\s+/g, "");

  return newStr.toLowerCase();
};

const createUser = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const converted = convertToUnicode(username);
  const findUser = await User.findOne({ converted });
  if (!findUser) {
    req.body.username = convertToUnicode(username);
    const newUser = await User.create(req.body);
    res.status(200).json({
      isSuccess: true,
      message: "Kayıt Oluşturuldu",
      value: newUser,
    });
  } else {
    throw new Error(
      "Bu E-mail yada kullanıcı adı ile daha önce kayıt olunmuş "
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  try {
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.matchPassword(password))) {
      res.status(200).json({
        isSuccess: true,
        message: "Oturum Açma Başarılı",
        value: {
          isAdmin: findUser.isAdmin,
          user: {
            email: findUser.email,
            username: findUser.username,
            email: findUser.email,
            profilePicture: findUser.profilePicture,
          },
          token: generateToken(findUser._id),
        },
      });
    } else {
      res.status(500).json({ message: "Kullanıcı adı yada şifre hatalı" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username }).select([
    "-password",
    "-isAdmin",
  ]);
  if (user) {
    res.status(200).json({ user });
  } else {
    res.status(404).json({ message: "Kullanıcı Bulunamadı" });
  }
});

const getProfile = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id }).select(["-password", "-isAdmin"]);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "Kullanıcı Bulunamadı" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const followUser = asyncHandler(async (req, res) => {
  try {
    const { username } = req.user; //oturum açan kullanıcı
    const { secondUser } = req.body; //takip edilmek istenen kullanıcı

    if (username !== secondUser) {
      const user = await User.findOne({ username });
      const userComesFromBody = await User.findOne({ username: secondUser });
      //Eğer kullanıcının takip edilen listesinde takip etmek istediği kullanıcı yoksa takip etmek istediği kullanıcıyı ekle
      //ve takip ettiği kullanıcının takip listesi dizisine kullanıcıyı ekle
      if (!user.followings.includes(userComesFromBody.username)) {
        await user.updateOne({
          $push: { followings: userComesFromBody.username },
        });
        await userComesFromBody.updateOne({
          $push: { followers: user.username },
        });
        res
          .status(200)
          .json({ isSuccess: true, message: "Kullanıcı Takip Edildi." });
      } else {
        res.status(403).json({
          isSuccess: false,
          message: "Bu kişiyi zaten takip ediyorsun",
        });
      }
    } else {
      res
        .status(403)
        .json({ isSuccess: false, message: "Kendi kendini takip edemezsin." });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const unfollowUser = asyncHandler(async (req, res) => {
  try {
    const { username } = req.user;
    const { secondUser } = req.body;
    if (username !== secondUser) {
      const user = await User.findOne({ username });
      const userComesFromBody = await User.findOne({ secondUser });
      //Eğer kullanıcının takip edilen listesinde takip etmek istediği kullanıcı varsa takip listesinden çıkar.
      if (user.followers.includes(userComesFromBody)) {
        await user.updateOne({ $pull: { followings: userComesFromBody } });
        await userComesFromBody.updateOne({ $pull: { followers: user } });
        res.status(200).json({
          isSuccess: true,
          message: "Kullanıcı Takipten çıkarıldı.",
          followData: user.followings,
        });
      } else {
        res.status(403).json({
          isSuccess: true,
          message: "Bu Kullanıcı Zaten Takip Etmiyorsun.",
        });
      }
    } else {
      res.status(403).json({
        isSuccess: false,
        message: "Kendi kendini takipten çıkaramazsın.",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const updateProfilePicture = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const currentUsername = req.body.data;
    const user = await User.findById(_id);
    const uploader = (path) => cloudinaryUploadImage(path, "image");

    const newPath = await uploader(req.files[0].path);
    if (user.username === currentUsername && newPath) {
      user.profilePicture = newPath.url;
      user.save();
      res.status(200).json({
        isSuccess: true,
        message: "Profil resmi başarıyla değiştirildi.",
        imageUrl: newPath.url,
      });
    } else {
      res.status(403).json({ isSuccess: false, message: "Yetkisiz Erişim" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const searchUser = asyncHandler(async (req, res) => {
  const { search } = req.body;
  //gelen stringi arat eğer yoksa boş array gönder
  try {
    if (search) {
      const user = await User.find({
        fullName: { $regex: search, $options: "i" },
      }).select(["email", "profilePicture", "username", "fullName"]);
      res.status(200).json(user);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const suggestedUser = asyncHandler(async (req, res) => {
  const { username, followings } = req.user;
  try {
    //önerilen kullanıcı listesinde kendisi ve takip ettikleri olmayacak
    const user = await User.find({
      username: { $ne: username, $nin: followings },
    });
    //gelen veriyi karıştırıyoruz.
    const suggestedUsers = user.sort(() => 0.5 - Math.random()).slice(0, 5);
    res.status(200).json(suggestedUsers);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  getUser,
  getProfile,
  followUser,
  updateProfilePicture,
  searchUser,
  unfollowUser,
  suggestedUser,
};
