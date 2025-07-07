import Image from "next/image";

export default function HelpPage() {
  return (
    <main className="px-6 py-12 max-w-3xl mx-auto">
      {/* Intro */}
      <section className="mb-10 space-y-4 text-center">
        <h1 className="text-3xl font-bold">Need Help?</h1>
        <p>If you&#39;re having trouble, feel free to reach out...</p>
      </section>

      {/* Contact Section */}
      <section className="mb-10 text-center">
        <h2 className="text-2xl font-semibold mb-2">Contact</h2>
        <p>
          Contact us via{" "}
          <a
            href="mailto:info@mietmiez.de"
            className="text-blue-600 underline hover:text-blue-800"
          >
            info@mietmiez.de
          </a>
        </p>
      </section>

      {/* Repo Section */}
      <section className="text-center space-y-4">
        <p>Or check out our repository for detailed technical insight:</p>
        <div className="inline-block">
          <Image
            src="/git.png"
            alt="Git Repository"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>
      </section>
    </main>
  );
}
