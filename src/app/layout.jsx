import "./globals.css";

export const metadata = {
  title: "KDP Puzzle & Coloring Book Generator",
  description: "Generate print-ready KDP puzzle books, mazes, sudoku, word search, and coloring pages.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
