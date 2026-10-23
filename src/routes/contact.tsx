import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { InfoPage, pageHead } from "@/components/InfoPage";
import { STORE, whatsappLink } from "@/lib/store-info";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("تواصل معنا", "تواصلي مع سو بيوتي عبر واتساب أو الهاتف أو البريد."),
  component: () => {
    const items = [
      { Icon: MessageCircle, label: "واتساب", value: STORE.phoneDisplay, href: whatsappLink(), dir: "ltr" as const },
      { Icon: Phone, label: "الهاتف", value: STORE.phoneDisplay, href: `tel:${STORE.phoneE164}`, dir: "ltr" as const },
      { Icon: Mail, label: "البريد", value: STORE.email, href: `mailto:${STORE.email}`, dir: "ltr" as const },
      { Icon: MapPin, label: "العنوان", value: STORE.address, href: undefined, dir: "rtl" as const },
    ];
    return (
      <InfoPage title="تواصل معنا" intro="فريقنا جاهز لمساعدتك واختيار الأنسب لبشرتك.">
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map(({ Icon, label, value, href, dir }) => {
            const body = (
              <>
                <Icon className="w-6 h-6 text-primary mb-2" />
                <p className="font-bold">{label}</p>
                <p className="text-sm text-muted-foreground" dir={dir}>{value}</p>
              </>
            );
            return href ? (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="p-5 border rounded-2xl hover:border-primary transition-colors">{body}</a>
            ) : (
              <div key={label} className="p-5 border rounded-2xl">{body}</div>
            );
          })}
        </div>
      </InfoPage>
    );
  },
});
