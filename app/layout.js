import { Open_Sans } from "next/font/google";
import "./globals.css";
import { AlertContextProvider } from "./api/context/alertContext";
import { AuthContextProvider } from "./api/context/authContext";
import { BlogsContextProvider } from "./api/context/blogsContext";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: "500",
});
export const metadata = {
  title: "Blog-website",
  description:
    "Website that you can create your own blog and give a comment to others blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <AlertContextProvider>
          <AuthContextProvider>
            <BlogsContextProvider>{children}</BlogsContextProvider>
          </AuthContextProvider>
        </AlertContextProvider>
      </body>
    </html>
  );
}
