/** @type {import('next').NextConfig} */
const nextConfig = {
	// The mailer embeds the logo from disk; public/ is not bundled into serverless functions by default.
	outputFileTracingIncludes: {
		"/api/newsletter/subscribe": ["./public/sugnl-logo.png"],
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			// Dutch MVP photos (app/dutch-mvps); same hosts as img-src in proxy.ts.
			{ protocol: "https", hostname: "mvp.sitecore.com" },
			{ protocol: "https", hostname: "mvp.sitecore.net" },
			{ protocol: "https", hostname: "www.gravatar.com", pathname: "/avatar/**" },
			{ protocol: "https", hostname: "secure.gravatar.com", pathname: "/avatar/**" },
		],
	},
};

module.exports = nextConfig;
