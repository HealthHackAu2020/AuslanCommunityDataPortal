import React from "react";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Auslan Community Portal</title>
      </Head>
      <div className="mx-auto container flex h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">Auslan Community Portal</h1>
      </div>
    </>
  );
}
