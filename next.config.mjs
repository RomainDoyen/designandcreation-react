/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ["./src/styles"],
    // Réduit le bruit en CI tant que la migration @use / sass:color n’est pas faite
    silenceDeprecations: [
      "import",
      "global-builtin",
      "color-functions",
      "legacy-js-api",
    ],
  },
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/uploaddraw", destination: "/admin/draw", permanent: false },
      { source: "/uploadlogo", destination: "/admin/logo", permanent: false },
    ];
  },
};

export default nextConfig;
