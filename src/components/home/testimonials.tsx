import { Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">

          <p className="text-sm uppercase tracking-widest text-[#C8A96B]">
            Testimonials
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-black dark:text-white">
            What Our Clients Say
          </h2>

          <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Trusted by clients and students for professional
            legal support, counselling, and consultation services.
          </p>

        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800">

            <Quote className="w-10 h-10 text-[#C8A96B] mb-6" />

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              “Professional and supportive legal guidance.
              The team handled our documentation process
              smoothly and efficiently.”
            </p>

            <div className="mt-8">

              <h3 className="font-semibold text-black dark:text-white">
                Rahul Sharma
              </h3>

              <p className="text-sm text-gray-500">
                Corporate Client
              </p>

            </div>

          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800">

            <Quote className="w-10 h-10 text-[#C8A96B] mb-6" />

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              “The counselling sessions were extremely
              helpful for my career planning and legal
              education guidance.”
            </p>

            <div className="mt-8">

              <h3 className="font-semibold text-black dark:text-white">
                Priya Mehta
              </h3>

              <p className="text-sm text-gray-500">
                Student
              </p>

            </div>

          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800">

            <Quote className="w-10 h-10 text-[#C8A96B] mb-6" />

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              “Excellent one-on-one consultation and
              transparent communication throughout
              the legal process.”
            </p>

            <div className="mt-8">

              <h3 className="font-semibold text-black dark:text-white">
                Aman Verma
              </h3>

              <p className="text-sm text-gray-500">
                Consultation Client
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}