/** Nom de fichier sûr pour chemins d’upload */
export function sanitizeFilename(name) {
  return String(name || "file")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 120);
}
