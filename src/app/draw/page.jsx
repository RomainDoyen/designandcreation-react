import Footer from "@/components/Footer";
import Header from "@/components/Header";
import GalleryPage from "@/components/GalleryPage";

export default function DrawPage() {
  return (
    <div>
      <Header />
      <GalleryPage kind="draw" alt="dessin" />
      <Footer />
    </div>
  );
}
