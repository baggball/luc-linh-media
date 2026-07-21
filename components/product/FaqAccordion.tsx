"use client";

import { useState } from "react";

export default function FaqAccordion({ faq }: { faq: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faq.length === 0) {
    return <p className="desc-text">Chưa có câu hỏi thường gặp cho sản phẩm này.</p>;
  }

  return (
    <div>
      {faq.map((item, i) => (
        <div key={i} className={`faq-item${openIndex === i ? " open" : ""}`}>
          <button className="faq-q" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            <span>{item.question}</span>
            <svg className="chev" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div className="faq-a">
            <div className="faq-a-inner">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
