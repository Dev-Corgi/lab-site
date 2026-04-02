import { PageHeader } from "@/components/page-header";
import { LectureCard } from "./_components/lecture-card";

const mainCourses = [
  {
    title: "Quantum Mechanics",
    description: "An undergraduate course covering fundamental principles of quantum mechanics.",
    links: [
      { label: "Course Notes", url: "#" },
      { label: "Problem Sets", url: "#" },
      { label: "Lecture Videos", url: "#" },
    ],
  },
  {
    title: "Condensed Matter Physics",
    description: "Graduate-level course on solid state physics and many-body quantum systems.",
    links: [
      { label: "Syllabus", url: "#" },
      { label: "Lecture Notes", url: "#" },
    ],
  },
];

export default function LecturesPage() {
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
