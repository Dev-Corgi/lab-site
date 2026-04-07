import { PageHeader } from "@/components/page-header";
import { LectureCard } from "./_components/lecture-card";
import { getLectures } from "@/lib/supabase/queries";

const defaultCourses = [
  { title: "Quantum Mechanics", description: "An undergraduate course covering fundamental principles of quantum mechanics.", links: [{ label: "Course Notes", url: "#" }] },
  { title: "Condensed Matter Physics", description: "Graduate-level course on solid state physics and many-body quantum systems.", links: [{ label: "Syllabus", url: "#" }] },
];

function toLecture(l: any) { return { title: l.title_en || l.title, description: l.description, links: l.links || [] }; }

export default async function LecturesPage() {
  const dbLectures = await getLectures();
  const mainCourses = dbLectures.length > 0 ? dbLectures.map(toLecture) : defaultCourses;
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title="Lectures & Courses" breadcrumb="Lectures" />
      <div className="space-y-5">
        {mainCourses.map((course) => (
          <LectureCard key={course.title} {...course} />
        ))}
      </div>
    </div>
  );
}
