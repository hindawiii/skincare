ALTER TYPE public.product_category ADD VALUE IF NOT EXISTS 'haircare';
ALTER TYPE public.product_category ADD VALUE IF NOT EXISTS 'hair_tools';
ALTER TYPE public.product_category ADD VALUE IF NOT EXISTS 'body';
ALTER TYPE public.product_category ADD VALUE IF NOT EXISTS 'fragrance';

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ingredients TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS how_to_use TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS skin_types TEXT[] NOT NULL DEFAULT '{}';

-- Orders must go only through place_order (prevents client-forged prices)
DROP POLICY IF EXISTS "own_orders_insert" ON public.orders;
DROP POLICY IF EXISTS "own_order_items_insert" ON public.order_items;
REVOKE INSERT, UPDATE ON public.orders FROM authenticated;
REVOKE INSERT ON public.order_items FROM authenticated;

CREATE OR REPLACE FUNCTION public.place_order(
  _full_name TEXT, _phone TEXT, _shipping_address TEXT, _city TEXT, _notes TEXT, _items JSONB
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid UUID := auth.uid();
  _order_id UUID;
  _total NUMERIC(10,2) := 0;
  _it JSONB;
  _p RECORD;
  _qty INT;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;
  IF jsonb_array_length(_items) = 0 THEN RAISE EXCEPTION 'السلة فارغة'; END IF;

  INSERT INTO public.orders (user_id, total, full_name, phone, shipping_address, city, notes)
  VALUES (_uid, 0, _full_name, _phone, _shipping_address, _city, NULLIF(_notes, ''))
  RETURNING id INTO _order_id;

  FOR _it IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _qty := (_it->>'quantity')::INT;
    IF _qty IS NULL OR _qty < 1 OR _qty > 50 THEN RAISE EXCEPTION 'كمية غير صالحة'; END IF;
    SELECT id, name, price, stock, is_active INTO _p FROM public.products
      WHERE id = (_it->>'product_id')::UUID FOR UPDATE;
    IF NOT FOUND OR NOT _p.is_active THEN RAISE EXCEPTION 'منتج غير متوفر'; END IF;
    IF _p.stock < _qty THEN RAISE EXCEPTION 'الكمية المطلوبة من % غير متوفرة (المتاح %)', _p.name, _p.stock; END IF;
    UPDATE public.products SET stock = stock - _qty WHERE id = _p.id;
    INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price)
      VALUES (_order_id, _p.id, _p.name, _qty, _p.price);
    _total := _total + _p.price * _qty;
  END LOOP;

  UPDATE public.orders SET total = _total WHERE id = _order_id;
  RETURN jsonb_build_object('order_id', _order_id, 'total', _total);
END; $$;
REVOKE EXECUTE ON FUNCTION public.place_order(TEXT,TEXT,TEXT,TEXT,TEXT,JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_order(TEXT,TEXT,TEXT,TEXT,TEXT,JSONB) TO authenticated;

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  author_name TEXT NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 60),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT CHECK (char_length(comment) <= 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, user_id)
);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "reviews_own_insert" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_own_update" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_own_delete" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX reviews_product_idx ON public.reviews(product_id);

-- Skin types for existing skincare products
UPDATE public.products SET skin_types = ARRAY['hydrated','balanced','firm','glow'] WHERE category = 'skincare';
UPDATE public.products SET skin_types = ARRAY['glow'] WHERE name LIKE '%تفتيح%' OR name LIKE '%فيتامين%' OR name LIKE '%الكركم%';