'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const token = user ? JSON.parse(user)?.access_token : null;
    if (!token) {
      console.error("Token is not found, redirecting to Login.");
      router.push("/auth/login");
    }
  }, [router]);
  return (
    <html lang="en">
      <body>
        <div className="main-content">{children}</div>
      </body>
    </html>
  );
}
