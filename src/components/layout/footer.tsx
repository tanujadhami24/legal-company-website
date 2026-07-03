import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white pt-20 pb-10">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-4 gap-12">

          {/* Company */}
          <div>

            <h2 className="text-3xl font-bold">
              Living Law
            </h2>

            <p className="mt-6 text-gray-400 leading-relaxed">
              Professional legal solutions,
              student counselling, and
              one-on-one consultation
              services with trusted expertise.
            </p>          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Quick Links
            </h3>
            <div className="flex flex-col gap-4 text-gray-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
              <Link href="/marketplace" className="hover:text-amber-400 transition-colors">Service Marketplace</Link>
              <Link href="/odr" className="hover:text-amber-400 transition-colors">ODR Case Chambers</Link>
              <Link href="/dashboard" className="hover:text-amber-400 transition-colors">Professional Login</Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Services
            </h3>
            <div className="flex flex-col gap-4 text-gray-400">
              <Link href="/marketplace" className="hover:text-amber-400 transition-colors">Business Registration</Link>
              <Link href="/marketplace" className="hover:text-amber-400 transition-colors">Trademark & IP Filing</Link>
              <Link href="/marketplace" className="hover:text-amber-400 transition-colors">GST & Compliances</Link>
              <Link href="/odr" className="hover:text-amber-400 transition-colors">Settlement Calculators</Link>
            </div>
          </div>

          {/* Contact */}
          <div>

            <h3 className="text-xl font-semibold mb-6">
              Contact
            </h3>

            <div className="flex flex-col gap-4 text-gray-400">
              <a href="mailto:livinglaw01@gmail.com" className="hover:text-amber-400 transition-colors">
                livinglaw01@gmail.com
              </a>
              <a href="tel:+917505375151" className="hover:text-amber-400 transition-colors">
                +91 7505375151
              </a>
              <p>Delhi, India</p>
            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-gray-500 text-sm">
            © 2026 Living Law. All rights reserved.
          </p>

          <div className="flex gap-6 text-gray-500 text-sm">

            <p>Privacy Policy</p>
            <p>Terms & Conditions</p>

          </div>

        </div>

      </div>

    </footer>
  );
}