import GeneralServerCommunication from "@/app/server_communication/server/GeneralServerCommunication";

/**
 * Builds and returns the "About" page.
 * This provides a little information about the project
 * @constructor
 */
export default async function AboutPage() {
  const about = await GeneralServerCommunication.fetchAbout();
  return (
    <main>
      <div>
        <p className="bg-red-400 mb-10">
          <strong>Disclaimer:</strong> {about.disclaimer}
        </p>

        <h1 className="text-center">About MietMiez</h1>
        <p className="text-center text-sm">{about.about}</p>

        <details className="mt-5">
          <summary className="text-center">Privacy Note:</summary>
          <p>
            <pre className="whitespace-pre-wrap">{about.privacyNote}</pre>
          </p>
        </details>
      </div>
      <hr />
      <div className="text-center">
        <h2>Contact</h2>
        <p>
          Contact us via <a href={`mailto:${about.mail}`}>{about.mail}</a>
        </p>
      </div>
    </main>
  );
}
