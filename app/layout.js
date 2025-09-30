import "./globals.css";
import { Providers } from "./provider";
import { Exo_2 } from "next/font/google";

const exo2 = Exo_2({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"]
});

export const metadata = {
  title: "DIGI+ Tracking Indoor",
  description: "Tracking Indoor"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${exo2.className}`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
