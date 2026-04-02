import { PageHeader } from "@/components/page-header";

export default function JoinPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader
        title="Open Positions"
        breadcrumb="Join"
        description="Thank you for your interest in joining the Quantum Dynamics Lab."
      />

      {/* Application Information */}
      <div className="rounded-lg border border-border bg-card p-6 mb-10">
        <p className="text-sm text-gray-300 mb-4">
          For detailed application procedures and requirements, please visit our department website or contact us directly.
        </p>
        <div className="space-y-2">
          <a
            href="#"
            className="text-sm text-red-400 hover:text-red-300 transition-colors block"
          >
            Postdoctoral Application Information →
          </a>
          <a
            href="#"
            className="text-sm text-red-400 hover:text-red-300 transition-colors block"
          >
            Graduate Student Application Information →
          </a>
        </div>
      </div>

      {/* Postdoctoral Researchers */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-red-400 mb-4">Postdoctoral Researchers</h2>
        <p className="text-sm text-gray-400 mb-4 leading-relaxed">
          We have more data and research ideas than trainees, so are keen to
          recruit exceptional researchers. The lab offers a collaborative and
          supportive environment and has a strong track record in helping
          students develop and begin their own independent research careers.
        </p>
        <p className="text-sm text-gray-400 mb-2">
          We are currently looking for researchers with a strong
          computational background in:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1 mb-4 ml-2">
          <li>Whole genome sequencing analysis for neurodevelopmental disorders</li>
          <li>Genome-wide association study for complex diseases</li>
          <li>Single cell transcriptomics</li>
        </ul>
        <p className="text-sm text-gray-400">
          If you are interested, please contact Dr. An (<a href="mailto:joonanlab@gmail.com" className="text-blue-400 hover:underline">joonanlab at gmail dot com</a>) directly.
        </p>
      </div>

      {/* Graduate Students */}
      <div>
        <h2 className="text-xl font-bold text-red-400 mb-4">Graduate Students</h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          If you are interested in PhD or MS-PhD courses in our lab, please
          send a merged PDF of your cover letter, CV and academic record
          (transcript) of your undergraduate to Dr. An (<a href="mailto:joonanlab@gmail.com" className="text-blue-400 hover:underline">joonanlab at gmail dot com</a>).
        </p>
      </div>
    </div>
  );
}
