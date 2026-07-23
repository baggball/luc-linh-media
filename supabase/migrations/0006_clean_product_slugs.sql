-- Bỏ hậu tố ngẫu nhiên khỏi slug cũ để tạo URL sản phẩm ngắn, dễ đọc và thân thiện SEO.
-- UUID cũ vẫn được ứng dụng chuyển hướng vĩnh viễn sang slug mới.
update public.products
set slug = regexp_replace(slug, '-[a-z0-9]{8}$', '')
where slug ~ '-[a-z0-9]{8}$';
