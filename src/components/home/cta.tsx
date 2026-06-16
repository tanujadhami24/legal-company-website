export default function CTA() {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="rounded-[40px] bg-[#C8A96B] p-12 md:p-20 text-center relative overflow-hidden">

          {/* Background Glow */}
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">

            <p className="text-sm uppercase tracking-widest text-black/70">
              Get Started Today
            </p>

            <h2 className="mt-6 text-4xl md:text-6xl font-bold text-black leading-tight">
              Need Professional
              Legal Guidance?
            </h2>

            <p className="mt-6 text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
              Book your consultation session today and
              get trusted legal support, counselling,
              and personalized guidance from experts.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">

              <button className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition">
                Schedule Appointment
              </button>

              <button className="border border-black/20 text-black px-8 py-4 rounded-xl font-semibold hover:bg-black/10 transition">
                Contact Us
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}