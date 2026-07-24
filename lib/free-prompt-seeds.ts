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

function fashionPrompt(product: string, scene: string, style: string, note: string) {
  return `Tạo ảnh quảng cáo thời trang chuyên nghiệp cho: ${product}.

Bối cảnh: ${scene}
Phong cách hình ảnh: ${style}

Yêu cầu bố cục:
- Sản phẩm phải là nhân vật chính, nhìn rõ form dáng, chất liệu, màu sắc và chi tiết bán hàng.
- Nếu có người mẫu, tạo dáng tự nhiên, tay/chân/khuôn mặt đúng giải phẫu, outfit mặc vừa vặn.
- Bố cục dọc 4:5 hoặc 9:16, phù hợp đăng TikTok Shop, Facebook, Reels, Shopee/Lazada.
- Ánh sáng đẹp, có chiều sâu, premium advertising, realistic, high detail, clean composition.
- Chừa khoảng trống hợp lý để thêm chữ: tên sản phẩm, giá, ưu đãi hoặc CTA.

Không được:
- Không tự thêm logo thương hiệu nổi tiếng nếu sản phẩm không có logo đó.
- Không làm sai màu, sai form, sai họa tiết chính của sản phẩm.
- Không chữ lỗi, watermark, hình méo, tay/chân dị dạng.

Lưu ý ngành hàng: ${note}

Sau khi tạo ảnh, hãy viết thêm:
1. 3 caption bán hàng ngắn.
2. 3 hook mở đầu video.
3. 3 CTA phù hợp để chốt đơn.`;
}

export const FREE_PROMPT_SEEDS: FreePrompt[] = [
  {
    id: "seed-fashion-sneaker-studio-float",
    title: "Tạo ảnh giày sneaker bay trên khối 3D phong cách thể thao hiện đại",
    crumb: "Sneaker studio 3D",
    tag: "GPT Image",
    hashtag: "#sneaker #giayTheThao #fashionAI",
    images: [cover("Sneaker 3D", "Studio • Floating", "#ff6b5e")],
    prompt_text: fashionPrompt("giày sneaker, giày chạy bộ hoặc giày thể thao nam/nữ", "studio tối màu hiện đại, sneaker bay nhẹ trên các khối hình học, có ánh sáng viền đỏ/xanh, bóng đổ mềm và hiệu ứng chuyển động nhẹ", "sport luxury, 3D commercial, mạnh mẽ, sạch, giống poster quảng cáo giày cao cấp", "giữ rõ đế giày, chất liệu upper, dây giày và logo nếu có; không nhái thương hiệu nổi tiếng."),
    created_by: null,
    created_at: "2026-07-24T09:20:00.000Z",
  },
  {
    id: "seed-fashion-sandal-summer-beach",
    title: "Tạo ảnh sandal/dép mùa hè trên nền biển sáng sạch dễ bán",
    crumb: "Sandal mùa hè",
    tag: "GPT Image",
    hashtag: "#sandal #depNu #muaHe",
    images: [cover("Sandal", "Summer • Beach", "#2fb1ff")],
    prompt_text: fashionPrompt("sandal, dép nữ, dép nam, dép đi biển hoặc dép quai ngang", "bãi biển sáng, cát mịn, nước biển xanh nhẹ, sản phẩm đặt trên đá trắng hoặc cát sạch, có nắng hè trong trẻo", "fresh summer commercial, tối giản, sáng, sạch, tạo cảm giác thoải mái và dễ đi", "không làm sản phẩm bị ướt quá mức nếu không phù hợp; giữ rõ quai dép, đế dép và màu thật."),
    created_by: null,
    created_at: "2026-07-24T09:19:00.000Z",
  },
  {
    id: "seed-fashion-white-dress-editorial",
    title: "Tạo ảnh váy trắng thanh lịch kiểu editorial cao cấp",
    crumb: "Váy nữ editorial",
    tag: "GPT Image",
    hashtag: "#vayNu #lookbook #editorial",
    images: [cover("Váy nữ", "Editorial • Thanh lịch", "#f2d4b7")],
    prompt_text: fashionPrompt("váy trắng, đầm nữ, set váy công sở hoặc váy đi tiệc tối giản", "studio màu be, ghế gỗ, rèm mỏng, ánh sáng cửa sổ mềm, người mẫu nữ đứng thanh lịch như lookbook", "minimal editorial, sang, nữ tính, cao cấp, giống ảnh lookbook thương hiệu thời trang", "nhấn rõ form váy, độ rũ vải, cổ áo, tay áo và chiều dài váy; không tạo dáng phản cảm."),
    created_by: null,
    created_at: "2026-07-24T09:18:00.000Z",
  },
  {
    id: "seed-fashion-men-street-set-night",
    title: "Tạo ảnh set đồ nam streetwear ban đêm có hiệu ứng ánh sáng cinematic",
    crumb: "Set đồ nam streetwear",
    tag: "GPT Image",
    hashtag: "#streetwear #doNam #KOC",
    images: [cover("Street Set", "Nam • Đêm phố", "#a78bfa")],
    prompt_text: fashionPrompt("set đồ nam, áo thun oversize, quần short, quần jogger hoặc outfit streetwear", "đường phố ban đêm sau mưa, ánh đèn neon phản chiếu trên mặt đường, người mẫu nam đứng tự tin, outfit nổi bật", "urban cinematic, cá tính, trẻ, phù hợp TikTok/Reels bán thời trang nam", "giữ đúng họa tiết áo/quần; tránh tự thêm chữ lạ hoặc logo không có thật."),
    created_by: null,
    created_at: "2026-07-24T09:17:00.000Z",
  },
  {
    id: "seed-fashion-tshirt-mockup-gradient",
    title: "Tạo ảnh mockup áo thun nền gradient nổi bật cho shop in áo",
    crumb: "Mockup áo thun",
    tag: "GPT Image",
    hashtag: "#aoThun #mockup #printOnDemand",
    images: [cover("Mockup Tee", "Gradient • Poster", "#9b5cff")],
    prompt_text: fashionPrompt("áo thun in hình, áo local brand, áo oversize hoặc áo POD", "áo thun treo/lơ lửng trên nền gradient tím xanh, có sticker graphic nhẹ, ánh sáng studio rõ texture vải", "youthful poster, hiện đại, nổi bật, phù hợp bán áo local brand", "giữ họa tiết in đúng vị trí; không làm chữ trên áo bị méo nếu có file mẫu."),
    created_by: null,
    created_at: "2026-07-24T09:16:00.000Z",
  },
  {
    id: "seed-fashion-hoodie-winter-lookbook",
    title: "Tạo ảnh hoodie mùa lạnh phong cách lookbook đường phố",
    crumb: "Hoodie lookbook",
    tag: "GPT Image",
    hashtag: "#hoodie #localbrand #winter",
    images: [cover("Hoodie", "Winter • Lookbook", "#33c48d")],
    prompt_text: fashionPrompt("hoodie, áo khoác nỉ, sweater hoặc áo local brand mùa lạnh", "con phố mùa đông, tường xi măng tối giản, người mẫu mặc hoodie tạo dáng tự nhiên, có ánh sáng chiều nhẹ", "street lookbook, trẻ, ấm, đời thường nhưng vẫn cao cấp", "nhấn rõ độ dày vải, form oversize/regular, bo tay, mũ áo và họa tiết trước ngực."),
    created_by: null,
    created_at: "2026-07-24T09:15:00.000Z",
  },
  {
    id: "seed-fashion-handbag-luxury-product",
    title: "Tạo ảnh túi xách nữ luxury trên bục studio ánh sáng mềm",
    crumb: "Túi xách luxury",
    tag: "GPT Image",
    hashtag: "#tuiXach #phuKienNu #luxury",
    images: [cover("Túi xách", "Luxury • Studio", "#f2b544")],
    prompt_text: fashionPrompt("túi xách nữ, túi đeo chéo, clutch hoặc túi công sở", "studio màu kem, bục trưng bày trắng, vải lụa mềm, ánh sáng vàng nhẹ, sản phẩm đặt chính giữa như catalogue cao cấp", "luxury product photography, tinh tế, nữ tính, sạch và đắt tiền", "giữ rõ chất liệu da/vải, khóa, dây đeo và form túi; không tự thêm logo hãng lớn."),
    created_by: null,
    created_at: "2026-07-24T09:14:00.000Z",
  },
  {
    id: "seed-fashion-backpack-urban-commute",
    title: "Tạo ảnh balo đi học/đi làm phong cách urban tiện dụng",
    crumb: "Balo urban",
    tag: "GPT Image",
    hashtag: "#balo #phuKien #urban",
    images: [cover("Balo", "Urban • Daily", "#2fb1ff")],
    prompt_text: fashionPrompt("balo laptop, balo đi học, túi đeo chéo hoặc balo du lịch ngắn ngày", "ga tàu/cafe thành phố, người mẫu đeo balo đi làm, laptop và bình nước phụ họa nhẹ, ánh sáng buổi sáng", "urban lifestyle, năng động, thực tế, phù hợp khách học sinh/sinh viên/văn phòng", "nhấn ngăn chứa, quai đeo, khóa kéo, khả năng phối đồ; không phóng đại chống nước nếu sản phẩm không có."),
    created_by: null,
    created_at: "2026-07-24T09:13:00.000Z",
  },
  {
    id: "seed-fashion-watch-macro-premium",
    title: "Tạo ảnh đồng hồ đeo tay cận cảnh sang trọng với ánh sáng kim loại",
    crumb: "Đồng hồ cận cảnh",
    tag: "GPT Image",
    hashtag: "#dongHo #phuKienNam #premium",
    images: [cover("Đồng hồ", "Macro • Premium", "#d7b56d")],
    prompt_text: fashionPrompt("đồng hồ nam/nữ, vòng tay đồng hồ hoặc phụ kiện kim loại", "nền đá đen, ánh sáng viền vàng, cận cảnh mặt đồng hồ và dây, có phản chiếu nhẹ như quảng cáo luxury", "macro premium, sắc nét, sang trọng, nam tính/nữ tính tùy sản phẩm", "giữ đúng số kim, màu mặt, chất liệu dây; tránh làm méo mặt đồng hồ hoặc chữ nhỏ."),
    created_by: null,
    created_at: "2026-07-24T09:12:00.000Z",
  },
  {
    id: "seed-fashion-sunglasses-summer",
    title: "Tạo ảnh kính mát mùa hè phản chiếu biển trời cực bắt mắt",
    crumb: "Kính mát summer",
    tag: "GPT Image",
    hashtag: "#kinhMat #phuKien #summer",
    images: [cover("Kính mát", "Summer • Reflection", "#ffb347")],
    prompt_text: fashionPrompt("kính mát, kính thời trang, gọng kính hoặc phụ kiện mắt kính", "nền biển trời mùa hè, kính đặt trên vải lanh trắng, tròng kính phản chiếu ánh nắng và nước biển", "summer lifestyle, sáng, cao cấp, phù hợp bán phụ kiện du lịch", "giữ đúng form gọng, màu tròng, chất liệu; không tự thêm logo thương hiệu lớn."),
    created_by: null,
    created_at: "2026-07-24T09:11:00.000Z",
  },
  {
    id: "seed-fashion-jewelry-soft-glow",
    title: "Tạo ảnh trang sức nữ ánh sáng mềm lấp lánh tinh tế",
    crumb: "Trang sức nữ",
    tag: "GPT Image",
    hashtag: "#trangSuc #phuKienNu #jewelry",
    images: [cover("Trang sức", "Soft Glow • Nữ tính", "#ffd6e7")],
    prompt_text: fashionPrompt("dây chuyền, vòng tay, nhẫn, bông tai hoặc phụ kiện trang sức nữ", "nền vải satin màu champagne, hộp trang sức mở nhẹ, ánh sáng mềm tạo điểm lấp lánh tinh tế", "elegant jewelry photography, nữ tính, sạch, sang, không quá lòe loẹt", "giữ đúng màu kim loại/đá; không phóng đại thành kim cương/vàng thật nếu không đúng mô tả."),
    created_by: null,
    created_at: "2026-07-24T09:10:00.000Z",
  },
  {
    id: "seed-fashion-cap-hat-street",
    title: "Tạo ảnh mũ lưỡi trai/nón bucket phong cách street casual",
    crumb: "Mũ nón street",
    tag: "GPT Image",
    hashtag: "#muNon #streetwear #phuKien",
    images: [cover("Mũ nón", "Street • Casual", "#7dd3fc")],
    prompt_text: fashionPrompt("mũ lưỡi trai, nón bucket, mũ len hoặc phụ kiện đội đầu", "tường graffiti nhẹ, người mẫu mặc outfit basic, mũ là điểm nhấn chính, ánh sáng ngoài trời buổi chiều", "street casual, trẻ trung, dễ phối đồ, phù hợp bán trên TikTok Shop", "nhấn rõ logo/họa tiết trên mũ nếu có; không làm méo vành mũ hoặc sai form."),
    created_by: null,
    created_at: "2026-07-24T09:09:00.000Z",
  },
  {
    id: "seed-fashion-women-office-outfit",
    title: "Tạo ảnh set đồ công sở nữ thanh lịch cho dân văn phòng",
    crumb: "Outfit công sở nữ",
    tag: "GPT Image",
    hashtag: "#congSoNu #officewear #fashion",
    images: [cover("Office Wear", "Nữ • Thanh lịch", "#c4b5fd")],
    prompt_text: fashionPrompt("áo sơ mi nữ, quần tây, chân váy, blazer hoặc set công sở", "văn phòng hiện đại, cửa kính, ánh sáng sáng sạch, người mẫu nữ đứng tự tin cầm laptop/sổ tay", "office chic, chuyên nghiệp, thanh lịch, dễ ứng dụng", "giữ outfit kín đáo, lịch sự; nhấn form quần áo và chất liệu vải."),
    created_by: null,
    created_at: "2026-07-24T09:08:00.000Z",
  },
  {
    id: "seed-fashion-men-office-smart",
    title: "Tạo ảnh outfit nam công sở smart casual lịch lãm",
    crumb: "Outfit nam công sở",
    tag: "GPT Image",
    hashtag: "#doNam #smartCasual #office",
    images: [cover("Smart Casual", "Nam • Office", "#94a3b8")],
    prompt_text: fashionPrompt("áo sơ mi nam, quần tây, blazer, polo hoặc set smart casual", "sảnh văn phòng/cafe business, người mẫu nam chỉnh tay áo, ánh sáng tự nhiên, outfit gọn và lịch sự", "smart casual, nam tính, trưởng thành, dễ chốt khách văn phòng", "giữ rõ cổ áo, vai áo, nếp quần; tránh tạo dáng quá cứng hoặc quá bóng bẩy."),
    created_by: null,
    created_at: "2026-07-24T09:07:00.000Z",
  },
  {
    id: "seed-fashion-athleisure-gym",
    title: "Tạo ảnh đồ tập athleisure năng động cho nữ/nam",
    crumb: "Đồ tập athleisure",
    tag: "GPT Image",
    hashtag: "#doTap #athleisure #gymwear",
    images: [cover("Athleisure", "Gym • Năng động", "#33c48d")],
    prompt_text: fashionPrompt("đồ tập gym, áo bra thể thao, quần legging, set thể thao hoặc áo khoác thể thao", "phòng gym sáng, người mẫu chuẩn bị tập, bình nước và thảm yoga phụ họa, sản phẩm rõ form", "active lifestyle, khỏe khoắn, sạch, có năng lượng nhưng không phản cảm", "không cam kết giảm cân/tăng cơ; chỉ thể hiện cảm giác thoải mái, co giãn, dễ vận động."),
    created_by: null,
    created_at: "2026-07-24T09:06:00.000Z",
  },
  {
    id: "seed-fashion-kids-outfit-pastel",
    title: "Tạo ảnh quần áo trẻ em pastel dễ thương cho shop mẹ bé",
    crumb: "Quần áo trẻ em",
    tag: "GPT Image",
    hashtag: "#thoiTrangTreEm #meBe #kidswear",
    images: [cover("Kidswear", "Pastel • Dễ thương", "#ffb6c8")],
    prompt_text: fashionPrompt("quần áo trẻ em, váy bé gái, set bé trai hoặc phụ kiện trẻ em", "phòng trẻ em pastel, gấu bông và kệ gỗ nhỏ, outfit được treo/đặt gọn hoặc người mẫu trẻ em tạo dáng an toàn", "cute kidswear, mềm mại, gia đình, sạch và đáng tin", "ưu tiên tư thế an toàn, không tạo hình nguy hiểm; giữ màu vải dịu và đúng sản phẩm."),
    created_by: null,
    created_at: "2026-07-24T09:05:00.000Z",
  },
  {
    id: "seed-fashion-bag-flatlay-accessory",
    title: "Tạo ảnh flatlay phụ kiện thời trang gồm túi, ví, kính, đồng hồ",
    crumb: "Flatlay phụ kiện",
    tag: "GPT Image",
    hashtag: "#flatlay #phuKien #fashion",
    images: [cover("Flatlay", "Phụ kiện • Mix đồ", "#f2b544")],
    prompt_text: fashionPrompt("combo phụ kiện thời trang: túi, ví, kính, đồng hồ, khăn, trang sức", "mặt bàn đá sáng, phụ kiện sắp xếp flatlay gọn, có hoa khô/tạp chí/vải lụa làm nền, ánh sáng mềm", "premium flatlay, sạch, dễ nhìn, phù hợp ảnh banner và bài đăng bán hàng", "không để đạo cụ lấn át sản phẩm; mỗi món nên nhìn rõ hình dáng và màu."),
    created_by: null,
    created_at: "2026-07-24T09:04:00.000Z",
  },
  {
    id: "seed-fashion-denim-jeans-casual",
    title: "Tạo ảnh quần jeans/denim casual nổi rõ form dáng",
    crumb: "Jeans denim",
    tag: "GPT Image",
    hashtag: "#jeans #denim #casual",
    images: [cover("Denim", "Jeans • Casual", "#60a5fa")],
    prompt_text: fashionPrompt("quần jeans, áo khoác denim, chân váy denim hoặc set denim casual", "studio nền xi măng sáng, người mẫu tạo dáng đi bộ nhẹ, ánh sáng rõ texture vải denim", "casual fashion, đời thường, trẻ, dễ phối đồ", "nhấn rõ form ống quần, lưng quần, túi, wash màu; tránh làm méo chân hoặc sai tỉ lệ cơ thể."),
    created_by: null,
    created_at: "2026-07-24T09:03:00.000Z",
  },
  {
    id: "seed-fashion-raincoat-utility",
    title: "Tạo ảnh áo mưa/phụ kiện đi mưa thực dụng nhưng vẫn đẹp",
    crumb: "Áo mưa phụ kiện",
    tag: "GPT Image",
    hashtag: "#aoMua #phuKienDiMua #utility",
    images: [cover("Rainwear", "Utility • Daily", "#38bdf8")],
    prompt_text: fashionPrompt("áo mưa, ô dù, túi chống nước, bọc giày đi mưa hoặc phụ kiện mùa mưa", "đường phố sau mưa, ánh đèn phản chiếu, người mẫu cầm ô hoặc mặc áo mưa, sản phẩm rõ chi tiết", "urban utility, thực dụng, sạch, có cảm giác bảo vệ và tiện lợi", "không khẳng định chống nước tuyệt đối nếu chưa có thông số; mô tả theo hướng hỗ trợ đi mưa tiện hơn."),
    created_by: null,
    created_at: "2026-07-24T09:02:00.000Z",
  },
  {
    id: "seed-fashion-video-5-shots-outfit",
    title: "Tạo 5 prompt video 10 giây cho một outfit thời trang bán hàng",
    crumb: "Video outfit 5 cảnh",
    tag: "Veo / Flow",
    hashtag: "#videoAI #fashionKOC #outfit",
    images: [cover("Video Outfit", "5 cảnh • 10 giây", "#9b5cff")],
    prompt_text: `Từ một ảnh outfit hoặc ảnh sản phẩm thời trang [đính kèm ảnh/mô tả], hãy tạo 5 prompt video ngắn, mỗi prompt 8-10 giây, tỉ lệ 9:16 để đăng TikTok/Reels/Shorts.

Yêu cầu chung:
- Giữ cùng một người mẫu, cùng outfit, cùng màu sắc và form sản phẩm trong cả 5 clip.
- Mỗi clip có một chuyển động rõ: xoay người, bước đi, cận chất liệu, phối phụ kiện, chốt đơn.
- Phong cách realistic, cinematic, ánh sáng đẹp, không làm sai logo/họa tiết.

Output cần trả về:
1. Clip hook: người mẫu bước vào khung hình, outfit nổi bật trong 3 giây đầu.
2. Clip cận chất liệu: máy quay lia gần vào vải, đường may, form dáng.
3. Clip phối đồ: thêm túi/kính/giày để khách thấy cách mặc.
4. Clip lifestyle: người mẫu đi ngoài phố/cafe/văn phòng đúng ngữ cảnh sản phẩm.
5. Clip CTA: người mẫu nhìn camera, chỉ nhẹ vào sản phẩm, có khoảng trống đặt chữ giá/ưu đãi.

Với mỗi clip hãy viết: prompt video, text overlay, lời thoại ngắn, gợi ý nhạc/nhịp dựng.`,
    created_by: null,
    created_at: "2026-07-24T09:01:00.000Z",
  },
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
