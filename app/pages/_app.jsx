import "../styles/tailwind.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* Default Head properties */}
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@xz/fonts@1/serve/inter.min.css"
        />
      </Head>

      {/* Page Render and Providers */}
      <div className="font-base font-sans tracking-normal leading-normal bg-gray-200 min-h-screen">
        <Component {...pageProps} />
      </div>
    </>
  );
}