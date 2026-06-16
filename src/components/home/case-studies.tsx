export default function CaseStudies() {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">

          <p className="text-sm uppercase tracking-widest text-[#C8A96B]">
            Case Studies
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-black dark:text-white">
            Our Recent Work
          </h2>

          <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore some of our successful legal cases,
            consultation projects, and counselling achievements.
          </p>

        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 hover:-translate-y-2 transition duration-300">

            <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">

              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                Case Image
              </h3>

            </div>

            <div className="p-8">

              <p className="text-sm text-[#C8A96B] mb-3">
                Corporate Law
              </p>

              <h3 className="text-2xl font-semibold text-black dark:text-white">
                Corporate Compliance Case
              </h3>

              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Successfully handled legal compliance
                and documentation support for a growing company.
              </p>

            </div>

          </div>

          {/* Card 2 */}
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 hover:-translate-y-2 transition duration-300">

            <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">

              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                Counselling Image
              </h3>

            </div>

            <div className="p-8">

              <p className="text-sm text-[#C8A96B] mb-3">
                Student Counselling
              </p>

              <h3 className="text-2xl font-semibold text-black dark:text-white">
                Student Visa Guidance
              </h3>

              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Guided students through educational
                counselling and international documentation.
              </p>

            </div>

          </div>

          {/* Card 3 */}
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 hover:-translate-y-2 transition duration-300">

            <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">

              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                Documentation Image
              </h3>

            </div>

            <div className="p-8">

              <p className="text-sm text-[#C8A96B] mb-3">
                Documentation
              </p>

              <h3 className="text-2xl font-semibold text-black dark:text-white">
                Property Documentation
              </h3>

              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Provided complete legal documentation
                and property verification services.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}