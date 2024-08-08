"use client";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import AuthContext from "../api/context/authContext";
import { motion } from "framer-motion";
import AlertMessage from "../components/alert/AlertMessage";
import AlertContext from "../api/context/alertContext";
import dynamic from "next/dynamic";
const GoogleLogin = dynamic(() => import("react-google-login"), {
  ssr: false,
});

export default function Home() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [alertMessage, setAlertMessage] = useState();
  const [alertType, setAlertType] = useState();

  const router = useRouter();
  const { onSuccess, onFailure } = useContext(AuthContext);
  const { isAlertOpened, setIsAlertOpened } = useContext(AlertContext);

  const clientId =
    "640712928576-j08cmre7sj91s1lvqtbrq35i4dc0cbs1.apps.googleusercontent.com";

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Import gapi-script only on the client-side
      import("gapi-script").then((gapiScript) => {
        const gapi = gapiScript.gapi;
        function initClient() {
          gapi.client.init({
            clientId: clientId,
            scope: "",
          });
        }
        gapi.load("client:auth2", initClient);
      });
    }
  }, []);

  async function loginForm(e) {
    e.preventDefault();
    try {
      const users = await axios.post("/api/users/login", {
        email: email,
        password: password,
      });
      localStorage.setItem("token", users.data.token);
      router.push("/");
    } catch (error) {
      setAlertMessage("Wrong email or password");
      setAlertType("error");
      setIsAlertOpened(true);
    }
  }

  return (
    <main className="flex h-[100vh] flex-col items-center justify-center">
      {isAlertOpened && (
        <AlertMessage message={alertMessage} type={alertType} />
      )}
      <motion.form
        initial={{ opacity: 0, top: 60 }}
        animate={{ opacity: 1, top: 0 }}
        onSubmit={loginForm}
        className="relative w-[600px] h-[550px] flex flex-col gap-[25px] bg-[#18181b] p-[24px] rounded-xl border-[1px] border-black"
      >
        <div className="flex flex-col justify-between h-[90%]">
          <div className="flex flex-col gap-[20px]">
            <h1 className="text-center text-2xl font-[700] text-zinc-300">
              Login Form
            </h1>
            <div className="flex flex-col gap-[15px]">
              <label className="text-zinc-300 font-[700]">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="p-[10px] rounded-md border-[2px] text-black border-zinc-500 outline-none"
                type="email"
                name="email"
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <label className="text-zinc-300 font-[700]">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="p-[10px] rounded-md  border-[2px] text-black border-zinc-500 outline-none"
                type="password"
                name="password"
              />
            </div>
          </div>
          <div className="flex flex-col gap-[20px]">
            <button className="w-full py-[10px] px-4 rounded-lg bg-slate-300 text-black font-semibold flex items-center justify-center hover:bg-slate-400 transition duration-200 ease-in-out">
              Login
            </button>

            <div>
              <GoogleLogin
                clientId={clientId}
                buttonText="Sign in with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={"single_host_origin"}
                render={({ onClick }) => (
                  <button
                    onClick={onClick}
                    className="w-full py-[10px] px-4 rounded-lg bg-blue-500 text-white font-semibold flex items-center justify-center hover:bg-blue-600 transition duration-200 ease-in-out"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                      alt="Google Logo"
                      className="w-5 mr-2"
                    />
                    Sign in with Google
                  </button>
                )}
              />
            </div>
            <div className="flex items-center justify-between">
              <Link className="text-zinc-300 font-[700]" href="/">
                Back to home
              </Link>
              <Link className="text-zinc-300 font-[700]" href="/singup">
                Sing In
              </Link>
            </div>
          </div>
        </div>
      </motion.form>
    </main>
  );
}
