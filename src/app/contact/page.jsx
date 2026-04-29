import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ContactPage() {
  return (
    <div>
      <Header />
      <div className="articles">
        <div className="container">
          <h2 className="articles_title">Contact</h2>
          <div className="articles_items art">
            <div className="profile-card">
              <div className="top-section">
                <i className="message fas fa-envelope" />
                <i className="notif fas fa-bell" />
                <div className="pic">
                  <img src="/assets/images/DAC3.png" alt="logo" />
                </div>
                <div className="name">Design And Creation</div>
                <div className="tag">@designandcreation_rd</div>
              </div>
              <div className="bottom-section">
                <div className="social-media">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.facebook.com/designandcreation39"
                  >
                    <i className="fab fa-facebook" />
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.instagram.com/designandcreation_rd/"
                  >
                    <i className="fab fa-instagram" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
