import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      const dismissed = sessionStorage.getItem("ember-install-dismissed");
      if (!dismissed) setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setInstalled(true);
      setVisible(false);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  if (installed || !visible || !deferred) return null;

  const onInstall = async () => {
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
      setInstalled(true);
    } else {
      dismiss();
    }
    setDeferred(null);
  };

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("ember-install-dismissed", "1");
  };

  return (
    <div className="fixed bottom-24 left-3 right-3 z-40 mx-auto max-w-md animate-[navlabel_0.3s_ease_forwards]">
      <div className="flex items-center gap-3 rounded-2xl border border-clay/20 bg-sand-50/95 backdrop-blur-xl shadow-[0_8px_24px_-6px_oklch(0.12_0.06_245/0.4)] px-4 py-3">
        <div className="size-10 shrink-0 rounded-xl bg-clay/15 border border-clay/25 flex items-center justify-center">
          <Download className="size-5 text-clay" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-ink text-sm leading-tight">Install Ember</p>
          <p className="text-[11px] text-ink-light leading-tight mt-0.5">
            Add to your home screen for quick access
          </p>
        </div>
        <button
          type="button"
          onClick={onInstall}
          className="shrink-0 rounded-full bg-clay text-sand-50 px-4 py-2 text-xs font-bold active:scale-95 transition-transform"
        >
          Install
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 size-8 rounded-full flex items-center justify-center text-ink-light hover:text-ink active:scale-95 transition-all"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
