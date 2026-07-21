import Link from "next/link";
import { PRODUCT_TYPE_LABEL, PRODUCT_TYPE_ROUTE, type Product } from "@/lib/types";
import { formatVND } from "@/lib/format";

const TONES = ["blue", "amber", "coral", "mixed"] as const;

function toneFor(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return TONES[sum % TONES.length];
}

export default function ProductCard({ product, badge }: { product: Product; badge?: "new" | "premium" }) {
  const href = `/${PRODUCT_TYPE_ROUTE[product.type]}/${product.id}`;
  const cover = product.images?.[0];

  return (
    <Link className="card" href={href}>
      <div className={`thumb ${toneFor(product.id)}${cover ? " has-image" : ""}`}>
        {cover && <img src={cover} alt={product.title} />}
        <div className="badges">
          {product.is_free && <span className="badge free">Miễn phí</span>}
          {badge === "new" && <span className="badge new">Mới</span>}
          {badge === "premium" && <span className="badge premium">Premium</span>}
          <span className="badge kind">{PRODUCT_TYPE_LABEL[product.type]}</span>
        </div>
        {!cover && (
          <div className="thumb-title" style={{ marginTop: "auto" }}>
            {product.title}
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="card-name">{product.title}</div>
        {product.description && <p className="card-desc">{product.description}</p>}
        <div className="card-meta">
          <span className="rating">★ {(product.rating ?? 5).toFixed(1)}</span>
          <span>· Đã bán {product.sold_count.toLocaleString("vi-VN")}</span>
        </div>
        <div className="card-price">
          <span className="price-now font-mono">{product.is_free ? "Miễn phí" : formatVND(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
