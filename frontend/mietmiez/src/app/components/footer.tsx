import Link from "next/link";
import GeneralServerCommunication from "@/app/server_communication/server/GeneralServerCommunication";

export default async function Footer() {
  const about = await GeneralServerCommunication.fetchAbout();
  return (
    /* Footer */
    <footer className="bg-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#c9e265]">
              MietMiez
            </h3>
            <p className="text-gray-300 text-sm">{about.shortAbout}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/home"
                  className="text-gray-300 hover:text-[#c9e265]"
                >
                  Find pet
                </Link>
              </li>
              <li>
                <Link
                  href="/advertisement/new"
                  className="text-gray-300 hover:text-[#c9e265]"
                >
                  Advertise pet
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-300 hover:text-[#c9e265]"
                >
                  Become pet sitter
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-gray-300 hover:text-[#c9e265]"
                >
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-md font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-[#c9e265]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-[#c9e265]"
                >
                  AGB
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-[#c9e265]"
                >
                  Impressum
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-md font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Email: {about.mail}</p>
            </div>
          </div>
        </div>

        {/* ALL Rights */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>{about.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
