import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { ZALO_COMMUNITY_URL } from "@/lib/community";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main">
        <Topbar />
        {children}
      </div>
      <a
        className="floating-zalo"
        href={ZALO_COMMUNITY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Vào cộng đồng Zalo Lục Linh Video AI"
      >
        <span className="floating-zalo-dot" />
        <span>Cộng đồng Zalo</span>
      </a>
    </div>
  );
}
