import AdminUploadForm from "@/components/AdminUploadForm";

export const metadata = {
  title: "Admin — Logos",
  robots: { index: false, follow: false },
};

export default function AdminLogoPage() {
  return <AdminUploadForm kind="logo" />;
}
