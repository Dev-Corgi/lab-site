import { PageHeader } from "@/components/page-header";
import { getJobOpenings } from "@/lib/supabase/queries";

export default async function JoinPage() {
  const job = await getJobOpenings();

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader
        title="Open Positions"
        breadcrumb="Join"
        description={job?.intro_text || "Thank you for your interest in joining the Quantum Dynamics Lab."}
      />

      {/* Postdoctoral Researchers */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-red-400 mb-4">
          Postdoctoral Researchers
          {job && !job.postdoc_recruiting && <span className="text-xs text-gray-500 ml-2 font-normal">(Currently not recruiting)</span>}
        </h2>
        {job?.postdoc_requirements ? (
          <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{job.postdoc_requirements}</div>
        ) : (
          <p className="text-sm text-gray-400 leading-relaxed">We are keen to recruit exceptional researchers. Please contact us for more details.</p>
        )}
        {job?.postdoc_how_to_apply && (
          <div className="mt-4 text-sm text-gray-400 leading-relaxed whitespace-pre-line">{job.postdoc_how_to_apply}</div>
        )}
      </div>

      {/* Graduate Students */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-red-400 mb-4">
          Graduate Students
          {job && !job.graduate_recruiting && <span className="text-xs text-gray-500 ml-2 font-normal">(Currently not recruiting)</span>}
        </h2>
        {job?.graduate_requirements ? (
          <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{job.graduate_requirements}</div>
        ) : (
          <p className="text-sm text-gray-400 leading-relaxed">Please contact us for information about graduate student positions.</p>
        )}
        {job?.graduate_how_to_apply && (
          <div className="mt-4 text-sm text-gray-400 leading-relaxed whitespace-pre-line">{job.graduate_how_to_apply}</div>
        )}
      </div>

      {/* Undergraduate Interns */}
      <div>
        <h2 className="text-xl font-bold text-red-400 mb-4">
          Undergraduate Interns
          {job && !job.intern_recruiting && <span className="text-xs text-gray-500 ml-2 font-normal">(Currently not recruiting)</span>}
        </h2>
        {job?.intern_requirements ? (
          <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{job.intern_requirements}</div>
        ) : (
          <p className="text-sm text-gray-400 leading-relaxed">Please contact us for information about internship opportunities.</p>
        )}
        {job?.intern_how_to_apply && (
          <div className="mt-4 text-sm text-gray-400 leading-relaxed whitespace-pre-line">{job.intern_how_to_apply}</div>
        )}
      </div>
    </div>
  );
}
