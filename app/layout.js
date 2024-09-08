import "./globals.css";

export const metadata = {
  title: "Blog-website",
  description:
    "Website that you can create your own blog and give a comment to others blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
