/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ["./src/styles"],
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
