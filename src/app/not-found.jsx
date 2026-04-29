import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <div>
      <Header />
      <div className="notFound">
        <div className="notFound-content">
          <Link href="/">
            Retour à l&apos;accueil <i className="fas fa-home" />
          </Link>
          <img src="/assets/images/404-error.png" alt="Page non trouvée" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
