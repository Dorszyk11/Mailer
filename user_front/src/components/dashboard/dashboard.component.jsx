import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.scss";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [emailTitle, setEmailTitle] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [senderMessages, setSenderMessages] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);

      setLoggedInUser(decoded.email);
    }
    fetchUsersList();
    fetchUserMessages();
    fetchSenderMessages();
  }, []);

  const fetchUsersList = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get("/api/users", { params: { token } });
      if (response.data.success) {
        setUsersList(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchSenderMessages = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get("/api/users/sendermessages", {
        params: { token },
      });
      console.log(token)
      if (response.data.success) {
        setSenderMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching sender messages:", error);
    }
  };

  const fetchUserMessages = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.get("/api/users/recivermessages", {
        params: { token },
      });
      if (response.data.success) {
        setUserMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching user messages:", error);
    }
  };

  const handleUserSelect = (e) => setSelectedUser(e.target.value);
  const handleEmailTitleChange = (e) => setEmailTitle(e.target.value);
  const handleEmailContentChange = (e) => setEmailContent(e.target.value);

  const sendEmail = async () => {
    if (!selectedUser || !emailTitle || !emailContent) {
      setNotificationVisible({ type: "error", message: "Proszę uzupełnić wszystkie pola." });
      setTimeout(() => {
        setNotificationVisible(null);
      }, 2000);
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const dateNow = new Date().toISOString();

      await axios.post(
        "/api/users/sendMessage",
        {
          receiver: selectedUser,
          title: emailTitle,
          content: emailContent,
          sender: loggedInUser,
          date: dateNow,
          read: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmailTitle("");
      setEmailContent("");
      fetchUserMessages();
      fetchSenderMessages();
      setNotificationVisible({ type: "success", message: "Wiadomość została wysłana." });
      setTimeout(() => {
        setNotificationVisible(null);
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
      setNotificationVisible({ type: "error", message: "Wystąpił błąd podczas wysyłania wiadomości." });
      setTimeout(() => {
        setNotificationVisible(null);
      }, 2000);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.patch(
        `/api/users/messages/${messageId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUserMessages();
      fetchSenderMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const markAsUnread = async (messageId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.patch(
        `/api/users/messages/${messageId}/unread`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUserMessages();
      fetchSenderMessages();
    } catch (error) {
      console.error("Error marking message as unread:", error);
    }
  };

  const deleteMessage = async (messageId) => {
  try {
    const token = sessionStorage.getItem("token");
    await axios.delete(`/api/users/messages/${messageId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchUserMessages();
    fetchSenderMessages();
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "http://localhost:3000/";
  };

  return (
    <div>
      <div className="userInfo">
        {loggedInUser && <p className="loggedUser">Zalogowano jako: {loggedInUser}</p>}
        <button className="logout" onClick={handleLogout}>Wyloguj</button>
      </div>
      <div className="dashboard-content">
        <div className="newMessage">
          <h3>Wyślij nową wiadomość</h3>
          <select className="receiver" value={selectedUser} onChange={handleUserSelect}>
            <option value="" disabled>
              Odbiorca
            </option>
            {usersList.map((user) => (
              <option key={user._id} value={user.email}>
                {user.email}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tytuł"
            className="title"
            value={emailTitle}
            onChange={handleEmailTitleChange}
          />
          <textarea
            className="message"
            placeholder="Wiadomość"
            value={emailContent}
            onChange={handleEmailContentChange}
          ></textarea>
          <button className="send" onClick={sendEmail}>Send</button>
        </div>
        <div className='existingMessages'>
          <div className='sentedMessages'>Wysłane
            {senderMessages.map((message) => (
              <div
                key={message._id}
                className={`message ${message.read ? "read" : "unread"}`}
              >
                <p>Tytuł: {message.title}</p>
                <div className="usersInfo"><p>Od: {message.sender}</p><p>Do: {message.receiver}</p></div>
                <p>Data: {new Date(message.date).toLocaleString()}</p>
                <p className="messageContent">{message.content}</p>
                <button className="messageFunctionButton" onClick={() => deleteMessage(message._id)}>Usuń</button>
              </div>
            ))}
          </div>
          <div className='receivedMessages'>Odebrane
            {userMessages.map((message) => (
              <div
                key={message._id}
                className={`message ${message.read ? "read" : "unread"}`}
              >
                <p>Tytuł: {message.title}</p>
                <div className="usersInfo"><p>Od: {message.sender}</p><p>Do: {message.receiver}</p></div>
                <p>Data: {new Date(message.date).toLocaleString()}</p>
                <p className="messageContent">{message.content}</p>
                <button className="messageFunctionButton" onClick={() => markAsRead(message._id)}>
                  Oznacz jako przeczytane
                </button>
                <button className="messageFunctionButton" onClick={() => markAsUnread(message._id)}>
                  Oznacz jako nieprzeczytane
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {notificationVisible && (
        <div className={`notification ${notificationVisible.type}`}>
          {notificationVisible.message}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
