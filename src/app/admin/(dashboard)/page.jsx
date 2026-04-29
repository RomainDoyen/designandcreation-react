import Link from "next/link";
import AdminProjectManager from "@/components/AdminProjectManager";

export const metadata = {
  title: "Admin — Tableau de bord",
  robots: { index: false, follow: false },
};

export default function AdminHomePage() {
  return (
    <>
      <h1 className="admin-dash__title">Tableau de bord</h1>
      <p className="admin-dash__lead">
        Gère les visuels du portfolio : chaque upload va sur{" "}
        <strong>Vercel Blob</strong> et l’URL est stockée dans{" "}
        <strong>Neon</strong>. Les pages /draw et /logo se mettent à jour
        automatiquement.
      </p>

      <div className="admin-dash__grid">
        <Link href="/admin/draw" className="admin-dash__card">
          <div className="admin-dash__card-icon" aria-hidden>
            <i className="fas fa-image" />
          </div>
          <h2 className="admin-dash__card-title">Upload dessins</h2>
          <p className="admin-dash__card-desc">
            Galerie de la page publique « Portfolio dessins ».
          </p>
          <span className="admin-dash__card-arrow">Ouvrir →</span>
        </Link>
        <Link href="/admin/logo" className="admin-dash__card">
          <div className="admin-dash__card-icon" aria-hidden>
            <i className="fas fa-vector-square" />
          </div>
          <h2 className="admin-dash__card-title">Upload logos</h2>
          <p className="admin-dash__card-desc">
            Galerie de la page « Portfolio logo ».
          </p>
          <span className="admin-dash__card-arrow">Ouvrir →</span>
        </Link>
      </div>

      <AdminProjectManager />

      <div className="admin-dash__urls">
        <div className="admin-dash__urls-head">Accès rapide — URLs</div>
        <table className="admin-dash__urls-table">
          <tbody>
            <tr>
              <th scope="row">Connexion</th>
              <td>
                <code>/admin/login</code>
              </td>
            </tr>
            <tr>
              <th scope="row">Tableau de bord</th>
              <td>
                <code>/admin</code>
              </td>
            </tr>
            <tr>
              <th scope="row">Upload dessins</th>
              <td>
                <code>/admin/draw</code>
              </td>
            </tr>
            <tr>
              <th scope="row">Upload logos</th>
              <td>
                <code>/admin/logo</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
