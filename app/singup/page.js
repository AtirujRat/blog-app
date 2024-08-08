"use client";

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AlertContext from "../api/context/alertContext";
import AlertMessage from "../components/alert/AlertMessage";
import { motion } from "framer-motion";

const validateName = (name) => {
  if (!name) {
    return "Name is required";
  } else if (name.length < 6 || name.length > 20) {
    return "Name letter must between 6-20";
  }
};

const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  } else if (password.length < 8) {
    return "Password must be at least 6 characters";
  } else {
    return "";
  }
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [touched, setTouched] = useState({
    email: false,
    name: false,
    password: false,
  });
  const [usersEmail, setUsersEmail] = useState();
  const [alertMessage, setAlertMessage] = useState();
  const [alertType, setAlertType] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isAlertOpened, setIsAlertOpened } = useContext(AlertContext);
  const router = useRouter();

  async function getUserEmail() {
    try {
      const response = await axios.get("/api/users/getonlyemail");

      setUsersEmail(response.data.data);
    } catch {
      alert("Error from supabase");
    }
  }
  useEffect(() => {
    getUserEmail();
  }, []);

  const validateEmail = (email) => {
    if (!email) {
      return "Email is required";
    } else if (usersEmail.includes(email)) {
      return "Email already existed";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      return "Email is invalid";
    } else {
      return "";
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setEmailError(validateEmail(value, usersEmail));
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (touched.name) {
      setNameError(validateName(value));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setPasswordError(validatePassword(value));
    }
  };

  const handleBlur = (field) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [field]: true,
    }));

    if (field === "email") {
      setEmailError(validateEmail(email));
    } else if (field === "name") {
      setNameError(validateName(name));
    } else if (field === "password") {
      setPasswordError(validatePassword(password));
    }
  };

  async function singInForm(e) {
    e.preventDefault();

    const emailValidationError = validateEmail(email);
    const nameValidationError = validateName(name);
    const passwordValidationError = validatePassword(password);

    setEmailError(emailValidationError);
    setNameError(nameValidationError);
    setPasswordError(passwordValidationError);

    setTouched({ email: true, name: true, password: true });

    if (
      emailValidationError ||
      nameValidationError ||
      passwordValidationError
    ) {
      return;
    }

    try {
      setIsSubmitted(true);
      await axios.post("/api/users/singup", {
        email: email,
        password: password,
        name: name,
      });
      setAlertMessage("Register successfully.");
      setAlertType("success");
      setIsAlertOpened(true);

      setTimeout(() => {
        setIsSubmitted(false);
        router.push("/login");
      }, 1500);
    } catch (error) {
      setIsSubmitted(false);
      setAlertMessage("Register fail.");
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
        onSubmit={singInForm}
        className="relative w-[600px] h-[550px] flex flex-col gap-[30px] bg-[#18181b] p-[24px] rounded-xl border-[1px] border-black"
      >
        <div className="flex flex-col gap-[60px] h-[100%]">
          <div className="flex flex-col gap-[20px]">
            <h1 className="text-center text-2xl font-[700] text-zinc-300">
              Sing Up
            </h1>
            <div className="flex flex-col gap-[15px]">
              <label className="text-zinc-300 font-[700]">
                Email
                {touched.email && emailError && (
                  <span className="text-red-500 ml-2">{emailError}</span>
                )}
              </label>
              <input
                onChange={handleEmailChange}
                onBlur={() => handleBlur("email")}
                value={email}
                className="p-[10px] rounded-md border-[2px] text-black border-zinc-500 outline-none"
                type="email"
                name="email"
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <label className="text-zinc-300 font-[700]">
                Name
                {touched.name && nameError && (
                  <span className="text-red-500 ml-2">{nameError}</span>
                )}
              </label>
              <input
                onChange={handleNameChange}
                onBlur={() => handleBlur("name")}
                value={name}
                className="p-[10px] rounded-md  border-[2px] text-black border-zinc-500 outline-none"
                type="text"
                name="name"
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <label className="text-zinc-300 font-[700]">
                Password
                {touched.password && passwordError && (
                  <span className="text-red-500 ml-2">{passwordError}</span>
                )}
              </label>
              <input
                onChange={handlePasswordChange}
                onBlur={() => handleBlur("password")}
                value={password}
                className="p-[10px] rounded-md  border-[2px] text-black border-zinc-500 outline-none"
                type="password"
                name="password"
              />
            </div>
          </div>
          <div className="flex flex-col gap-[20px]">
            <button
              disabled={isSubmitted}
              className="w-full py-[10px] px-4 rounded-lg bg-slate-300 text-black font-semibold flex items-center justify-center hover:bg-slate-400 transition duration-200 ease-in-out"
            >
              Sing up
            </button>

            <div className="flex items-center justify-between">
              <Link className="text-zinc-300 font-[700]" href="/">
                Back to home
              </Link>
              <Link className="text-zinc-300 font-[700]" href="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </motion.form>
    </main>
  );
}
