import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const metadata = {
  title: " Quiz Admin",
  description: "Login and Register pages for Quiz Admin",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value?.trim();
    if(token) redirect("/dashboard");

  return (
    <html lang="en">
      <body>
        <div className="main-content">{children}</div>
      </body>
    </html>
  );
}
