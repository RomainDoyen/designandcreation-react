import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Data } from "@/data/Data";

export default function AboutPage() {
  const current = Data[0];
  return (
    <div>
      <Header />
      <div className="article_view-container">
        <div className="article_view">
          <h2 className="article_view-title">{current.title}</h2>
          <h3 className="article_view-subtitle">{current.date}</h3>
          <p id="message" className="article_view-content">
            {current.infos}
          </p>
          <a
            id="link_cv"
            target="_blank"
            rel="noopener noreferrer"
            href="https://romaindoyen.vercel.app/"
          >
            <p id="cv" className="link_cv">
              {current.link}
            </p>
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
