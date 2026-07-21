"use client";

import { useState } from "react";
import type { FreePrompt } from "@/lib/types";

export default function FreePromptViewer({ prompts }: { prompts: FreePrompt[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const active = prompts[activeIndex];

  function selectPrompt(i: number) {
    setActiveIndex(i);
    setActiveImgIndex(0);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(active.prompt_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="layout-2col">
      <aside className="picker">
        <h2>{prompts.length} Prompt mẫu miễn phí</h2>
        <p className="picker-sub">Bấm để xem toàn bộ nội dung prompt — sao chép dùng ngay, không mất phí.</p>
        <div>
          {prompts.map((p, i) => (
            <button key={p.id} className={`pick-item${i === activeIndex ? " active" : ""}`} onClick={() => selectPrompt(i)}>
              <span className="pick-swatch">{p.images[0] && <img src={p.images[0]} alt="" />}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <b>{p.crumb}</b>
                <span>{p.tag || "Prompt"}</span>
              </span>
              <span className="free-tag">FREE</span>
            </button>
          ))}
        </div>
      </aside>

      <div>
        {active.hashtag && <span className="hashtag-pill">{active.hashtag}</span>}
        <h1 className="detail-title">{active.title}</h1>
        <div className="detail-meta">
          <span className="rating">★ 4.9</span>
          <span>· {new Date(active.created_at).toLocaleDateString("vi-VN")}</span>
        </div>

        <div className="info-box">
          <h3>Cách dùng</h3>
          <ol>
            <li>Dán toàn bộ nội dung bên dưới vào công cụ tạo ảnh AI (Midjourney, DALL·E, Nano Banana...).</li>
            <li>
              Thay các phần trong dấu <b>[ ]</b> bằng thông tin sản phẩm thực tế của bạn.
            </li>
            <li>Giữ nguyên phần ánh sáng và bố cục để đảm bảo chất lượng ảnh quảng cáo chuyên nghiệp.</li>
          </ol>
        </div>

        {active.images.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div className="prompt-gallery-main">
              <img src={active.images[activeImgIndex]} alt={active.title} />
            </div>
            {active.images.length > 1 && (
              <div className="prompt-gallery-thumbs">
                {active.images.map((src, i) => (
                  <div key={src + i} className={`prompt-g-thumb${i === activeImgIndex ? " active" : ""}`} onClick={() => setActiveImgIndex(i)}>
                    <img src={src} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="prompt-box">
          <div className="prompt-box-head">
            <h3>Nội dung Prompt</h3>
            <button className={`mini-btn${copied ? " copied" : ""}`} onClick={handleCopy}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="12" height="12" rx="2" />
                <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
              </svg>
              {copied ? "Đã sao chép" : "Sao chép"}
            </button>
          </div>
          <div className="prompt-text">{active.prompt_text}</div>
        </div>

        <div className="cta-band">
          <div>
            <h3>Muốn tự động hoá việc này mỗi ngày?</h3>
            <p>Dùng Chatbot GPT tương ứng để tự sinh ảnh &amp; đổi mẫu chỉ trong một câu lệnh.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
