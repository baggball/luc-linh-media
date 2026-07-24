"use client";

import { useState } from "react";
import Link from "next/link";
import type { FreePrompt } from "@/lib/types";

export default function FreePromptViewer({ prompts }: { prompts: FreePrompt[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const active = activeIndex === null ? null : prompts[activeIndex];

  function selectPrompt(i: number) {
    setActiveIndex(i);
    setActiveImgIndex(0);
    setCopied(false);
  }

  async function handleCopy() {
    if (!active) return;
    await navigator.clipboard.writeText(active.prompt_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <div className="free-prompt-hero">
        <span>FREE PROMPT LIBRARY</span>
        <h1>Kho prompt miễn phí cho ảnh sản phẩm, KOC & video AI bán hàng</h1>
        <p>Chọn một mẫu bên dưới, sao chép prompt và thay phần trong dấu [ ] bằng sản phẩm thật của bạn.</p>
      </div>

      <div className="prompt-masonry">
        {prompts.map((p, i) => (
          <button key={p.id} className="prompt-tile" type="button" onClick={() => selectPrompt(i)}>
            <div className="prompt-tile-img">
              {p.images[0] && <img src={p.images[0]} alt={p.title} />}
              <span className="prompt-count-badge">⌘ 6</span>
            </div>
            <div className="prompt-tile-body">
              <h2>{p.title}</h2>
              <div className="prompt-tile-meta">
                <span>👇</span>
                <b>{p.tag || "GPT Image"}</b>
              </div>
            </div>
          </button>
        ))}

        <Link className="prompt-combo-tile" href="/chatbot">
          <span className="combo-icon">🎁</span>
          <small>COMBO</small>
          <h2>Muốn làm nhanh hơn?</h2>
          <p>Mua chatbot theo ngách để tự sinh concept, prompt ảnh, prompt video và caption chốt đơn.</p>
          <b>Xem các Chatbot →</b>
        </Link>
      </div>

      {active && (
        <div className="prompt-modal" role="dialog" aria-modal="true" aria-label={active.title}>
          <button className="prompt-modal-backdrop" type="button" onClick={() => setActiveIndex(null)} aria-label="Đóng prompt" />
          <div className="prompt-modal-card">
            <button className="prompt-modal-close" type="button" onClick={() => setActiveIndex(null)} aria-label="Đóng">
              ×
            </button>
            <div className="prompt-modal-grid">
              <div>
                {active.images.length > 0 && (
                  <div style={{ marginBottom: 18 }}>
                    <div className="prompt-gallery-main">
                      <img src={active.images[activeImgIndex]} alt={active.title} />
                    </div>
                    {active.images.length > 1 && (
                      <div className="prompt-gallery-thumbs">
                        {active.images.map((src, i) => (
                          <div
                            key={src + i}
                            className={`prompt-g-thumb${i === activeImgIndex ? " active" : ""}`}
                            onClick={() => setActiveImgIndex(i)}
                          >
                            <img src={src} alt="" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="info-box">
                  <h3>Cách dùng nhanh</h3>
                  <ol>
                    <li>Copy prompt bên phải.</li>
                    <li>
                      Thay phần trong dấu <b>[ ]</b> bằng sản phẩm thật.
                    </li>
                    <li>Dán vào công cụ tạo ảnh/video AI rồi chỉnh lại chi tiết.</li>
                  </ol>
                </div>
              </div>

              <div>
                {active.hashtag && <span className="hashtag-pill">{active.hashtag}</span>}
                <h1 className="detail-title">{active.title}</h1>
                <div className="detail-meta">
                  <span className="rating">★ 4.9</span>
                  <span>· {new Date(active.created_at).toLocaleDateString("vi-VN")}</span>
                  <span>· FREE</span>
                </div>

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

                <div className="cta-band prompt-modal-cta">
                  <div>
                    <h3>Muốn tự động hoá việc này mỗi ngày?</h3>
                    <p>Dùng chatbot theo ngành để tự sinh ảnh, video và caption nhanh hơn.</p>
                  </div>
                  <Link className="btn btn-primary" href="/chatbot">
                    Xem chatbot
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
