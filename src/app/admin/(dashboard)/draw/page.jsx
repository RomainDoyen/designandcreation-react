import AdminUploadForm from "@/components/AdminUploadForm";

export const metadata = {
  title: "Admin — Dessins",
  robots: { index: false, follow: false },
};

export default function AdminDrawPage() {
  return <AdminUploadForm kind="draw" />;
}
