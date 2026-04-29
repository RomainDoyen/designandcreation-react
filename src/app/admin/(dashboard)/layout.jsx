import AdminTopBar from "@/components/AdminTopBar";

export default function AdminDashboardLayout({ children }) {
  return (
    <>
      <AdminTopBar />
      <main className="admin-main">{children}</main>
    </>
  );
}
