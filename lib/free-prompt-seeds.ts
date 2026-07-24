import type { FreePrompt } from "@/lib/types";

function cover(title: string, subtitle: string, accent = "#f2b544") {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1125" viewBox="0 0 900 1125">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#070a14"/>
        <stop offset=".55" stop-color="#111a33"/>
        <stop offset="1" stop-color="#051c22"/>
      </linearGradient>
      <radialGradient id="glow" cx=".2" cy=".18" r=".8">
        <stop offset="0" stop-color="${accent}" stop-opacity=".55"/>
        <stop offset=".45" stop-color="${accent}" stop-opacity=".10"/>
        <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#000" flood-opacity=".55"/>
      </filter>
    </defs>
    <rect width="900" height="1125" fill="url(#bg)"/>
    <rect width="900" height="1125" fill="url(#glow)"/>
    <g opacity=".18">
      <path d="M-80 290 C170 180 250 380 490 270 C680 185 790 230 990 120" fill="none" stroke="${accent}" stroke-width="4"/>
      <path d="M-70 760 C150 650 270 800 470 700 C660 610 770 680 970 560" fill="none" stroke="#9cecff" stroke-width="3"/>
    </g>
    <g filter="url(#shadow)">
      <rect x="108" y="210" width="684" height="580" rx="48" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.14)"/>
      <circle cx="450" cy="455" r="150" fill="${accent}" opacity=".18"/>
      <path d="M270 620 h360 v34 H270z M300 555 h300 v25 H300z M335 498 h230 v22 H335z" fill="${accent}" opacity=".9"/>
      <circle cx="450" cy="388" r="76" fill="none" stroke="${accent}" stroke-width="18"/>
      <path d="M414 388 h72 M450 352 v72" stroke="#fff8df" stroke-width="16" stroke-linecap="round"/>
    </g>
    <text x="70" y="925" fill="#fff8df" font-family="Arial, sans-serif" font-size="58" font-weight="900">${title}</text>
    <text x="72" y="982" fill="${accent}" font-family="Arial, sans-serif" font-size="31" font-weight="800">${subtitle}</text>
    <text x="72" y="1042" fill="#9fb0c9" font-family="Arial, sans-serif" font-size="24" font-weight="700">FREE PROMPT • LỤC LINH VIDEO AI</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function promptText(topic: string, scene: string, constraints: string) {
  return `Tạo một ảnh quảng cáo sản phẩm chuyên nghiệp cho ${topic}.

Bối cảnh: ${scene}
Chủ thể: [mô tả sản phẩm thật của bạn], đặt ở vị trí trung tâm, bao bì/nhãn chính rõ ràng, màu sắc trung thực, không bóp méo logo.
Phong cách: ảnh thương mại cao cấp, ánh sáng điện ảnh, bố cục sạch, có chiều sâu, phù hợp đăng TikTok Shop, Facebook, Reels.
Góc máy: dọc 4:5 hoặc 9:16, sản phẩm chiếm 55-70% khung hình, có khoảng trống để thêm chữ giá bán/CTA.
Chi tiết bổ sung: thêm đạo cụ liên quan ngành hàng nhưng không che sản phẩm chính.
Yêu cầu chất lượng: siêu nét, realistic, premium advertising, natural shadows, high detail.
Tránh: chữ lỗi, watermark, tay/người dị dạng, bao bì sai, logo bị méo, quá nhiều chữ nhỏ.
Lưu ý an toàn: ${constraints}

Sau khi tạo ảnh, hãy viết thêm 3 caption ngắn và 3 CTA bán hàng phù hợp với sản phẩm.`;
}

export const FREE_PROMPT_SEEDS: FreePrompt[] = [
  {
    id: "seed-binh-nuoc-giai-nhiet",
    title: "Tạo ảnh thương mại bình nước giải nhiệt giữa thiên nhiên",
    crumb: "Bình nước outdoor",
    tag: "GPT Image",
    hashtag: "#anhSanPham #doGiaDung #outdoor",
    images: [cover("Bình nước", "Outdoor • Nắng hè", "#2fb1ff")],
    prompt_text: promptText("bình nước, ly giữ nhiệt, bình thể thao hoặc sản phẩm outdoor", "ngoài trời mùa hè, ánh nắng xuyên qua lá cây, nước bắn nhẹ, cảm giác mát lạnh và năng động", "không phóng đại công dụng sức khỏe; chỉ mô tả cảm giác tiện lợi, mát mẻ, dễ mang theo."),
    created_by: null,
    created_at: "2026-07-24T08:00:00.000Z",
  },
  {
    id: "seed-ao-thun-streetwear",
    title: "Tạo ảnh chụp áo thun streetwear nam ban đêm phong cách cá tính",
    crumb: "Áo thun streetwear",
    tag: "GPT Image",
    hashtag: "#streetwear #fashionAI #KOC",
    images: [cover("Streetwear", "Áo thun • Đêm phố", "#a78bfa")],
    prompt_text: promptText("áo thun streetwear, set đồ nam, hoodie hoặc phụ kiện thời trang", "đường phố ban đêm, ánh đèn neon, người mẫu trẻ đứng tự tin, outfit rõ form và họa tiết", "giữ đúng màu/form sản phẩm; nếu có người mẫu, tránh làm sai khuôn mặt/tay/chân."),
    created_by: null,
    created_at: "2026-07-24T07:59:00.000Z",
  },
  {
    id: "seed-my-pham-clean-beauty",
    title: "Tạo ảnh mỹ phẩm clean beauty ánh sáng studio cao cấp",
    crumb: "Mỹ phẩm clean beauty",
    tag: "GPT Image",
    hashtag: "#myPham #cleanBeauty #skincare",
    images: [cover("Clean Beauty", "Mỹ phẩm • Studio", "#33c48d")],
    prompt_text: promptText("serum, kem dưỡng, son, toner hoặc sản phẩm làm đẹp", "studio tối giản, nền kem/trắng, ánh sáng mềm, có giọt nước hoặc texture sản phẩm tinh tế", "không cam kết trị bệnh, trị mụn, trị nám; chỉ dùng ngôn ngữ hỗ trợ/chăm sóc/làm đẹp."),
    created_by: null,
    created_at: "2026-07-24T07:58:00.000Z",
  },
  {
    id: "seed-tui-xach-lifestyle",
    title: "Tạo ảnh concept túi xách lifestyle sang trọng cho shop thời trang",
    crumb: "Túi xách lifestyle",
    tag: "GPT Image",
    hashtag: "#tuiXach #phuKien #fashion",
    images: [cover("Túi xách", "Lifestyle • Sang", "#f2b544")],
    prompt_text: promptText("túi xách, balo, ví nữ hoặc phụ kiện thời trang", "quán cà phê sáng ấm, bàn gỗ, hoa nhỏ, ánh nắng cửa sổ, cảm giác lifestyle cao cấp", "không dùng logo thương hiệu nổi tiếng nếu sản phẩm không phải chính hãng."),
    created_by: null,
    created_at: "2026-07-24T07:57:00.000Z",
  },
  {
    id: "seed-giay-the-thao-floating",
    title: "Tạo ảnh concept giày thể thao không trọng lượng phong cách hiện đại",
    crumb: "Giày thể thao",
    tag: "GPT Image",
    hashtag: "#giayTheThao #sneaker #adCreative",
    images: [cover("Sneaker", "Floating • Modern", "#ff6b5e")],
    prompt_text: promptText("giày thể thao, sandal, dép hoặc phụ kiện footwear", "nền studio hiện đại, sản phẩm bay nhẹ trên khối hình học, ánh sáng viền, bóng đổ mềm", "không nhái logo/nhận diện thương hiệu lớn nếu không có quyền sử dụng."),
    created_by: null,
    created_at: "2026-07-24T07:56:00.000Z",
  },
  {
    id: "seed-do-gia-dung-before-after",
    title: "Tạo ảnh đồ gia dụng kiểu before-after gọn nhà dễ chốt đơn",
    crumb: "Đồ gia dụng",
    tag: "GPT Image",
    hashtag: "#doGiaDung #beforeAfter #TikTokShop",
    images: [cover("Gia dụng", "Before • After", "#2fb1ff")],
    prompt_text: promptText("hộp đựng, dụng cụ bếp, máy mini, đồ vệ sinh hoặc sản phẩm tiện ích", "căn bếp/phòng khách trước và sau khi dùng sản phẩm, bố cục chia đôi rõ ràng, nhà sạch gọn", "không cam kết kết quả quá mức; thể hiện lợi ích bằng hình ảnh thực tế."),
    created_by: null,
    created_at: "2026-07-24T07:55:00.000Z",
  },
  {
    id: "seed-thuc-an-thuy-san",
    title: "Tạo ảnh nhà nông review thức ăn thủy sản trong kho hàng",
    crumb: "Thủy sản nhà nông",
    tag: "GPT Image",
    hashtag: "#thuySan #nhaNong #KOC",
    images: [cover("Nhà nông", "Thủy sản • KOC", "#33c48d")],
    prompt_text: promptText("thức ăn cá, thức ăn tôm, men vi sinh ao nuôi hoặc sản phẩm thủy sản", "kho vật tư nông nghiệp, người nông dân Việt Nam cầm bao sản phẩm, phía sau là bao hàng xếp gọn và ao cá minh họa nhẹ", "không cam kết tăng trưởng/chữa bệnh; dùng từ hỗ trợ, phù hợp khi dùng đúng hướng dẫn."),
    created_by: null,
    created_at: "2026-07-24T07:54:00.000Z",
  },
  {
    id: "seed-me-be-an-toan",
    title: "Tạo ảnh sản phẩm mẹ bé phong cách an toàn, mềm mại, đáng tin",
    crumb: "Mẹ bé an toàn",
    tag: "GPT Image",
    hashtag: "#meBe #babyCare #family",
    images: [cover("Mẹ bé", "An toàn • Dịu nhẹ", "#ffb6c8")],
    prompt_text: promptText("khăn ướt, bình sữa, đồ chơi, ghế ăn hoặc sản phẩm mẹ bé", "phòng em bé sáng ấm, pastel, mẹ đặt sản phẩm trên bàn sạch, cảm giác an toàn và dịu nhẹ", "tránh claim y tế; không dùng hình ảnh em bé nguy hiểm hoặc tư thế không an toàn."),
    created_by: null,
    created_at: "2026-07-24T07:53:00.000Z",
  },
  {
    id: "seed-thu-cung-pet-review",
    title: "Tạo ảnh pet review sản phẩm thú cưng đáng yêu dễ viral",
    crumb: "Thú cưng viral",
    tag: "GPT Image",
    hashtag: "#pet #thuCung #viral",
    images: [cover("Pet Review", "Thú cưng • Viral", "#f2b544")],
    prompt_text: promptText("thức ăn thú cưng, đồ chơi, vòng cổ, nhà thú cưng hoặc phụ kiện pet", "phòng khách sáng, chó/mèo tương tác tự nhiên với sản phẩm, cảm giác đáng yêu và tin cậy", "không cam kết chữa bệnh cho thú cưng; tránh hình ảnh động vật khó chịu/nguy hiểm."),
    created_by: null,
    created_at: "2026-07-24T07:52:00.000Z",
  },
  {
    id: "seed-noi-that-can-ho",
    title: "Tạo ảnh nội thất căn hộ hiện đại có điểm nhấn sản phẩm",
    crumb: "Nội thất căn hộ",
    tag: "GPT Image",
    hashtag: "#noiThat #canHo #decor",
    images: [cover("Nội thất", "Căn hộ • Decor", "#a78bfa")],
    prompt_text: promptText("đèn decor, ghế, bàn, tranh treo tường, kệ hoặc sản phẩm nội thất", "căn hộ hiện đại, ánh sáng chiều, bố cục đẹp như catalogue, sản phẩm là điểm nhấn chính", "không làm sai kích thước/số lượng sản phẩm so với mô tả thật."),
    created_by: null,
    created_at: "2026-07-24T07:51:00.000Z",
  },
  {
    id: "seed-phu-kien-o-to",
    title: "Tạo ảnh phụ kiện ô tô/xe máy phong cách mạnh mẽ, thực dụng",
    crumb: "Phụ kiện xe",
    tag: "GPT Image",
    hashtag: "#phuKienXe #oto #xeMay",
    images: [cover("Phụ kiện xe", "Mạnh mẽ • Thực dụng", "#ff6b5e")],
    prompt_text: promptText("camera hành trình, bơm lốp, giá đỡ điện thoại, đèn xe hoặc phụ kiện ô tô xe máy", "garage sạch, xe ở hậu cảnh, sản phẩm đặt cận cảnh với ánh sáng kim loại mạnh mẽ", "không khẳng định an toàn tuyệt đối; chỉ nói hỗ trợ tiện ích/trải nghiệm."),
    created_by: null,
    created_at: "2026-07-24T07:50:00.000Z",
  },
  {
    id: "seed-bds-can-ho-review",
    title: "Tạo ảnh/video concept review căn hộ bất động sản cao cấp",
    crumb: "Bất động sản",
    tag: "GPT Image",
    hashtag: "#batDongSan #canHo #review",
    images: [cover("BĐS Review", "Căn hộ • Cao cấp", "#2fb1ff")],
    prompt_text: promptText("căn hộ, nhà phố, shophouse, phòng mẫu hoặc dự án bất động sản", "phòng khách căn hộ cao cấp, view thành phố, ánh sáng vàng ấm, môi giới/KOC đứng giới thiệu nhẹ", "không cam kết lợi nhuận/đầu tư; chỉ mô tả không gian, tiện ích, cảm nhận tham quan."),
    created_by: null,
    created_at: "2026-07-24T07:49:00.000Z",
  },
  {
    id: "seed-do-an-vat",
    title: "Tạo ảnh đồ ăn vặt giòn ngon có cảm giác thèm ăn",
    crumb: "Đồ ăn vặt",
    tag: "GPT Image",
    hashtag: "#food #doAnVat #anNgon",
    images: [cover("Đồ ăn vặt", "Giòn ngon • Cận cảnh", "#f2b544")],
    prompt_text: promptText("snack, bánh, đồ ăn vặt, nước sốt, đồ khô hoặc đặc sản", "bàn gỗ, ánh sáng ấm, cận cảnh texture giòn/ngon, có tay cầm sản phẩm nhưng không che bao bì", "không dùng claim sức khỏe nếu sản phẩm không có chứng nhận; giữ hình ảnh thực phẩm sạch và an toàn."),
    created_by: null,
    created_at: "2026-07-24T07:48:00.000Z",
  },
  {
    id: "seed-thiet-bi-cong-nghe",
    title: "Tạo ảnh unbox thiết bị công nghệ phong cách reviewer chuyên nghiệp",
    crumb: "Công nghệ unbox",
    tag: "GPT Image",
    hashtag: "#congNghe #unbox #review",
    images: [cover("Tech Unbox", "Reviewer • Studio", "#33c48d")],
    prompt_text: promptText("tai nghe, bàn phím, micro, camera, điện thoại hoặc thiết bị công nghệ", "bàn setup làm việc, ánh sáng RGB nhẹ, sản phẩm đang được unbox, phụ kiện sắp xếp gọn", "không giả mạo logo/chứng nhận; không phóng đại thông số nếu chưa có dữ liệu thật."),
    created_by: null,
    created_at: "2026-07-24T07:47:00.000Z",
  },
  {
    id: "seed-the-thao-fitness",
    title: "Tạo ảnh dụng cụ thể thao/fitness năng lượng cao",
    crumb: "Fitness năng động",
    tag: "GPT Image",
    hashtag: "#fitness #theThao #khoeDep",
    images: [cover("Fitness", "Năng động • KOC", "#ff6b5e")],
    prompt_text: promptText("dây kháng lực, bình lắc, thảm yoga, dụng cụ tập hoặc đồ thể thao", "phòng gym sáng, người mẫu đang chuẩn bị tập, sản phẩm rõ ở tiền cảnh, cảm giác năng lượng cao", "không cam kết giảm cân/tăng cơ; dùng ngôn ngữ hỗ trợ luyện tập và lối sống năng động."),
    created_by: null,
    created_at: "2026-07-24T07:46:00.000Z",
  },
  {
    id: "seed-van-phong-workspace",
    title: "Tạo ảnh đồ dùng văn phòng/workspace gọn gàng hiện đại",
    crumb: "Workspace",
    tag: "GPT Image",
    hashtag: "#vanPhong #workspace #productivity",
    images: [cover("Workspace", "Gọn gàng • Hiện đại", "#a78bfa")],
    prompt_text: promptText("sổ tay, đèn bàn, kệ màn hình, phụ kiện bàn làm việc hoặc đồ văn phòng", "bàn làm việc hiện đại, laptop, ánh sáng cửa sổ, sản phẩm giúp góc làm việc gọn gàng", "không cam kết tăng năng suất tuyệt đối; chỉ nhấn mạnh hỗ trợ sắp xếp và trải nghiệm làm việc."),
    created_by: null,
    created_at: "2026-07-24T07:45:00.000Z",
  },
  {
    id: "seed-video-koc-5-canh",
    title: "Tạo kịch bản video KOC 5 cảnh từ một ảnh sản phẩm",
    crumb: "Video KOC 5 cảnh",
    tag: "Veo / Flow",
    hashtag: "#videoAI #KOC #Veo",
    images: [cover("5 cảnh KOC", "Prompt video • 10s", "#2fb1ff")],
    prompt_text: `Từ một ảnh sản phẩm [mô tả/đính kèm ảnh], hãy tạo 5 prompt video ngắn, mỗi prompt khoảng 8-10 giây, tỉ lệ 9:16.

Yêu cầu chung:
- Giữ cùng một KOC/người mẫu, cùng sản phẩm, cùng màu sắc bao bì.
- Mỗi clip có một hành động rõ ràng.
- Phong cách realistic, phù hợp TikTok/Reels/Shorts.
- Không phóng đại công dụng hoặc cam kết kết quả.

Cấu trúc output:
1. Clip mở đầu: nêu vấn đề hoặc hook 3 giây đầu.
2. Clip giới thiệu sản phẩm: cận cảnh bao bì/tính năng chính.
3. Clip dùng thử: KOC thao tác với sản phẩm.
4. Clip kết quả/cảm nhận: thể hiện lợi ích bằng hình ảnh.
5. Clip chốt đơn: CTA nhắn tin/mua ngay.

Với mỗi clip hãy trả:
- Tên clip
- Prompt video
- Lời thoại 1-2 câu
- Text overlay ngắn
- Gợi ý nhạc/nhịp dựng`,
    created_by: null,
    created_at: "2026-07-24T07:44:00.000Z",
  },
  {
    id: "seed-caption-chot-don",
    title: "Tạo caption chốt đơn cho video AI bán hàng",
    crumb: "Caption chốt đơn",
    tag: "Content",
    hashtag: "#caption #banHang #affiliate",
    images: [cover("Caption", "Chốt đơn • Affiliate", "#33c48d")],
    prompt_text: `Bạn là chuyên gia viết caption bán hàng cho TikTok Shop/Facebook/Reels.

Sản phẩm: [điền tên sản phẩm]
Khách hàng mục tiêu: [ai sẽ mua]
Điểm đau/vấn đề: [vấn đề khách gặp]
Lợi ích chính: [lợi ích thật, không phóng đại]
Ưu đãi/giá: [nếu có]
CTA mong muốn: [nhắn tin / bấm link / đặt hàng]

Hãy viết:
1. 5 caption ngắn dưới 80 chữ.
2. 5 caption kể chuyện dưới 150 chữ.
3. 10 hook mở đầu video.
4. 5 CTA mềm.
5. 5 CTA mạnh.
6. 1 phiên bản caption an toàn, không cam kết quá mức.

Giọng văn: tự nhiên, rõ lợi ích, gần gũi, phù hợp người Việt mua hàng online.`,
    created_by: null,
    created_at: "2026-07-24T07:43:00.000Z",
  },
];
