import { PageHeader } from "@/components/page-header";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title="Contact" breadcrumb="Contact" />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: Location + Email */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-red-400 mb-4">Lab Location</h2>
            <div className="rounded-lg border border-border bg-card p-5 space-y-3 text-sm text-gray-400">
              <p>
                Quantum Dynamics Lab is located in the Physics Building of
                Stellar University.
              </p>
              <p>
                <span className="font-semibold text-white">Office:</span> Room 301, Physics Building
              </p>
              <p>
                <span className="font-semibold text-white">Lab:</span> Room 315, Physics Building
              </p>
              <p className="text-gray-500">123 University Avenue, Stellar City, ST 12345, USA</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-3">Email</h2>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm text-red-400">quantumdynamics at stellar dot edu</p>
            </div>
          </div>
        </div>

        {/* Right: Map */}
        <div>
          <h2 className="text-xl font-bold text-red-400 mb-4">Map</h2>
          <div className="rounded-lg overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3161.7!2d127.027!3d37.589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbc!2sKorea%20University%20Hana%20Science%20Hall!5e0!3m2!1sen!2skr!4v1"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Korea University Map"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
