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
import "./style.css";
import { useAuth } from "@/src/context/authContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { token } = useAuth() as { token?: string | null };
    const router = useRouter();
    useEffect(() => {
      if (!token) {
        console.error("Token is not found, redirecting to Login.");
        router.push("/auth/login");
      }
    }, [router, token]);

  return (
    <>
     Dashboard
    </>
  );
}
