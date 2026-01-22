"use client";

import { useState, useEffect } from "react";
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

export default function LoginPage() {
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
  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!validateForm()) return;
    const userDetails = sessionStorage.getItem("user");
    if (userDetails?.trim()) {
      router.push("/dashboard");
      router.refresh();
    } else {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/login`,
          {
            email,
            password,
          }
        );
        if (res.status === 200) {
          sessionStorage.setItem("user", JSON.stringify(res.data));
          router.push("/dashboard?login=true");
          router.refresh();
        }
      } catch (error: unknown) {
                toaster.create({
          type: "error",
          title: "Failed!",
          description: `${(error as Error).message} ? ${(error as Error).message} : Invalid credentials!`,
        });
      }
    }
  };

  return (
    <div className="form-container">
       <Fieldset.Root size="lg" maxW="md">
         <Stack>
           <Fieldset.Legend>QUIZ ADMIN PLATFORM</Fieldset.Legend>
           <Fieldset.HelperText>
             Login quiz admin portal below.
           </Fieldset.HelperText>
         </Stack>
 
         <Fieldset.Content>
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
 
         <Button type="submit" onClick={handleLogin}>
           Sign In
         </Button>
           <Fieldset.HelperText>
             Already have an account? <Link href="/auth/register" className="link">Signup here</Link>
           </Fieldset.HelperText>
       </Fieldset.Root>
    </div>
  );
}
