import { createFileRoute } from "@tanstack/react-router";
import { InfoPage, InfoBlock, pageHead } from "@/components/InfoPage";

export const Route = createFileRoute("/shipping")({
  head: () => pageHead("الشحن والتوصيل", "مناطق التوصيل وطريقة الدفع ومدة وصول طلبات سو بيوتي."),
  component: () => (
    <InfoPage title="الشحن والتوصيل" intro="نوصل طلباتك بعناية حتى باب بيتك.">
      <InfoBlock title="مناطق التوصيل"><p>نوصّل داخل أم درمان والخرطوم وبحري. للولايات الأخرى تواصلي معنا عبر واتساب لتأكيد الإمكانية.</p></InfoBlock>
      <InfoBlock title="مدة التوصيل"><p>بعد تأكيد الطلب هاتفياً يتم التوصيل عادة خلال 1–3 أيام عمل داخل العاصمة.</p></InfoBlock>
      <InfoBlock title="طريقة الدفع"><p>الدفع نقداً عند الاستلام. تُحدَّد رسوم التوصيل عند تأكيد الطلب.</p></InfoBlock>
      <InfoBlock title="متابعة الطلب"><p>يمكنك متابعة حالة طلبك من صفحة «طلباتي» بعد تسجيل الدخول.</p></InfoBlock>
    </InfoPage>
  ),
});
