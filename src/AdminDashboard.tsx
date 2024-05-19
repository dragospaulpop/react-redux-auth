import { useSelector, useDispatch } from "react-redux";
import { changeName } from "./store";
import { useState } from "react";

export default function AdminDashboard() {
  const user = useSelector((state) => state.auth.user);

  const [localUser, setLocalUser] = useState(user);

  const dispatch = useDispatch();

  const changeUser = (value) => {
    dispatch(changeName({ name: value }));
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div>
        Your name:
        <input
          className="p-2 border border-gray-300 rounded mx-2 text-black"
          type="text"
          value={localUser}
          onChange={(e) => setLocalUser(e.target.value)}
        />
        <button
          className="bg-white hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={() => {
            changeUser(localUser);
          }}
        >
          ✔
        </button>
      </div>
    </div>
  );
}
