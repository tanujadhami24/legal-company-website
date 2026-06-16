export default function Consultation() {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="rounded-[40px] overflow-hidden bg-gradient-to-r from-[#0f172a] to-[#1e293b] p-12 md:p-20 relative">

          {/* Glow Effect */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C8A96B]/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-3xl">

            <p className="text-sm uppercase tracking-widest text-[#C8A96B]">
              One-on-One Consultation
            </p>

            <h2 className="mt-6 text-4xl md:text-6xl font-bold text-white leading-tight">
              Get Personalized
              Legal Guidance
            </h2>

            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
              Schedule a private consultation session
              with our experienced legal professionals
              for expert advice, legal support, and
              personalized solutions.
            </p>

            {/* Features */}
            <div className="mt-10 flex flex-wrap gap-4">

              <div className="px-5 py-3 rounded-full bg-white/10 border border-white/10 text-white">
                Online Consultation
              </div>

              <div className="px-5 py-3 rounded-full bg-white/10 border border-white/10 text-white">
                Private Sessions
              </div>

              <div className="px-5 py-3 rounded-full bg-white/10 border border-white/10 text-white">
                Expert Legal Advice
              </div>

            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">

              <button className="bg-[#C8A96B] text-black px-7 py-4 rounded-xl font-semibold hover:opacity-90 transition">
                Schedule Appointment
              </button>

              <button className="border border-white/20 text-white px-7 py-4 rounded-xl font-semibold hover:bg-white/10 transition">
                Contact Us
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}