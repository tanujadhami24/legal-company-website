export default function Stats() {
  return (
    <section className="py-20">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {/* Card 1 */}
          <div className="p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] text-center shadow-sm">

            <h2 className="text-4xl font-bold text-black dark:text-white">
              500+
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Clients Served
            </p>

          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] text-center shadow-sm">

            <h2 className="text-4xl font-bold text-black dark:text-white">
              120+
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Cases Solved
            </p>

          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] text-center shadow-sm">

            <h2 className="text-4xl font-bold text-black dark:text-white">
              95%
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Success Rate
            </p>

          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] text-center shadow-sm">

            <h2 className="text-4xl font-bold text-black dark:text-white">
              10+
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Legal Experts
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}