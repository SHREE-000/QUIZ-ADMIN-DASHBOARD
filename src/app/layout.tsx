import type { Metadata } from "next";
import { Provider } from "../components/ui/provider";


export const metadata: Metadata = {
  title: "Quiz Admin Dashboard",
  description: "Admin dashboard for managing quizzes",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
