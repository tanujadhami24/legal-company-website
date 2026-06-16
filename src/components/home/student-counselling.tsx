export default function StudentCounselling() {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left Side */}
          <div>

            <p className="text-sm uppercase tracking-widest text-[#C8A96B]">
              Student Counselling
            </p>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-black dark:text-white leading-tight">
              Personalized Guidance
              For Students &
              Career Growth
            </h2>

            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              We provide one-on-one counselling sessions,
              career guidance, educational support, and
              legal consultation tailored for students
              and young professionals.
            </p>

            {/* Features */}
            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#C8A96B]"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  Career Counselling
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#C8A96B]"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  Abroad Education Guidance
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#C8A96B]"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  Legal Education Support
                </p>
              </div>

            </div>

            {/* Button */}
            <button className="mt-10 bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl font-medium hover:opacity-90 transition">
              Book Student Session
            </button>

          </div>

          {/* Right Side */}
          <div className="flex justify-center">

            <div className="w-full max-w-lg h-[500px] rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 shadow-2xl flex items-center justify-center">

              <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">
                Counselling Image Here
              </h3>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}