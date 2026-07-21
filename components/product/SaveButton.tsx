"use client";

import { useState } from "react";

export default function SaveButton() {
  const [saved, setSaved] = useState(false);
  return (
    <button className={`save-btn${saved ? " saved" : ""}`} onClick={() => setSaved((v) => !v)}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
      </svg>
      {saved ? "Đã lưu" : "Lưu"}
    </button>
  );
}
