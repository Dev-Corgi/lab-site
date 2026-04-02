import { PageHeader } from "@/components/page-header";
import { newsData, type NewsItem } from "./_data/news-data";

function NewsItemRow({ item }: { item: NewsItem }) {
  return (
    <div className="border-l-2 border-border pl-4 py-2">
      <p className="text-xs text-red-400 mb-1">{item.date}</p>
      <p className="text-sm text-gray-300 leading-relaxed">
        {item.text}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline ml-1"
          >
            (link)
          </a>
        )}
      </p>
    </div>
  );
}

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title="News" breadcrumb="News" />
      <div className="space-y-10">
        {newsData.map((yearGroup) => (
          <div key={yearGroup.year}>
            <h2 className="text-2xl font-bold text-white mb-4">{yearGroup.year}</h2>
            <div className="space-y-3">
              {yearGroup.items.map((item, i) => (
                <NewsItemRow key={i} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
