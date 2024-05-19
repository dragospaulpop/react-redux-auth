import { useDispatch } from "react-redux";
import { logout } from "./store";

export default function Logout() {
  const dispatch = useDispatch();

  return (
    <div className="p-4">
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => dispatch(logout())}
      >
        Logout
      </button>
    </div>
  );
}
