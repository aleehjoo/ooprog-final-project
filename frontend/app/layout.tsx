export const metadata = {
  title: "RoomEase",
  description: "Smart Property & Tenant Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
