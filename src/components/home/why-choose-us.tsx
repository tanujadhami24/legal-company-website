import {
  ShieldCheck,
  Users,
  BadgeCheck,
  Handshake,
} from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">

          <p className="text-sm uppercase tracking-widest text-[#C8A96B]">
            Why Choose Us
          </p>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-black dark:text-white">
            Trusted Legal Expertise
          </h2>

          <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We combine professional legal expertise,
            personalized consultation, and dedicated
            student counselling to provide reliable support.
          </p>

        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 hover:border-[#C8A96B] transition duration-300">

            <ShieldCheck className="w-12 h-12 text-[#C8A96B] mb-6" />

            <h3 className="text-2xl font-semibold text-black dark:text-white">
              Trusted Guidance
            </h3>

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Professional legal support with complete
              transparency and trust.
            </p>

          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 hover:border-[#C8A96B] transition duration-300">

            <Users className="w-12 h-12 text-[#C8A96B] mb-6" />

            <h3 className="text-2xl font-semibold text-black dark:text-white">
              Expert Team
            </h3>

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Experienced professionals focused on
              delivering personalized legal solutions.
            </p>

          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 hover:border-[#C8A96B] transition duration-300">

            <BadgeCheck className="w-12 h-12 text-[#C8A96B] mb-6" />

            <h3 className="text-2xl font-semibold text-black dark:text-white">
              Proven Results
            </h3>

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              A strong track record of successful cases
              and satisfied clients.
            </p>

          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 hover:border-[#C8A96B] transition duration-300">

            <Handshake className="w-12 h-12 text-[#C8A96B] mb-6" />

            <h3 className="text-2xl font-semibold text-black dark:text-white">
              Personalized Support
            </h3>

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              One-on-one consultation tailored to each
              client’s specific needs.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}