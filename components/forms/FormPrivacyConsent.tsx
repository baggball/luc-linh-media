import Link from "next/link";

export default function FormPrivacyConsent({ id }: { id: string }) {
  return (
    <label className="privacy-consent" htmlFor={id}>
      <input id={id} name="privacy-consent" type="checkbox" required />
      <span>
        Tôi đồng ý để Lục Linh Video AI dùng thông tin trên nhằm liên hệ và xử lý yêu cầu theo{" "}
        <Link href="/chinh-sach-bao-mat" target="_blank">
          chính sách bảo mật
        </Link>
        .
      </span>
    </label>
  );
}
