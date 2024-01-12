const UserModel = require("./../../models/users");
const MessagesModel = require("./../../models/mesagges");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    const token = req.query.token;
    jwt.verify(token, "mailer123");
    const users = await UserModel.find();
    return res.status(200).json({ success: true, users: users });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return res.status(500).json({ success: false });
  }
};

const addUser = async (req, res) => {
  const user = req.body;
  try {
    const token = req.query.token;
    const decoded = jwt.verify(token, "mailer123");
    if (!decoded.admin) {
      return res.status(200).json({ success: false });
    }
    const newUser = await UserModel.create(user);
    newUser.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in addUser:", error);
    return res.status(500).json({ success: false });
  }
};

const getReciverMessages = async (req, res) => {
  try {
    const token = req.query.token;
    const decoded = jwt.verify(token, "mailer123");
    const userMessages = await MessagesModel.find({ receiver: decoded.email });
    return res.status(200).json({ success: true, messages: userMessages });
  } catch (error) {
    console.error("Error in getUserMessages:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getSenderMessages = async (req, res) => {
  try {
    const token = req.query.token;
    const decoded = jwt.verify(token, "mailer123");
    const userMessages = await MessagesModel.find({ sender: decoded.email });
    return res.status(200).json({ success: true, messages: userMessages });
  } catch (error) {
    console.error("Error in getSenderMessages:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markMessageAsRead = async (req, res) => {
  try {
    const messageId = req.params.id;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, "mailer123");
    await MessagesModel.findByIdAndUpdate(messageId, { read: true });
    return res
      .status(200)
      .json({ success: true, message: "Message marked as read" });
  } catch (error) {
    console.error("Error in markMessageAsRead:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markMessageAsUnread = async (req, res) => {
  try {
    const messageId = req.params.id;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, "mailer123");
    await MessagesModel.findByIdAndUpdate(messageId, { read: false });
    return res
      .status(200)
      .json({ success: true, message: "Message marked as unread" });
  } catch (error) {
    console.error("Error in markMessageAsUnread:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, "mailer123");

    await MessagesModel.findByIdAndDelete(messageId);
    return res.status(200).json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const sendMessage = async (req, res) => {
  const { title, sender, receiver, content } = req.body;

  try {
    const message = new MessagesModel({
      title,
      sender,
      receiver,
      content,
      read: false,
      date: Date.now(),
    });

    await message.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getUsers,
  addUser,
  getReciverMessages,
  getSenderMessages,
  markMessageAsRead,
  markMessageAsUnread,
  deleteMessage,
  sendMessage,
};
