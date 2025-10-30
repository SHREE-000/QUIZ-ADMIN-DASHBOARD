"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ColorModeButton,
  DarkMode,
  LightMode,
  useColorMode,
  useColorModeValue,
} from "@/src/components/ui/color-mode";
import { Box, Button, Stack, Text } from "@chakra-ui/react/";
import { toaster } from "@/src/components/ui/toaster";
import { Tooltip } from "@/src/components/ui/tooltip";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).userDetails?.token : null;
    if (token) {
      console.error("Token is found, redirecting to Dashboard.");
      router.push("/dashboard");
    }
  }, [router]);
  const handleLogin = async (e) => {
    e.preventDefault();
    const userDetails = localStorage.getItem("user");
    if (userDetails?.trim()) {
      alert("Login successful!");
      router.push("/dashboard");
    } else {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/auth/login`,
          {
            email,
            password,
          }
        );
        if (res.status === 200) {
          localStorage.setItem("user", JSON.stringify(res.data));
          router.push("/dashboard");
        }
      } catch (error) {
        alert("Invalid credentials!");
      }
    }
  };

  return (
    <div className="form-container">
      {/* <Stack spacing={6} align="center" mt={10}>
      <Tooltip content="Click to save your work!" showArrow>
        <Button colorScheme="blue">Save</Button>
      </Tooltip>

      <Tooltip content="Disabled tooltip" disabled>
        <Button colorScheme="gray">No Tooltip</Button>
      </Tooltip>

      <Tooltip
        content="This tooltip isn’t portalled"
        portalled={false}
        showArrow
      >
        <Button colorScheme="purple">Inline Tooltip</Button>
      </Tooltip>
    </Stack> */}
      {/* <Stack spacing={3} align="center" mt={10}>
      <Button
        colorScheme="green"
        onClick={() =>
          toaster.create({
            type: "success",
            title: "Quiz Published!",
            description: "Your quiz is now live.",
          })
        }
      >
        Show Success
      </Button>

      <Button
        colorScheme="red"
        onClick={() =>
          toaster.create({
            type: "error",
            title: "Failed!",
            description: "Something went wrong.",
          })
        }
      >
        Show Error
      </Button>
    </Stack> */}
      <h2>Login to LMS</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>

      <p>
        Don’t have an account?{" "}
        <span className="link" onClick={() => router.push("/auth/register")}>
          Register here
        </span>
      </p>
    </div>
  );
}
