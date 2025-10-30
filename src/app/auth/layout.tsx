import Link from "next/link";

export const metadata = {
  title: "LMS App",
  description: "Login and Register pages for LMS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <h2>LMS App</h2>
          <div>
            <Link href="/auth/login">Login</Link>
            <Link href="/auth/register">Register</Link>
          </div>
        </nav>
        <div className="main-content">{children}</div>
      </body>
    </html>
  );
}
