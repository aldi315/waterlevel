"use client";
import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [appName] = useLocalStorage("appName", "Water Level Dashboard");
  const [appLogo] = useLocalStorage("appLogo", "");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEmail("admin@example.com")
    setPassword("admin123")
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-boxdark-2">
      <div className="w-full max-w-md rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-8 flex flex-col items-center justify-center">
          {mounted && appLogo ? (
            <img src={appLogo as string} alt="App Logo" className="max-h-14 w-auto object-contain mb-3" />
          ) : (
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mb-3">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          )}
          <h1 className="text-2xl font-bold text-black dark:text-white text-center">
            {mounted ? (appName as string) : "Water Level Dashboard"}
          </h1>
          <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
            Sign in to access the monitoring system
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600 border-l-4 border-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
