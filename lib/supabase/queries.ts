import { createPublicClient } from "./public";

function createClient() {
  return createPublicClient();
}

export async function getSiteSettings() {
  const supabase = createClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  return data;
}

export async function getHomepageHero() {
  const supabase = createClient();
  const { data } = await supabase.from("homepage_hero").select("*").single();
  return data;
}

export async function getResearchHighlights() {
  const supabase = createClient();
  const { data } = await supabase.from("research_highlights").select("*").order("sort_order");
  return data ?? [];
}

export async function getSupporters() {
  const supabase = createClient();
  const { data } = await supabase.from("supporters").select("*").order("sort_order");
  return data ?? [];
}

export async function getTeamMembers() {
  const supabase = createClient();
  const { data } = await supabase.from("team_members").select("*").order("sort_order");
  return data ?? [];
}

export async function getResearchAreas() {
  const supabase = createClient();
  const { data } = await supabase.from("research_areas").select("*").order("sort_order");
  return data ?? [];
}

export async function getPublications() {
  const supabase = createClient();
  const { data } = await supabase.from("publications").select("*").order("year", { ascending: false });
  return data ?? [];
}

export async function getFeaturedPublications() {
  const supabase = createClient();
  const { data } = await supabase.from("publications").select("*").eq("is_featured", true).order("year", { ascending: false }).limit(4);
  return data ?? [];
}

export async function getTools() {
  const supabase = createClient();
  const { data } = await supabase.from("tools").select("*").order("sort_order");
  return data ?? [];
}

export async function getLectures() {
  const supabase = createClient();
  const { data } = await supabase.from("lectures").select("*").order("sort_order");
  return data ?? [];
}

export async function getNews() {
  const supabase = createClient();
  const { data } = await supabase.from("news").select("*").order("date", { ascending: false });
  return data ?? [];
}

export async function getLatestNews(limit = 5) {
  const supabase = createClient();
  const { data } = await supabase.from("news").select("*").order("date", { ascending: false }).limit(limit);
  return data ?? [];
}

export async function getJobOpenings() {
  const supabase = createClient();
  const { data } = await supabase.from("job_openings").select("*").single();
  return data;
}

export async function getContactInfo() {
  const supabase = createClient();
  const { data } = await supabase.from("contact_info").select("*").single();
  return data;
}

export async function getAlumni() {
  const supabase = createClient();
  const { data } = await supabase.from("alumni").select("*").order("year", { ascending: false });
  return data ?? [];
}
