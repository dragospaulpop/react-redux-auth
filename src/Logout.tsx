import { useDispatch } from "react-redux";
import { logout } from "./store";
import supabase from "./supabase";
import { useCallback } from "react";

export default function Logout() {
  const dispatch = useDispatch();

  const doLogout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
    }

    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="p-4">
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={doLogout}
      >
        Logout
      </button>
    </div>
  );
}
