import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoBlock, pageHead } from "@/components/InfoPage";

export const Route = createFileRoute("/returns")({
  head: () => pageHead("الاستبدال والاسترجاع", "سياسة الاستبدال والاسترجاع في متجر سو بيوتي."),
  component: () => (
    <InfoPage title="الاستبدال والاسترجاع" intro="رضاكِ يهمنا، وهذه شروطنا بوضوح.">
      <InfoBlock title="المدة"><p>يمكن طلب الاستبدال أو الاسترجاع خلال 3 أيام من الاستلام.</p></InfoBlock>
      <InfoBlock title="الشروط"><p>أن يكون المنتج مغلقاً وبحالته الأصلية. لا تُسترجع منتجات العناية المفتوحة لأسباب صحية.</p></InfoBlock>
      <InfoBlock title="منتج تالف أو خاطئ"><p>نستبدله مجاناً — تواصلي معنا مع صورة للمنتج خلال 24 ساعة من الاستلام.</p></InfoBlock>
    </InfoPage>
  ),
});
