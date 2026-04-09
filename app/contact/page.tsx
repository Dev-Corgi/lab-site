"use client";

import { PageHeader } from "@/components/page-header";
import { useI18n } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const defaultContact = { 
  building: "Physics Building", 
  building_kr: "물리학과",
  office_room: "Room 301", 
  office_room_kr: "301호",
  lab_room: "Room 315", 
  lab_room_kr: "315호",
  address: "123 University Avenue, Stellar City, ST 12345, USA", 
  address_kr: "스텔라시 대학로 123번길",
  email: "quantumdynamics@stellar.edu", 
  google_maps_url: "", 
  phone: "" 
};

function ContactSkeleton() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse mb-8" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <div className="h-6 w-32 bg-white/10 rounded-lg animate-pulse mb-4" />
            <div className="rounded-lg border border-white/5 bg-white/5 p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-white/10 rounded" />
              <div className="h-4 bg-white/5 rounded w-3/4" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
              <div className="h-4 bg-white/5 rounded w-full" />
            </div>
          </div>
          <div>
            <div className="h-5 w-24 bg-white/10 rounded-lg animate-pulse mb-3" />
            <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
        <div>
          <div className="h-6 w-20 bg-white/10 rounded-lg animate-pulse mb-4" />
          <div className="h-[350px] bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const { t, language } = useI18n();
  const [contact, setContact] = useState(defaultContact);
  const [labName, setLabName] = useState("Quantum Dynamics Lab");
  const [uni, setUni] = useState("Stellar University");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const [{ data: contactData }, { data: settingsData }] = await Promise.all([
        supabase.from("contact_info").select("*").single(),
        supabase.from("site_settings").select("*").single()
      ]);
      
      if (contactData) {
        setContact({ ...defaultContact, ...contactData });
      }
      if (settingsData) {
        setLabName(language === "ko" && settingsData.lab_name_kr ? settingsData.lab_name_kr : settingsData.lab_name_en);
        setUni(language === "ko" && settingsData.university_kr ? settingsData.university_kr : settingsData.university);
      }
      setLoading(false);
    };
    loadData();
  }, [language]);

  if (loading) {
    return <ContactSkeleton />;
  }

  const c = contact;
  const emailDisplay = c.email?.replace("@", " at ").replace(".", " dot ") ?? "";
  
  const building = language === "ko" && c.building_kr ? c.building_kr : c.building;
  const office = language === "ko" && c.office_room_kr ? c.office_room_kr : c.office_room;
  const lab = language === "ko" && c.lab_room_kr ? c.lab_room_kr : c.lab_room;
  const address = language === "ko" && c.address_kr ? c.address_kr : c.address;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title={t("연락처", "Contact")} breadcrumb={t("연락처", "Contact")} />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-red-400 mb-4">{t("연구실 위치", "Lab Location")}</h2>
            <div className="rounded-lg border border-border bg-card p-5 space-y-3 text-sm text-gray-400">
              <p>{labName} {t("은", "is")} {uni} {building} {t("에 위치해 있습니다.", "is located in")}</p>
              <p><span className="font-semibold text-white">{t("사무실", "Office")}:</span> {office}, {building}</p>
              <p><span className="font-semibold text-white">{t("연구실", "Lab")}:</span> {lab}, {building}</p>
              <p className="text-gray-500">{address}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-3">{t("이메일", "Email")}</h2>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm text-red-400">{emailDisplay}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-red-400 mb-4">{t("지도", "Map")}</h2>
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
