import { useDispatch } from "react-redux";
import { login } from "./store";
export default function Login() {
  const dispatch = useDispatch();

  return (
    <div className="p-4 flex gap-2">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          dispatch(login({ user: "Admin", role: "admin" }));
        }}
      >
        Login admin
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          dispatch(login({ user: "User", role: "user" }));
        }}
      >
        Login user
      </button>
    </div>
  );
}
