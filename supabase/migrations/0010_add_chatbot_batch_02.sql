begin;

create temporary table chatbot_batch_02 (
  slug text primary key,
  title text not null,
  description text not null,
  price integer not null,
  image_path text not null,
  workflow_link text not null
) on commit drop;

insert into chatbot_batch_02 (slug, title, description, price, image_path, workflow_link) values
  ('phong-cach-nam-ai-phoi-do-video-ban-hang', 'Phong Cách Nam AI – Phối Đồ & Video Bán Hàng', 'Biến một ảnh sản phẩm thời trang nam thành concept phối đồ, ảnh người mẫu Việt và 5 cảnh video affiliate có lời thoại tự nhiên.', 179000, '/products/phong-cach-nam-ai-cover.webp', 'https://gemini.google.com/gem/f484d1e719a5'),
  ('bien-hinh-thoi-trang-ai-dong-nhat-nguoi-mau', 'Biến Hình Thời Trang AI – Đồng Nhất Người Mẫu', 'Tạo chuỗi video thay nhiều trang phục nhưng vẫn giữ đồng nhất gương mặt, vóc dáng, bối cảnh và nhịp chuyển cảnh.', 199000, '/products/bien-hinh-thoi-trang-ai-cover.webp', 'https://gemini.google.com/gem/ba14a79e72e3'),
  ('spa-chot-lich-ai-kich-ban-trai-nghiem-lam-dep', 'Spa Chốt Lịch AI – Kịch Bản Trải Nghiệm Làm Đẹp', 'Tạo kịch bản video spa, chăm sóc da và massage theo phong cách trải nghiệm thật, tăng tin tưởng và thúc đẩy đặt lịch.', 189000, '/products/spa-chot-lich-ai-cover.webp', 'https://gemini.google.com/gem/e6230d2dd948'),
  ('phong-kham-truyen-thong-ai-video-tu-van-tin-cay', 'Phòng Khám Truyền Thông AI – Video Tư Vấn Tin Cậy', 'Hỗ trợ phòng khám xây video giới thiệu dịch vụ, quy trình và kiến thức sức khỏe rõ ràng, chuyên nghiệp và có trách nhiệm.', 199000, '/products/phong-kham-truyen-thong-ai-cover.webp', 'https://gemini.google.com/gem/0b23ab280177'),
  ('nong-san-viet-ai-ke-chuyen-vuon-nha-chot-don', 'Nông Sản Việt AI – Kể Chuyện Vườn Nhà Chốt Đơn', 'Biến ảnh nông sản thành câu chuyện từ vườn đến bàn ăn, tạo 5 cảnh video có người thật Việt Nam và lời mời mua tự nhiên.', 169000, '/products/nong-san-viet-ai-cover.webp', 'https://gemini.google.com/gem/0091d4908ec3'),
  ('thuy-san-ban-hang-ai-review-tom-ca-chuyen-nghiep', 'Thủy Sản Bán Hàng AI – Review Tôm Cá Chuyên Nghiệp', 'Tạo video review thức ăn, dụng cụ và sản phẩm nuôi tôm cá bằng người Việt, chia thành 5 cảnh ngắn dễ ghép.', 179000, '/products/thuy-san-ban-hang-ai-cover.webp', 'https://gemini.google.com/gem/7676c2bcaa12'),
  ('giang-bai-de-hieu-ai-bien-kien-thuc-thanh-video', 'Giảng Bài Dễ Hiểu AI – Biến Kiến Thức Thành Video', 'Biến một chủ đề khó thành kịch bản 5 cảnh có ví dụ, hình minh họa, câu hỏi tương tác và CTA cho khóa học.', 179000, '/products/giang-bai-de-hieu-ai-cover.webp', 'https://gemini.google.com/gem/2ad0f3fec32e'),
  ('quan-dong-khach-ai-video-mon-ngon-keo-khach', 'Quán Đông Khách AI – Video Món Ngon Kéo Khách', 'Tạo video ẩm thực 5 cảnh với góc quay món ăn hấp dẫn, lời review tự nhiên và CTA kéo khách đến quán hoặc đặt giao hàng.', 169000, '/products/quan-dong-khach-ai-cover.webp', 'https://gemini.google.com/gem/6d5d44eebe9b'),
  ('nha-dep-ban-nhanh-ai-review-bat-dong-san-5-canh', 'Nhà Đẹp Bán Nhanh AI – Review Bất Động Sản 5 Cảnh', 'Từ ảnh căn hộ hoặc nhà đất, tạo kịch bản tour 5 cảnh, lời dẫn môi giới và prompt video chuyên nghiệp.', 199000, '/products/nha-dep-ban-nhanh-ai-cover.webp', 'https://gemini.google.com/gem/e6d4649cb70a'),
  ('diem-den-hut-khach-ai-video-du-lich-homestay', 'Điểm Đến Hút Khách AI – Video Du Lịch & Homestay', 'Tạo video giới thiệu điểm đến, homestay và trải nghiệm địa phương theo cấu trúc hook–khám phá–tiện ích–CTA đặt phòng.', 179000, '/products/diem-den-hut-khach-ai-cover.webp', 'https://gemini.google.com/gem/12573d482f1c');

insert into public.products (
  type, slug, title, description, is_free, price, warranty, rating,
  sold_count, images, faq, is_published, workflow_link, video_url, updated_at
)
select
  'chatbot', slug, title, description, false, price, '15 ngày', 5.0,
  0, array[image_path],
  jsonb_build_array(
    jsonb_build_object('question', 'Tôi sẽ nhận được gì?', 'answer', 'Một liên kết chatbot riêng, hướng dẫn sử dụng, prompt tạo ảnh và quy trình 5 cảnh video có lời thoại tiếng Việt.'),
    jsonb_build_object('question', 'Có cần biết viết prompt không?', 'answer', 'Không. Bạn chỉ cần gửi ảnh sản phẩm và trả lời vài câu hỏi ngắn, chatbot sẽ soạn nội dung theo từng bước.'),
    jsonb_build_object('question', 'Chatbot có tạo video trực tiếp không?', 'answer', 'Chatbot tạo kịch bản và prompt hoàn chỉnh để bạn dùng trên công cụ tạo video phù hợp; chi phí tạo video của nền tảng bên thứ ba không nằm trong giá sản phẩm.'),
    jsonb_build_object('question', 'Tôi có được cập nhật không?', 'answer', 'Có. Khách đã mua được tham gia cộng đồng hỗ trợ và nhận cập nhật prompt trong thời gian sản phẩm còn được duy trì.'),
    jsonb_build_object('question', 'Có bảo hành không?', 'answer', 'Sản phẩm được hỗ trợ kích hoạt và bảo hành liên kết 15 ngày theo chính sách trên website.')
  ),
  true, null, null, now()
from chatbot_batch_02
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  images = excluded.images,
  faq = excluded.faq,
  is_published = true,
  workflow_link = null,
  video_url = null,
  updated_at = now();

insert into public.product_private_content (product_id, workflow_link, video_url, updated_at)
select p.id, b.workflow_link, null, now()
from chatbot_batch_02 b
join public.products p on p.slug = b.slug
on conflict (product_id) do update set
  workflow_link = excluded.workflow_link,
  video_url = excluded.video_url,
  updated_at = now();

commit;
