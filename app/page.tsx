import SiteHeader from "@/components/site-header";
import NavTabs from "@/components/nav-tabs";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <NavTabs />
      </main>
    </>
  );
}
