import { useEffect, useCallback, useState } from "react";

import supabase from "./supabase";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any>([]);
  const [usersChanged, setUsersChanged] = useState(0);
  const [error, setError] = useState<any>(null);
  const [message, setMessage] = useState<any>(null);
  const [changeUsernameModal, setChangeUsernameModal] =
    useState<boolean>(false);

  const [addUserModal, setAddUserModal] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const [id, setId] = useState<string>("");

  // read the clients table only once, when page loads (empty dependency array)

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select()
        .order("createdAt", { ascending: false })
        .order("id", { ascending: true });

      if (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
        }, 5000);

        return;
      }
      setUsers(data);
    };

    fetchUsers();
  }, [usersChanged]);

  const openChangeUsernameModal = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      setError(error.message);
      setUsername("");
      setId("");
      setChangeUsernameModal(false);
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }

    setUsername(data.username || "");
    setId(id);
    setChangeUsernameModal(true);
  }, []);

  const closeChangeUsernameModal = useCallback(() => {
    setId("");
    setUsername("");
    setChangeUsernameModal(false);
  }, []);

  const changeUsername = useCallback(
    async (e, id: string, username: string) => {
      e && e.preventDefault();
      const { error } = await supabase
        .from("users")
        .update({ username })
        .eq("id", id);

      if (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
        }, 5000);
        return;
      }

      setMessage("Updated username");
      setTimeout(() => {
        setMessage(null);
      }, 5000);

      setUsersChanged(usersChanged + 1);

      setError(null);
      setUsername("");
      setId("");
      setChangeUsernameModal(false);
    },
    [usersChanged]
  );

  const changeRole = useCallback(
    async (id: string, role: string) => {
      const { error } = await supabase
        .from("users")
        .update({ role: role })
        .eq("id", id);

      if (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
        }, 5000);
        return;
      }

      setMessage("Updated role");
      setTimeout(() => {
        setMessage(null);
      }, 5000);

      setUsersChanged(usersChanged + 1);

      setError(null);
    },
    [usersChanged]
  );

  const openAddUserModal = useCallback(() => {
    setAddUserModal(true);
  }, []);

  const closeAddUserModal = useCallback(() => {
    setAddUserModal(false);
    setUsername("");
    setEmail("");
    setRole("");
    setPassword("");
  }, []);

  const addUser = useCallback(
    async (e) => {
      e.preventDefault();

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
        }, 5000);
        return;
      }

      setMessage("Added user");
      setTimeout(() => {
        setMessage(null);
      }, 5000);

      await changeUsername(null, data.user.id, username);

      setUsersChanged(usersChanged + 1);

      setError(null);
      setUsername("");
      setEmail("");
      setRole("");
      setPassword("");
      setAddUserModal(false);
    },
    [usersChanged, email, password, username, changeUsername]
  );

  return (
    <div className="p-4 grid gap-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <table className="w-full text-left border-collapse border border-gray-300 p-4">
        <caption>Users</caption>
        <thead className="text-left">
          <tr>
            <th className="text-left border border-gray-300 p-4">#</th>
            <th className="text-left border border-gray-300 p-4">id</th>
            <th className="text-left border border-gray-300 p-4">username</th>
            <th className="text-left border border-gray-300 p-4">email</th>
            <th className="text-left border border-gray-300 p-4">role</th>
            <th className="text-left border border-gray-300 p-4">created</th>
            <th className="text-left border border-gray-300 p-4">actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td className="text-right border border-gray-300 p-4">
                {index + 1}
              </td>
              <td className="text-left border border-gray-300 p-4">
                {user.id}
              </td>
              <td className="text-left border border-gray-300 p-4">
                {user.username}
              </td>
              <td className="text-left border border-gray-300 p-4">
                {user.email}
              </td>
              <td className="text-left border border-gray-300 p-4">
                {user.role}
              </td>
              <td className="text-left border border-gray-300 p-4">
                {new Date(user.createdAt).toLocaleString("ro-RO")}
              </td>
              <td className="text-left border border-gray-300 p-4">
                <div className="flex gap-2">
                  <button
                    className="border border-gray-300 hover:border-gray-400 hover:bg-slate-400 text-blue-500 text-sm p-1 rounded transition-colors"
                    onClick={() => openChangeUsernameModal(user.id)}
                  >
                    Change username
                  </button>
                  {user.role === "user" && (
                    <button
                      className="border border-gray-300 hover:border-gray-400 hover:bg-slate-400 text-orange-500 text-sm p-1 rounded transition-colors"
                      onClick={() => changeRole(user.id, "admin")}
                    >
                      Make admin
                    </button>
                  )}
                  {user.role === "admin" && (
                    <button
                      className="border border-gray-300 hover:border-gray-400 hover:bg-slate-400 text-orange-500 text-sm p-1 rounded transition-colors"
                      onClick={() => changeRole(user.id, "user")}
                    >
                      Make user
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="border border-gray-300 hover:border-gray-400 hover:bg-slate-400 text-blue-500 text-sm p-1 rounded transition-colors"
        onClick={openAddUserModal}
      >
        Add user
      </button>

      {error && (
        <div className="border border-red-500 rounded p-4 text-red-500 text-sm">
          {error}
        </div>
      )}
      {message && (
        <div className="border border-blue-500 rounded p-4 text-blue-500 text-sm">
          {message}
        </div>
      )}

      {changeUsernameModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10 flex justify-center items-center">
          <div className="bg-white rounded p-4 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-400 text-center">
                Change username
              </h3>
              <button
                className="border border-gray-300 hover:border-gray-400 hover:bg-slate-200 text-sm text-red-500 p-1 rounded transition-colors cursor-pointer"
                onClick={closeChangeUsernameModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <form
                className="grid gap-4 grid-cols-1 items-center justify-center p-4"
                onSubmit={(e) => changeUsername(e, id, username)}
              >
                <fieldset className="grid gap-4 grid-cols-1 items-center justify-center p-4">
                  <div className="grid grid-cols-2 items-center">
                    <label
                      htmlFor="username"
                      className="text-sm font-bold text-gray-400 uppercase tracking-wider block text-left pr-4"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-2 rounded border border-gray-300 bg-white text-black focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-1">
                    <button
                      className="border rounded bg-slate-400 hover:bg-slate-500 text-black hover:text-white px-4 py-2 text-sm"
                      type="submit"
                    >
                      Change username
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      )}

      {addUserModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10 flex justify-center items-center">
          <div className="bg-white rounded p-4 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-400 text-center">
                Add user
              </h3>
              <button
                className="border border-gray-300 hover:border-gray-400 hover:bg-slate-200 text-sm text-red-500 p-1 rounded transition-colors cursor-pointer"
                onClick={closeAddUserModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <form
                className="grid gap-4 grid-cols-1 items-center justify-center p-4"
                onSubmit={(e) => addUser(e)}
              >
                <fieldset className="grid gap-4 grid-cols-1 items-center justify-center p-4">
                  <div className="grid grid-cols-2 items-center">
                    <label
                      htmlFor="username"
                      className="text-sm font-bold text-gray-400 uppercase tracking-wider block text-left pr-4"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-2 rounded border border-gray-300 bg-white text-black focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center">
                    <label
                      htmlFor="email"
                      className="text-sm font-bold text-gray-400 uppercase tracking-wider block text-left pr-4"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      required
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 rounded border border-gray-300 bg-white text-black focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center">
                    <label
                      htmlFor="password"
                      className="text-sm font-bold text-gray-400 uppercase tracking-wider block text-left pr-4"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2 rounded border border-gray-300 bg-white text-black focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 items-center">
                    <label
                      htmlFor="role"
                      className="text-sm font-bold text-gray-400 uppercase tracking-wider block text-left pr-4"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-2 rounded border border-gray-300 bg-white text-black focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1">
                    <button
                      className="border rounded bg-slate-400 hover:bg-slate-500 text-black hover:text-white px-4 py-2 text-sm"
                      type="submit"
                    >
                      Add user
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
