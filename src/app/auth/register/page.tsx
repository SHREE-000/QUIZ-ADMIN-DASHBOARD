"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toaster } from "@/src/components/ui/toaster";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import "../../style.css";
import { useAuth } from "@/src/context/authContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { token } = useAuth() as { token?: string | null };

  useEffect(() => {
    if (token) {
      console.error("Token is found, redirecting to Dashboard.");
      router.push("/dashboard");
    }
  }, [router, token]);

  const validateForm = () => {
    if (!/^[A-Za-z]{3,}/.test(username)) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description: "Username must contain at least 3 letters.",
      });
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description: "Please enter a valid email address.",
      });
      return false;
    }

    if (password.length < 6) {
      toaster.create({
        type: "error",
        title: "Failed!",
        description: "Password must be at least 6 characters long.",
      });
      return false;
    }

    return true;
  };

  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/register`, {
        username,
        email,
        password,
      });
      if (res.status === 201) {
        sessionStorage.setItem("user", JSON.stringify(res.data));
        router.push("/dashboard?register=true");
        router.refresh();
      }
      router.push("/dashboard?register=true");
      router.refresh();
    } catch (error) {
      console.error(error);
      toaster.create({
        type: "error",
        title: "Failed!",
        description: "Registration failed. Please try again.",
      });
    }
  };

  return (
    <div className="form-container">
      <Fieldset.Root size="lg" maxW="md">
        <Stack>
          <Fieldset.Legend>QUIZ ADMIN PLATFORM</Fieldset.Legend>
          <Fieldset.HelperText>
            Register quiz admin portal below.
          </Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <Field.Root>
            <Field.Label>Username</Field.Label>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              required
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Email address</Field.Label>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              type="email"
              required
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              type="password"
              required
            />
          </Field.Root>
        </Fieldset.Content>

        <Button type="submit" onClick={handleRegister}>
          Sign Up
        </Button>
          <Fieldset.HelperText>
            Already have an account? <Link href="/auth/login" className="link">Sign In here</Link>
          </Fieldset.HelperText>
      </Fieldset.Root>
    </div>
  );
}
