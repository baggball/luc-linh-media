"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FreePrompt } from "@/lib/types";

type ImageItem = { key: string; url: string; file?: File };

const EMPTY_FORM = { title: "", crumb: "", tag: "", hashtag: "", promptText: "" };

export default function AdminPromptManager({ initialPrompts }: { initialPrompts: FreePrompt[] }) {
  const [prompts, setPrompts] = useState<FreePrompt[]>(initialPrompts);
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

  function startEdit(p: FreePrompt) {
    setEditingId(p.id);
    setForm({ title: p.title, crumb: p.crumb, tag: p.tag ?? "", hashtag: p.hashtag ?? "", promptText: p.prompt_text });
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
    if (!form.title.trim() || !form.crumb.trim() || !form.promptText.trim()) return;

    setSaving(true);
    const supabase = createClient();
    try {
      const uploadedUrls: string[] = [];
      for (const img of images) {
        if (img.file) {
          const path = `${crypto.randomUUID()}-${img.file.name}`;
          const { error: uploadError } = await supabase.storage.from("prompt-images").upload(path, img.file);
          if (uploadError) throw uploadError;
          const { data: pub } = supabase.storage.from("prompt-images").getPublicUrl(path);
          uploadedUrls.push(pub.publicUrl);
        } else {
          uploadedUrls.push(img.url);
        }
      }

      const payload = {
        title: form.title.trim(),
        crumb: form.crumb.trim(),
        tag: form.tag.trim() || null,
        hashtag: form.hashtag.trim() || null,
        prompt_text: form.promptText.trim(),
        images: uploadedUrls,
      };

      if (editingId) {
        const { data, error: updateError } = await supabase.from("free_prompts").update(payload).eq("id", editingId).select().single();
        if (updateError) throw updateError;
        setPrompts((prev) => prev.map((p) => (p.id === editingId ? (data as FreePrompt) : p)));
        setToast(`Đã cập nhật "${payload.title}"!`);
      } else {
        const { data, error: insertError } = await supabase.from("free_prompts").insert(payload).select().single();
        if (insertError) throw insertError;
        setPrompts((prev) => [data as FreePrompt, ...prev]);
        setToast(`Đã thêm "${payload.title}"!`);
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

  async function handleDelete(p: FreePrompt) {
    if (!confirm(`Xoá prompt "${p.title}"?`)) return;
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("free_prompts").delete().eq("id", p.id);
    if (deleteError) {
      alert(deleteError.message);
      return;
    }
    setPrompts((prev) => prev.filter((x) => x.id !== p.id));
    if (editingId === p.id) resetForm();
  }

  return (
    <>
      <div className="admin-banner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>
          <b>Trang nội bộ — chỉ dành cho quản trị viên.</b> Prompt thêm ở đây sẽ tự hiện trên trang Prompt miễn phí.
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
        <h2>{editingId ? "Sửa prompt" : "Thêm prompt miễn phí"}</h2>
        <p className="sub">
          {editingId ? "Cập nhật thông tin — bấm Lưu thay đổi để áp dụng." : "Điền thông tin — prompt sẽ tự xuất hiện trên trang Prompt miễn phí ngay khi lưu."}
        </p>

        {error && <p style={{ color: "var(--coral)", fontSize: 13.5, marginBottom: 16 }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="pm-title">Tên đầy đủ</label>
              <input
                id="pm-title"
                type="text"
                placeholder="Vd: Tạo ảnh quảng cáo son môi ánh sáng studio"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="pm-crumb">Tên ngắn (hiện trong danh sách)</label>
              <input
                id="pm-crumb"
                type="text"
                placeholder="Vd: Ảnh son môi ánh sáng studio"
                required
                value={form.crumb}
                onChange={(e) => setForm((f) => ({ ...f, crumb: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="pm-tag">Danh mục</label>
              <input id="pm-tag" type="text" placeholder="Vd: Mỹ phẩm" value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))} />
            </div>
            <div className="field">
              <label htmlFor="pm-hashtag">Hashtag</label>
              <input
                id="pm-hashtag"
                type="text"
                placeholder="Vd: #anh-san-pham"
                value={form.hashtag}
                onChange={(e) => setForm((f) => ({ ...f, hashtag: e.target.value }))}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="pm-prompt">Nội dung Prompt</label>
            <textarea
              id="pm-prompt"
              placeholder="SUBJECT: ...&#10;LIGHTING: ...&#10;CAMERA: ..."
              required
              style={{ minHeight: 160, fontFamily: "var(--font-mono)" }}
              value={form.promptText}
              onChange={(e) => setForm((f) => ({ ...f, promptText: e.target.value }))}
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
              {saving ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "+ Thêm prompt"}
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
        <h2>Prompt đã thêm</h2>
        <span>{prompts.length} prompt</span>
      </div>

      {prompts.length === 0 ? (
        <div className="empty-added">Chưa có prompt nào — điền form phía trên để bắt đầu.</div>
      ) : (
        <div className="prod-grid">
          {prompts.map((p) => (
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
                <span className="prod-type-badge">{p.tag || "Prompt"}</span>
              </div>
              <div className="prod-body">
                <b>{p.crumb}</b>
                <span>{p.hashtag || "Miễn phí"}</span>
                <div className="prod-actions">
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
