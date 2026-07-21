"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PRODUCT_TYPE_LABEL, PRODUCT_TYPE_ROUTE, type Product, type ProductType } from "@/lib/types";
import { formatVND } from "@/lib/format";

type ImageItem = { key: string; url: string; file?: File };

const EMPTY_FORM = {
  type: "chatbot" as ProductType,
  title: "",
  description: "",
  isFree: true,
  price: "",
  workflowLink: "",
  warranty: "15 ngày",
};

export default function AdminProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeTab, setActiveTab] = useState<"all" | ProductType>("all");
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  function resetForm() {
    setForm(EMPTY_FORM);
    setImages([]);
    setEditingId(null);
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      type: p.type,
      title: p.title,
      description: p.description ?? "",
      isFree: p.is_free,
      price: p.is_free ? "" : String(p.price),
      workflowLink: p.workflow_link ?? "",
      warranty: p.warranty ?? "15 ngày",
    });
    setImages(p.images.map((url, i) => ({ key: `existing-${i}-${url}`, url })));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const next = files.map((file) => ({ key: `${file.name}-${Date.now()}-${Math.random()}`, url: URL.createObjectURL(file), file }));
    setImages((prev) => [...prev, ...next]);
    e.target.value = "";
  }

  function removeImage(key: string) {
    setImages((prev) => prev.filter((img) => img.key !== key));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.description.trim()) return;
    if (!form.isFree && !Number(form.price)) {
      setError("Vui lòng nhập giá bán.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    try {
      const uploadedUrls: string[] = [];
      for (const img of images) {
        if (img.file) {
          const path = `${crypto.randomUUID()}-${img.file.name}`;
          const { error: uploadError } = await supabase.storage.from("product-images").upload(path, img.file);
          if (uploadError) throw uploadError;
          const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
          uploadedUrls.push(pub.publicUrl);
        } else {
          uploadedUrls.push(img.url);
        }
      }

      const payload = {
        type: form.type,
        title: form.title.trim(),
        description: form.description.trim(),
        is_free: form.isFree,
        price: form.isFree ? 0 : Number(form.price),
        warranty: form.warranty,
        images: uploadedUrls,
      };

      const privatePayload = {
        workflow_link: form.workflowLink.trim() || null,
      };

      if (editingId) {
        const { data, error: updateError } = await supabase
          .from("products")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editingId)
          .select()
          .single();
        if (updateError) throw updateError;
        const { error: privateError } = await supabase
          .from("product_private_content")
          .upsert({ product_id: editingId, ...privatePayload, updated_at: new Date().toISOString() });
        if (privateError) throw privateError;
        setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...(data as Product), ...privatePayload } : p)));
        setToast(`Đã cập nhật "${payload.title}"!`);
      } else {
        const slug = `${payload.title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${Date.now().toString(36)}`;
        const { data, error: insertError } = await supabase
          .from("products")
          .insert({ ...payload, slug })
          .select()
          .single();
        if (insertError) throw insertError;
        const { error: privateError } = await supabase
          .from("product_private_content")
          .upsert({ product_id: data.id, ...privatePayload });
        if (privateError) throw privateError;
        setProducts((prev) => [{ ...(data as Product), ...privatePayload }, ...prev]);
        setToast(`Đã thêm "${payload.title}" (${PRODUCT_TYPE_LABEL[form.type]})!`);
      }

      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra, thử lại sau.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: Product) {
    if (!confirm(`Xoá sản phẩm "${p.title}"?`)) return;
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("products").delete().eq("id", p.id);
    if (deleteError) {
      alert(deleteError.message);
      return;
    }
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
    if (editingId === p.id) resetForm();
  }

  const visibleList = activeTab === "all" ? products : products.filter((p) => p.type === activeTab);

  return (
    <>
      <div className="admin-banner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>
          <b>Trang nội bộ — chỉ dành cho quản trị viên.</b> Không gắn link công khai ở bất kỳ đâu trên site. Sản phẩm
          thêm ở đây sẽ tự hiện trên trang danh sách và trang chi tiết tương ứng.
        </span>
      </div>

      {toast && (
        <div className="toast show">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span>{toast}</span>
        </div>
      )}

      <div className="form-card">
        <h2>{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
        <p className="sub">
          {editingId
            ? "Cập nhật thông tin — bấm Lưu thay đổi để áp dụng."
            : "Điền thông tin — sản phẩm sẽ tự xuất hiện trên trang danh sách và trang chi tiết ngay khi lưu."}
        </p>

        {error && (
          <p style={{ color: "var(--coral)", fontSize: 13.5, marginBottom: 16 }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="pr-type">Loại sản phẩm</label>
              <select
                id="pr-type"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ProductType }))}
              >
                <option value="chatbot">Chatbot</option>
                <option value="workflow">Workflow</option>
                <option value="app">App</option>
                <option value="veo3">VEO3 Workflow</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="pr-title">Tên sản phẩm</label>
              <input
                id="pr-title"
                type="text"
                placeholder="Vd: Chatbot GPT — Tư vấn chọn size quần áo"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
          </div>

          <div className="field">
            <label>Giá</label>
            <div className="price-toggle">
              <button
                type="button"
                className={`price-opt${form.isFree ? " active" : ""}`}
                onClick={() => setForm((f) => ({ ...f, isFree: true }))}
              >
                Miễn phí
              </button>
              <button
                type="button"
                className={`price-opt${!form.isFree ? " active" : ""}`}
                onClick={() => setForm((f) => ({ ...f, isFree: false }))}
              >
                Trả phí
              </button>
            </div>
            {!form.isFree && (
              <div className="price-input-wrap show">
                <input
                  type="number"
                  placeholder="Vd: 129000"
                  min={0}
                  step={1000}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
              </div>
            )}
            {form.isFree && (
              <div className="link-input-wrap show">
                <input
                  type="text"
                  placeholder="Link mở sản phẩm (Google Drive, ChatGPT share link...)"
                  value={form.workflowLink}
                  onChange={(e) => setForm((f) => ({ ...f, workflowLink: e.target.value }))}
                />
              </div>
            )}
          </div>

          <div className="form-row-3">
            <div className="field">
              <label htmlFor="pr-warranty">Bảo hành</label>
              <select
                id="pr-warranty"
                value={form.warranty}
                onChange={(e) => setForm((f) => ({ ...f, warranty: e.target.value }))}
              >
                <option>7 ngày</option>
                <option>15 ngày</option>
                <option>30 ngày</option>
                <option>Không bảo hành</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="pr-desc">Mô tả sản phẩm</label>
            <textarea
              id="pr-desc"
              placeholder="Mô tả ngắn gọn tính năng, cách dùng, phù hợp cho ai..."
              required
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="field">
            <label>Ảnh minh hoạ (không bắt buộc, có thể chọn nhiều ảnh)</label>
            <div className="file-drop">
              <input type="file" accept="image/*" multiple onChange={handleFiles} />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
                <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
              </svg>
              <div>Kéo thả hoặc bấm để chọn ảnh</div>
            </div>
            {images.length > 0 && (
              <div className="img-preview-grid">
                {images.map((img) => (
                  <div className="img-preview" key={img.key}>
                    <img src={img.url} alt="" />
                    <button type="button" className="rm" onClick={() => removeImage(img.key)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1, padding: 14 }}>
              {saving ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "+ Thêm sản phẩm"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-ghost" onClick={resetForm} style={{ padding: 14 }}>
                Huỷ sửa
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="section-title">
        <h2>Sản phẩm đã thêm</h2>
        <span>{products.length} sản phẩm</span>
      </div>
      <div className="type-tabs">
        {(["all", "chatbot", "workflow", "app", "veo3"] as const).map((t) => (
          <button
            key={t}
            className={`type-tab${activeTab === t ? " active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t === "all" ? "Tất cả" : PRODUCT_TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      {visibleList.length === 0 ? (
        <div className="empty-added">Chưa có sản phẩm nào trong mục này — điền form phía trên để bắt đầu.</div>
      ) : (
        <div className="prod-grid">
          {visibleList.map((p) => (
            <div className="prod-card" key={p.id}>
              <div className="prod-thumb">
                {p.images[0] ? (
                  <img src={p.images[0]} alt="" />
                ) : (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                )}
                <span className="prod-type-badge">{PRODUCT_TYPE_LABEL[p.type]}</span>
              </div>
              <div className="prod-body">
                <b>{p.title}</b>
                <span className="price">{p.is_free ? "Miễn phí" : formatVND(p.price)}</span>
                <div className="prod-actions">
                  <Link href={`/${PRODUCT_TYPE_ROUTE[p.type]}/${p.id}`}>Xem chi tiết</Link>
                  <button type="button" className="prod-edit-btn" onClick={() => startEdit(p)}>
                    Sửa
                  </button>
                  <button type="button" onClick={() => handleDelete(p)}>
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
