import { PageHeader } from "@/components/page-header";
import { newsData } from "./_data/news-data";
import { getNews } from "@/lib/supabase/queries";

function NewsItemRow({ item }: { item: { date_display: string; content: string; link_url?: string } }) {
  return (
    <div className="border-l-2 border-border pl-4 py-2">
      <p className="text-xs text-red-400 mb-1">{item.date_display}</p>
      <p className="text-sm text-gray-300 leading-relaxed">
        {item.content}
        {item.link_url && (
          <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
            (link)
          </a>
        )}
      </p>
    </div>
  );
}

export default async function NewsPage() {
  const dbNews = await getNews();

  if (dbNews.length > 0) {
    const grouped = new Map<string, any[]>();
    for (const n of dbNews) {
      const y = n.year || new Date(n.date).getFullYear().toString();
      if (!grouped.has(y)) grouped.set(y, []);
      grouped.get(y)!.push(n);
    }
    const years = [...grouped.keys()].sort((a, b) => b.localeCompare(a));

    return (
      <div className="container mx-auto px-4 lg:px-8 py-10">
        <PageHeader title="News" breadcrumb="News" />
        <div className="space-y-10">
          {years.map((year) => (
            <div key={year}>
              <h2 className="text-2xl font-bold text-white mb-4">{year}</h2>
              <div className="space-y-3">
                {grouped.get(year)!.map((item: any, i: number) => (
                  <NewsItemRow key={i} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback to static data
  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <PageHeader title="News" breadcrumb="News" />
      <div className="space-y-10">
        {newsData.map((yearGroup) => (
          <div key={yearGroup.year}>
            <h2 className="text-2xl font-bold text-white mb-4">{yearGroup.year}</h2>
            <div className="space-y-3">
              {yearGroup.items.map((item, i) => (
                <NewsItemRow key={i} item={{ date_display: item.date, content: item.text, link_url: item.link }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
