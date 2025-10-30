"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).userDetails?.token : null;
    if (token) {
      console.error("Token is found, redirecting to Dashboard.");
      router.push("/dashboard");
    }
  }, [router]);

  const validateForm = () => {
    if (!/^[A-Za-z]{3,}/.test(username)) {
      setError("Username must contain at least 3 letters.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    setError("");
    return true;
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/auth/register`, {
        username,
        email,
        password,
      });

      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data));
        router.push('/dashboard');
      }

      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Register for LMS</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account?{" "}
        <span className="link" onClick={() => router.push("/auth/login")}>
          Login here
        </span>
      </p>

      <style jsx>{`
        .error-message {
          color: red;
          font-size: 14px;
          margin-top: 5px;
          text-align: center;
        }
        .form-container {
          max-width: 400px;
          margin: 50px auto;
          padding: 20px;
          border-radius: 10px;
          background-color: #f9f9f9;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        button {
          width: 100%;
          padding: 10px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background-color: #005ac1;
        }
        .link {
          color: #0070f3;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
