import GeneralServerCommunication from "@/app/server_communication/GeneralServerCommunication";

export default async function AboutPage() {
  const about = await GeneralServerCommunication.fetchAbout();
  return (
    <main>
      <div>
        <h1>About MietMiez</h1>
        <p>
          <strong>Disclaimer:</strong> {about.disclaimer}
        </p>
        <p>{about.about}</p>
        <p>
          <strong>Privacy Note:</strong> {about.privacyNote}
        </p>
      </div>
      <hr />
      <div>
        <h2>Contact</h2>
        <p>
          Contact us via <a href={`mailto:${about.mail}`}>{about.mail}</a>
        </p>
      </div>
    </main>
  );
}
