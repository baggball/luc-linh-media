"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

type SortMode = "new" | "sold" | "price-asc" | "price-desc";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function ProductCatalog({
  products,
  ctaLabel,
  ctaHref,
}: {
  products: Product[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("new");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    let list = products.filter((p) => !q || normalize(p.title).includes(q));
    list = list.slice();
    if (sort === "sold") list.sort((a, b) => b.sold_count - a.sold_count);
    else if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list;
  }, [products, query, sort]);

  return (
    <>
      <div className="tools-row">
        <div className="tools-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo tên..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value as SortMode)}>
          <option value="new">Mới nhất</option>
          <option value="sold">Bán chạy nhất</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
        </select>
        <span className="result-count">{filtered.length} kết quả</span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ padding: "60px 20px" }}>
          <p>Không tìm thấy sản phẩm phù hợp. Thử từ khoá khác.</p>
        </div>
      )}

      {ctaLabel && ctaHref && (
        <div className="cta-band">
          <div>
            <h3>Không tìm thấy sản phẩm đúng ý?</h3>
            <p>Đặt làm sản phẩm riêng theo nhu cầu của bạn.</p>
          </div>
          <Link className="btn btn-primary" href={ctaHref}>
            {ctaLabel} →
          </Link>
        </div>
      )}
    </>
  );
}
