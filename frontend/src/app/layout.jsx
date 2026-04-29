import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "BizCircle",
  description: "Your professional networking and collaboration platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
