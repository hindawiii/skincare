import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export function InfoPage({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold text-primary mb-3">{title}</h1>
        {intro && <p className="text-muted-foreground mb-8 leading-relaxed">{intro}</p>}
        <div className="space-y-6 leading-relaxed">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="p-5 border rounded-2xl bg-card">
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      <div className="text-sm text-muted-foreground space-y-2">{children}</div>
    </section>
  );
}

export function pageHead(title: string, description: string) {
  const t = `${title} — So Beauty`;
  return { meta: [
    { title: t },
    { name: "description", content: description },
    { property: "og:title", content: t },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] };
}
