import Login from "./Login";
import Logout from "./Logout";
import AdminDashboard from "./AdminDashboard";
import UserPage from "./UserPage";

import { useSelector } from "react-redux";

export default function Guard() {
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);

  return (
    <>
      <h1 className="text-3xl font-bold">{user || "Anonymous"}</h1>
      {user ? <Logout /> : <Login />}

      {user && role === "admin" && <AdminDashboard />}
      {user && role === "user" && <UserPage />}
    </>
  );
}
