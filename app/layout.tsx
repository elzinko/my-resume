import React from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
