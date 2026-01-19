import Icon from "./Icon";

export default function FAQ() {
  return (
    <section className="max-w-[800px] mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <button className="w-full px-6 py-5 flex items-center justify-between font-bold text-left text-primary dark:text-white">
            Do I need a medical exam to qualify?
            <Icon name="expand_more" className="text-accent" />
          </button>
          <div className="px-6 pb-5 text-sm text-gray-500">
            Many of our policies offer "No Medical Exam" options for healthy applicants up to a certain age and coverage limit.
            For larger policies, a brief physical exam may be required at our expense.
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden opacity-70">
          <button className="w-full px-6 py-5 flex items-center justify-between font-bold text-left text-primary dark:text-white">
            Can I change my beneficiaries later?
            <Icon name="expand_more" />
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden opacity-70">
          <button className="w-full px-6 py-5 flex items-center justify-between font-bold text-left text-primary dark:text-white">
            How long does it take to get a quote?
            <Icon name="expand_more" />
          </button>
        </div>
      </div>
    </section>
  );
}
