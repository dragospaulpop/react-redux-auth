import { useCallback, useState } from "react";
import supabase from "./supabase";
import { login } from "./store";
import { useDispatch } from "react-redux";

export default function LoginSignupForm() {
  const dispatch = useDispatch();

  const [action, setAction] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const setUserInRedux = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", userId)
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      dispatch(
        login({
          id: data.id,
          email: data.email,
          username: data.username,
          role: data.role,
        })
      );
    },
    [dispatch]
  );

  const validateForm = useCallback(() => {
    if (email === "" || password === "") {
      setError("Please fill in all fields");
      return false;
    }

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email) === false) {
      setError("Invalid email address");
      return false;
    }

    if (action === "signup") {
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return false;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return false;
      }

      if (/[0-9]/.test(password) === false) {
        setError("Password must contain at least one number");
        return false;
      }

      if (/[a-z]/.test(password) === false) {
        setError("Password must contain at least one lowercase letter");
        return false;
      }

      if (/[A-Z]/.test(password) === false) {
        setError("Password must contain at least one uppercase letter");
        return false;
      }

      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) === false) {
        setError("Password must contain at least one special character");
        return false;
      }
    }

    setError("");
    return true;
  }, [email, password, confirmPassword, action]);

  const doLogin = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setError("");
    setMessage("Login successful");

    setUserInRedux(data.user.id as string);
  }, [email, password, setUserInRedux]);

  const doSignup = useCallback(async () => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setUserInRedux(data.user.id as string);

    setError("");
    setMessage("Signup successful");
  }, [email, password, setUserInRedux]);

  const performAction = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setError("");

      if (action === "login") {
        doLogin();
      } else {
        doSignup();
      }
    },
    [action, doLogin, doSignup, validateForm]
  );

  return (
    <form className="mt-12 border rounded bg-white p-4 ">
      <fieldset className="grid gap-4 grid-cols-1 items-center justify-center p-4">
        <legend className="text-lg font-bold text-gray-400 text-center mb-4">
          {action === "login" ? "Login" : "Signup"}
        </legend>
        <div className="grid grid-cols-2 items-center">
          <label
            htmlFor="email"
            className="text-sm font-bold text-gray-400 uppercase tracking-wider block text-left pr-4"
          >
            Email
          </label>
          <input
            type="email"
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
        {action === "signup" && (
          <div className="grid grid-cols-2 items-center">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-bold text-gray-400 uppercase tracking-wider block text-left pr-4"
            >
              Confirm Password
            </label>
            <input
              type="password"
              required
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 bg-white text-black focus:outline-none focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
        <div className="grid grid-cols-2">
          <div className="flex justify-center items-center text-black text-sm mr-4">
            {action === "login" ? (
              <>
                <span>Don't have an account?</span>
                <a
                  href="#"
                  className="pl-2 text-blue-500 font-bold"
                  onClick={(e) => {
                    e.preventDefault();
                    setAction("signup");
                  }}
                >
                  Signup now!
                </a>
              </>
            ) : (
              <>
                <span>Already have an account?</span>
                <a
                  href="#"
                  className="pl-2 text-blue-500 font-bold"
                  onClick={(e) => {
                    e.preventDefault();
                    setAction("login");
                  }}
                >
                  Login now!
                </a>
              </>
            )}
          </div>
          <button
            className="border rounded bg-slate-400 hover:bg-slate-500 text-black hover:text-white px-4 py-2 text-sm"
            onClick={performAction}
          >
            {action === "login" ? "Login" : "Signup"}
          </button>
        </div>
        {error && (
          <div className="border border-red-500 rounded p-4 text-red-500 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="border border-green-500 rounded p-4 text-green-500 text-sm">
            {message}
          </div>
        )}
      </fieldset>
    </form>
  );
}
