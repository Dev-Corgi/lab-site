import { PageHeader } from "@/components/page-header";
import { getContactInfo, getSiteSettings } from "@/lib/supabase/queries";

export default async function ContactPage() {
  const [contact, settings] = await Promise.all([getContactInfo(), getSiteSettings()]);
  const c = contact ?? { building: "Physics Building", office_room: "Room 301", lab_room: "Room 315", address: "123 University Avenue, Stellar City, ST 12345, USA", email: "quantumdynamics@stellar.edu", google_maps_url: "", phone: "" };
  const labName = settings?.lab_name_en ?? "Quantum Dynamics Lab";
  const uni = settings?.university ?? "Stellar University";
  const emailDisplay = c.email?.replace("@", " at ").replace(".", " dot ") ?? "";

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title="Contact" breadcrumb="Contact" />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-red-400 mb-4">Lab Location</h2>
            <div className="rounded-lg border border-border bg-card p-5 space-y-3 text-sm text-gray-400">
              <p>{labName} is located in the {c.building} of {uni}.</p>
              <p><span className="font-semibold text-white">Office:</span> {c.office_room}, {c.building}</p>
              <p><span className="font-semibold text-white">Lab:</span> {c.lab_room}, {c.building}</p>
              <p className="text-gray-500">{c.address}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-3">Email</h2>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm text-red-400">{emailDisplay}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-red-400 mb-4">Map</h2>
          <div className="rounded-lg overflow-hidden border border-border">
            <iframe
              src={c.google_maps_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3161.7!2d127.027!3d37.589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357cbc!2sKorea%20University%20Hana%20Science%20Hall!5e0!3m2!1sen!2skr!4v1"}
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Map"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
