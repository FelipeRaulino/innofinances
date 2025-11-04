"use client";

import React from "react";
import CustomInput from "./input";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Info } from "lucide-react";
import Image from "next/image";
import PasswordInput from "./password-input";

const LoginForm = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordType, setPasswordType] = React.useState("password");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const router = useRouter();
  const { setUser } = useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => {});
        throw new Error(json?.message || "Error in login");
      }

      const me = await fetch("/api/me");
      if (!me.ok) throw new Error("Was not possible get user");
      const data = await me.json();
      setUser(data.user || null);
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === "string") {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }

  function showPassword() {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full gap-6 mt-14 items-center flex-1"
    >
      <CustomInput
        label="Email"
        type="email"
        placeholder="user@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        label="Password"
        type={passwordType}
        placeholder="******************"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        showPassword={showPassword}
      />

      {error && (
        <p className="flex items-center gap-1 font-sans text-destructive text-sm font-medium cursor-defaults">
          <Info size={16} color="#ff6467" />
          {error}
        </p>
      )}

      <button
        disabled={loading}
        className="flex justify-center items-center mt-auto mb-16 bg-primary rounded-md w-[180px] h-[45px] text-sans text-white font-bold cursor-pointer transition-colors ease-in delay-75 hover:bg-[#6c73f8] disabled:bg-[#9fa3f7] disabled:cursor-not-allowed"
      >
        {loading ? (
          <Image src="./loading.svg" width={24} height={24} alt="Loading" />
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
