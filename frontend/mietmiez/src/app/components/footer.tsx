import Link from "next/link";

export default function Footer() {
    return (
        /* Footer */
        <footer className="bg-gray-800 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-[#c9e265]">MietMiez</h3>
                        <p className="text-gray-300 text-sm">
                            Ihre vertrauensvolle Plattform für Tiervermietung und -betreuung in Deutschland.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-md font-semibold mb-4">Services</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/search" className="text-gray-300 hover:text-[#c9e265]">Tiere
                                finden</Link></li>
                            <li><Link href="/insert" className="text-gray-300 hover:text-[#c9e265]">Tier
                                inserieren</Link></li>
                            <li><Link href="/sitters" className="text-gray-300 hover:text-[#c9e265]">Tiersitter
                                werden</Link></li>
                            <li><Link href="/help" className="text-gray-300 hover:text-[#c9e265]">Hilfe &
                                Support</Link></li>
                            <li><Link href="/todo" className="text-gray-300 hover:text-[#c9e265]">Falls noch wem was
                                einfällt :D</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-md font-semibold mb-4">Rechtliches</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacy"
                                      className="text-gray-300 hover:text-[#c9e265]">Datenschutz</Link></li>
                            <li><Link href="/terms" className="text-gray-300 hover:text-[#c9e265]">AGB</Link></li>
                            <li><Link href="/imprint"
                                      className="text-gray-300 hover:text-[#c9e265]">Impressum</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-md font-semibold mb-4">Kontakt</h4>
                        <div className="space-y-2 text-sm text-gray-300">
                            <p>Email: info@mietmiez.de</p>
                        </div>
                    </div>
                </div>

                {/* ALL Rights */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
                    <p>&copy; 2025 MietMiez. Alle Rechte vorbehalten.</p>
                </div>
            </div>
        </footer>
    )
}
