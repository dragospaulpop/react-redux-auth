import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { changeUsername } from "./store";
import { changeRole } from "./store";

import supabase from "./supabase";

export default function UserPage() {
  const dispatch = useDispatch();

  const [error, setError] = useState<any>(null);
  const [message, setMessage] = useState<any>(null);
  const [username, setUsername] = useState<string>("");

  const myId = useSelector((state) => state.auth.id);
  const myUsername = useSelector((state) => state.auth.username);
  const myEmail = useSelector((state) => state.auth.email);
  const myRole = useSelector((state) => state.auth.role);

  const [changeMyUsernameModal, setChangeMyUsernameModal] =
    useState<boolean>(false);

  const [userChanged, setUserChanged] = useState<number>(0);

  const openChangeMyUsernameModal = useCallback(async () => {
    setUsername(myUsername);
    setChangeMyUsernameModal(true);
  }, [myUsername]);

  const closeChangeMyUsernameModal = useCallback(() => {
    setUsername("");
    setChangeMyUsernameModal(false);
  }, []);

  const changeMyUsername = useCallback(
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

      dispatch(changeUsername(username));

      setUserChanged(userChanged + 1);

      setError(null);
      setUsername("");
      setChangeMyUsernameModal(false);
    },
    [userChanged, dispatch]
  );

  const makeMyselfAdmin = useCallback(async () => {
    const { error } = await supabase
      .from("users")
      .update({ role: "admin" })
      .eq("id", myId);

    if (error) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }

    dispatch(changeRole("admin"));

    setError(null);
    setChangeMyUsernameModal(false);
  }, [myId, dispatch]);

  const makeRandomUserAdmin = useCallback(async () => {
    const { data } = await supabase
      .from("users")
      .select("id")
      .neq("id", myId)
      .eq("role", "user");

    if (!data || data.length === 0) {
      setError("No users found");
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }

    const { data: changedData, error } = await supabase
      .from("users")
      .update({ role: "admin" })
      .eq("id", data[Math.floor(Math.random() * data.length)].id)
      .select();

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Updated " + changedData.length + " users");

    setTimeout(() => {
      setMessage(null);
    }, 5000);

    setError(null);
  }, [myId]);

  return (
    <>
      <div className="p-4">
        <h1 className="text-3xl font-bold">User Page</h1>
        <h2>
          Welcome: {myUsername || myEmail}, you are {myRole}
        </h2>

        <div className="flex gap-2 my-2">
          <button
            className="border border-gray-300 hover:border-gray-400 hover:bg-slate-400 text-blue-500 text-sm p-1 rounded transition-colors"
            onClick={() => openChangeMyUsernameModal()}
          >
            Change username
          </button>
          <button
            className="border border-gray-300 hover:border-gray-400 hover:bg-slate-400 text-blue-500 text-sm p-1 rounded transition-colors"
            onClick={() => makeMyselfAdmin()}
          >
            Make myself admin
          </button>
          <button
            className="border border-gray-300 hover:border-gray-400 hover:bg-slate-400 text-blue-500 text-sm p-1 rounded transition-colors"
            onClick={() => makeRandomUserAdmin()}
          >
            Make random user admin
          </button>
        </div>
      </div>
      {changeMyUsernameModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10 flex justify-center items-center">
          <div className="bg-white rounded p-4 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-400 text-center">
                Change username
              </h3>
              <button
                className="border border-gray-300 hover:border-gray-400 hover:bg-slate-200 text-sm text-red-500 p-1 rounded transition-colors cursor-pointer"
                onClick={closeChangeMyUsernameModal}
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
                onSubmit={(e) => changeMyUsername(e, myId, username)}
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
    </>
  );
}
