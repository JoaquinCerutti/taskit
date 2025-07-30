import "./globals.css";
import AuthGuard from "./AuthGuard";

export const metadata = {
  title: "#TaskIT",
  description: "Gestioná, Mantené, Resolvé.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}

