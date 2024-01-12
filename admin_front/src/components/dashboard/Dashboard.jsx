import "./Dashboard.scss";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  const addUser = async (e) => {
    const form = e.target.parentNode;
    const name = form[0].value;
    const surname = form[1].value;
    const email = form[2].value;
    const emailIsValid = /^\S+@\S+\.\S+$/.test(email);
    const password = form[3].value;
    const admin = form[4].value === "true";

    if (!name || !surname || !emailIsValid || !password) {
      alert("Uzupełnij dane w formularzu");
      return;
    }

    const user = { name, surname, email, password, admin };

    const response = await axios.post(
      `/api/users?token=${sessionStorage.getItem("token")}`,
      user
    );
    const data = response.data;

    if (data.success) {
      getUsers();
    }
  };

  const getUsers = async () => {
    const response = await axios.get(
      `/api/users?token=${sessionStorage.getItem("token")}`
    );
    const data = response.data;

    if (data.success) {
      setUsers(data.users);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="dashboard-container">
      <form>
        <input type="text" placeholder="Imię" />
        <input type="text" placeholder="Nazwisko" />
        <input type="text" placeholder="Email" />
        <input type="text" placeholder="Hasło" />
        <select>
          <option value="true">ADMIN - TAK</option>
          <option value="false">ADMIN - NIE</option>
        </select>
        <button type="button" onClick={(e) => addUser(e)}>
          Zapisz
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Imię i nazwisko</th>
            <th>Email</th>
            <th>Hasło</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                {user.name} {user.surname}
              </td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.admin ? "TAK" : "NIE"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
