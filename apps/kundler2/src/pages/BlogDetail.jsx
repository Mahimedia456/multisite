import Header from "../components/Header";
import Footer from "../components/Footer";
import { BrandBlogDetailPage } from "@multisite/ui-inner-shared";

export default function BlogDetail() {
  return (
    <main className="w-full min-h-screen bg-background-light text-slate-900">
      <Header brandSlug="kundler3" />

      <BrandBlogDetailPage brandSlug="kundler3" />

      <Footer brandSlug="kundler3" />
    </main>
  );
}