import Footer from "@/components/Footer";
import Header from "@/components/Header";
import GalleryPage from "@/components/GalleryPage";

export default function LogoPage() {
  return (
    <div>
      <Header />
      <GalleryPage kind="logo" alt="logo" />
      <Footer />
    </div>
  );
}
