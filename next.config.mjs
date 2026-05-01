const nextConfig = {
    output: 'export', // <--- Added
    trailingSlash: true, // <--- Added (optional, but recommended for static exports)
    images: {
        unoptimized: true, // <--- Added (required for static export)
    },
};