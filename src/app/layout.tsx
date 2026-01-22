import type { Metadata } from "next";
import { Provider } from "../components/ui/provider";
import { AuthProvider } from "../context/authContext";
import Navbar from "../components/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Quiz Admin Dashboard",
  description: "Admin dashboard for managing quizzes",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value?.trim();
  return (
    <html suppressHydrationWarning>
      <body>
        <AuthProvider>
          <Provider>
            <Navbar isAuthenticated={!!token} />
            {children}
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
