import type { Metadata } from "next";
import { Provider } from "../components/ui/provider";
import { AuthProvider } from "../context/authContext";


export const metadata: Metadata = {
  title: "Quiz Admin Dashboard",
  description: "Admin dashboard for managing quizzes",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <body>
        <AuthProvider>
        <Provider>{children}</Provider>
        </AuthProvider>
      </body>
    </html>
  )
}
