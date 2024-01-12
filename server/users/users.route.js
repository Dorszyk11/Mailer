const express = require("express");
const router = express.Router();
const usersService = require("./service/users");

router.get("/api/users", usersService.getUsers);
router.post("/api/users", usersService.addUser);
router.get("/api/users/recivermessages", usersService.getReciverMessages);
router.get("/api/users/sendermessages", usersService.getSenderMessages);
router.patch("/api/users/messages/:id/read", usersService.markMessageAsRead);
router.patch("/api/users/messages/:id/unread", usersService.markMessageAsUnread);
router.delete("/api/users/messages/:id", usersService.deleteMessage);
router.post("/api/users/sendMessage", usersService.sendMessage);

module.exports = router;
