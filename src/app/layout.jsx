import "./globals.scss";

export const metadata = {
  title: "Design And Creation",
  description:
    "Design And Creation est un portfolio de création artistique",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
