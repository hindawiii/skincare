export const STORE = {
  name: "So Beauty",
  nameAr: "سو بيوتي",
  email: "sobeauty.one@gmail.com",
  phoneDisplay: "+249 900 776 688",
  phoneE164: "+249900776688",
  whatsapp: "249900776688",
  address: "أم درمان — شارع الوادي",
  currency: "ج.س",
};

export function formatPrice(n: number | string) {
  const v = Number(n);
  return `${v.toLocaleString("ar-SD", { maximumFractionDigits: 2 })} ${STORE.currency}`;
}

export function whatsappLink(text = "مرحباً سو بيوتي، أريد الاستفسار عن منتج") {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const CATEGORIES = [
  { value: "skincare", label: "العناية بالبشرة" },
  { value: "haircare", label: "العناية بالشعر" },
  { value: "hair_tools", label: "أجهزة الشعر" },
  { value: "body", label: "الجسم والاستحمام" },
  { value: "fragrance", label: "العطور" },
  { value: "box", label: "بوكسات العناية" },
  { value: "accessory", label: "الإكسسوارات" },
  { value: "offer", label: "العروض" },
] as const;

export const SKIN_TYPES = [
  { value: "hydrated", label: "بشرة مرطبة" },
  { value: "balanced", label: "بشرة موحّدة" },
  { value: "firm", label: "بشرة مشدودة" },
  { value: "glow", label: "بشرة مشرقة" },
] as const;
