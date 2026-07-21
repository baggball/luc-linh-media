"use client";

import { useState } from "react";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div>
      <div className={`gallery-main${hasImages ? " has-photo" : ""}`}>
        {hasImages ? (
          <>
            <img src={images[active]} alt={title} />
            <span className="gallery-counter">
              {active + 1} / {images.length}
            </span>
          </>
        ) : (
          <span className="gallery-counter">Chưa có ảnh</span>
        )}
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, i) => (
            <div
              key={src + i}
              className={`g-thumb${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
            >
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
