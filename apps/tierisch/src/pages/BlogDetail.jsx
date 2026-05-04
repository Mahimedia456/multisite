import Header from "../components/Header";
import Footer from "../components/Footer";
import { BrandBlogDetailPage } from "@multisite/ui-inner-shared";

export default function BlogDetail() {
  return (
    <main className="w-full min-h-screen bg-[#F6F8FB] text-slate-900">
      <Header brandSlug="allianz4" />

      <BrandBlogDetailPage brandSlug="allianz4" />

      <Footer brandSlug="allianz4" />
    </main>
  );
}