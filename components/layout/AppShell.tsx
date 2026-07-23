import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

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
        href="https://zalo.me/0379062594"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat với Lục Linh Video AI qua Zalo"
      >
        <span className="floating-zalo-dot" />
        <span>Tư vấn Zalo</span>
      </a>
    </div>
  );
}
