import { lazy, Suspense, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useI18n } from "@/i18n";

// The panel (and its code) loads only when a visitor opens it, so every page stays fast.
const ChatPanel = lazy(() => import("./ChatPanel"));

export function ChatLauncher() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const toggle = () => {
    setLoaded(true);
    setOpen((value) => !value);
  };
  return (
    <>
      {loaded && (
        <Suspense fallback={null}>
          <ChatPanel open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
      <button
        type="button"
        onClick={toggle}
        onPointerEnter={() => void import("./ChatPanel")}
        aria-expanded={open}
        aria-controls="cubic-chat"
        aria-label={open ? t.chat.close : t.chat.open}
        className="fixed bottom-5 end-5 z-50 inline-flex h-12 items-center gap-2 rounded-full bg-[#f5f5f7] px-4 text-sm font-medium text-black shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-transform hover:scale-[1.03]"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <MessageCircle className="h-5 w-5" aria-hidden="true" />}
        <span className="hidden sm:inline">{open ? t.chat.close : t.chat.open}</span>
      </button>
    </>
  );
}
