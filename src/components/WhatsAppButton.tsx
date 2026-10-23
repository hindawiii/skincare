import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/store-info";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصلي معنا عبر واتساب"
      className="fixed bottom-5 left-5 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
