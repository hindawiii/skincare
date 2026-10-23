import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoBlock, pageHead } from "@/components/InfoPage";

const faqs = [
  ["هل المنتجات أصلية؟", "نعم، جميع منتجاتنا أصلية ومختارة بعناية."],
  ["كيف أطلب؟", "أضيفي المنتجات للسلة، سجّلي الدخول، ثم أكملي بيانات التوصيل وأكدي الطلب."],
  ["ما طرق الدفع؟", "الدفع نقداً عند الاستلام."],
  ["كيف أعرف المنتج المناسب لبشرتي؟", "استخدمي فلتر نوع البشرة في صفحة المنتجات، أو راسلينا على واتساب لاستشارة مجانية."],
  ["هل يمكنني إلغاء الطلب؟", "نعم، قبل شحنه — تواصلي معنا هاتفياً أو عبر واتساب."],
];

export const Route = createFileRoute("/faq")({
  head: () => pageHead("الأسئلة الشائعة", "إجابات عن الطلب والدفع والتوصيل والمنتجات في سو بيوتي."),
  component: () => (
    <InfoPage title="الأسئلة الشائعة">
      {faqs.map(([q, a]) => <InfoBlock key={q} title={q}><p>{a}</p></InfoBlock>)}
    </InfoPage>
  ),
});
