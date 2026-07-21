"use client";

import { useMemo, useState } from "react";

type Hook = {
  cat: string;
  catLabel: string;
  text: string;
  usage: string;
};

const HOOKS: Hook[] = [
  {
    cat: "to-mo",
    catLabel: "Gây tò mò",
    text: "Đừng lướt vội — cái này sẽ thay đổi hoàn toàn cách bạn nghĩ về [chủ đề]. 90% người xem video này đến cuối vì lý do sau đây...",
    usage: "Dùng cho: mở đầu video review, giáo dục",
  },
  {
    cat: "phan-bac",
    catLabel: "Phản bác định kiến",
    text: "Ai cũng nói [quan niệm phổ biến], nhưng sự thật hoàn toàn khác — và tôi đã mất 2 năm mới nhận ra điều này.",
    usage: "Dùng cho: video quan điểm, phản biện",
  },
  {
    cat: "thong-ke",
    catLabel: "Thống kê giật mình",
    text: "97% người dùng đang mắc phải sai lầm này khi [hành động] — và có thể bạn cũng đang làm vậy ngay lúc này.",
    usage: "Dùng cho: video mẹo, cảnh báo",
  },
  {
    cat: "truoc-sau",
    catLabel: "Trước - sau",
    text: "Đây là tôi 3 tháng trước... và đây là bây giờ. Đây chính xác là những gì tôi đã thay đổi.",
    usage: "Dùng cho: video chuyển đổi, thành quả",
  },
  {
    cat: "ke-chuyen",
    catLabel: "Kể chuyện cá nhân",
    text: "Năm ngoái tôi đã mất [số tiền/thời gian] chỉ vì không biết điều này. Tôi không muốn bạn lặp lại sai lầm giống tôi.",
    usage: "Dùng cho: video tâm sự, bài học",
  },
  {
    cat: "canh-bao",
    catLabel: "Cảnh báo sai lầm",
    text: "Đừng bao giờ làm điều này nếu bạn đang [tình huống] — trừ khi bạn muốn gặp rắc rối lớn.",
    usage: "Dùng cho: video cảnh báo, mẹo an toàn",
  },
];

const CATEGORIES = [
  { value: "all", label: "Tất cả" },
  { value: "to-mo", label: "Gây tò mò" },
  { value: "phan-bac", label: "Phản bác định kiến" },
  { value: "thong-ke", label: "Thống kê giật mình" },
  { value: "truoc-sau", label: "Trước - sau" },
  { value: "ke-chuyen", label: "Kể chuyện cá nhân" },
  { value: "canh-bao", label: "Cảnh báo sai lầm" },
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function ViralHooksClient() {
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return HOOKS.filter((h, i) => {
      const matchesCat = cat === "all" || h.cat === cat;
      const matchesQuery = !q || normalize(h.catLabel + " " + h.text).includes(q);
      return matchesCat && matchesQuery;
    }).map((h) => ({ ...h, originalIndex: HOOKS.indexOf(h) }));
  }, [cat, query]);

  async function handleCopy(index: number, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  }

  return (
    <>
      <div className="rail">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            className={`pill${cat === c.value ? " active" : ""}`}
            onClick={() => setCat(c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="tools-row">
        <div className="tools-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Tìm hook theo từ khoá..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span className="result-count">{filtered.length} kết quả</span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {filtered.map((h) => (
            <div className="hook-card" key={h.originalIndex}>
              <div className="hook-top">
                <span className="hook-cat">{h.catLabel}</span>
                <span className="hook-free">FREE</span>
              </div>
              <div className="hook-quote">
                <svg width="22" height="18" viewBox="0 0 24 20" fill="currentColor">
                  <path d="M0 20V11.5C0 5.1 4.3 0.5 10.5 0L11 3.2C7.3 3.9 5 6.3 5 9.5H10V20H0ZM13 20V11.5C13 5.1 17.3 0.5 23.5 0L24 3.2C20.3 3.9 18 6.3 18 9.5H23V20H13Z" />
                </svg>
              </div>
              <p className="hook-text">&quot;{h.text}&quot;</p>
              <div className="hook-foot">
                <span className="hook-name">{h.usage}</span>
                <button className={`copy-btn${copiedIndex === h.originalIndex ? " copied" : ""}`} onClick={() => handleCopy(h.originalIndex, h.text)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="12" height="12" rx="2" />
                    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
                  </svg>
                  {copiedIndex === h.originalIndex ? "Đã sao chép" : "Sao chép"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ padding: "60px 20px" }}>
          <p>Không tìm thấy hook phù hợp. Thử từ khoá hoặc bộ lọc khác.</p>
        </div>
      )}
    </>
  );
}
