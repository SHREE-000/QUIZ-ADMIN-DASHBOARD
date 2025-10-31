export const metadata = {
  title: " Quiz Admin",
  description: "Login and Register pages for Quiz Admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        <div className="main-content">{children}</div>
      </body>
    </html>
  );
}
