import Login from "./Login";
import Logout from "./Logout";
import AdminDashboard from "./AdminDashboard";
import UserPage from "./UserPage";

import { useSelector } from "react-redux";
import LoginSignupForm from "./LoginSignupForm";

export default function Guard() {
  const id = useSelector((state) => state.auth.id);
  const username = useSelector((state) => state.auth.username);
  const email = useSelector((state) => state.auth.email);
  const role = useSelector((state) => state.auth.role);

  return (
    <>
      <h1 className="text-3xl font-bold">{username || email || "Anonymous"}</h1>
      {id ? <Logout /> : <LoginSignupForm />}

      {id && role === "admin" && <AdminDashboard />}
      {id && role === "user" && <UserPage />}
    </>
  );
}
