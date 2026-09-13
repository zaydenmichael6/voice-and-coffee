import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { makeStyles } from "@/src/theme";
import { storage } from "@/src/utils/storage";

const DISMISS_KEY = "emzilla-install-hint-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
};

// gentle web-only nudge to add the app to the home screen. android/chrome fires
// beforeinstallprompt; ios safari needs manual share-sheet instructions instead.
export function InstallHint() {
  const styles = useStyles();
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const removeListener = useRef<(() => void) | null>(null);
  const [visible, setVisible] = useState(false);
  const [manualSteps, setManualSteps] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    let cancelled = false;
    (async () => {
      const dismissed = await storage.getItem(DISMISS_KEY, false);
      if (cancelled || dismissed) return;
      const nav = navigator as Navigator & { standalone?: boolean };
      const installed = window.matchMedia?.("(display-mode: standalone)").matches || nav.standalone === true;
      if (installed) return;
      if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
        setManualSteps(true);
        setVisible(true);
        return;
      }
      const handler = (event: Event) => {
        event.preventDefault();
        deferredPrompt.current = event as BeforeInstallPromptEvent;
        setVisible(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      removeListener.current = () => window.removeEventListener("beforeinstallprompt", handler);
    })();
    return () => {
      cancelled = true;
      removeListener.current?.();
    };
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    storage.setItem(DISMISS_KEY, true);
  };

  const install = async () => {
    if (!deferredPrompt.current) return;
    try {
      await deferredPrompt.current.prompt();
    } catch {
      // user closed the native prompt
    }
    deferredPrompt.current = null;
    dismiss();
  };

  return (
    <View style={styles.card} testID="install-hint">
      <View style={styles.iconWrap}>
        <Ionicons name="phone-portrait-outline" size={20} color={styles.icon.color} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>keep me on your home screen</Text>
        <Text style={styles.text}>
          {manualSteps
            ? "in safari, tap the share button and choose \u201cadd to home screen\u201d — i'll be one tap away whenever you can't sleep."
            : "add this little app to your home screen, so i'm always one tap away whenever you can't sleep."}
        </Text>
        <View style={styles.actions}>
          {manualSteps ? null : (
            <Pressable onPress={install} accessibilityRole="button" testID="install-hint-add" style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
              <Text style={styles.addButtonText}>add to home screen</Text>
            </Pressable>
          )}
          <Pressable onPress={dismiss} accessibilityRole="button" testID="install-hint-dismiss" style={({ pressed }) => [styles.dismissButton, pressed && styles.pressed]}>
            <Text style={styles.dismissText}>{manualSteps ? "got it" : "maybe later"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const useStyles = makeStyles((colors) => StyleSheet.create({
  card: { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, borderRadius: 18, borderWidth: 1, flexDirection: "row", gap: 12, marginTop: 18, padding: 15 },
  iconWrap: { alignItems: "center", backgroundColor: colors.brandTertiary, borderRadius: 14, height: 42, justifyContent: "center", width: 42 },
  icon: { color: colors.brandPrimary },
  copy: { flex: 1, gap: 6 },
  title: { color: colors.onSurfaceSecondary, fontSize: 14, fontWeight: "700" },
  text: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  actions: { alignItems: "center", flexDirection: "row", gap: 14, marginTop: 6 },
  addButton: { backgroundColor: colors.brandPrimary, borderRadius: 12, justifyContent: "center", minHeight: 38, paddingHorizontal: 14 },
  addButtonText: { color: colors.onBrandPrimary, fontSize: 12, fontWeight: "700" },
  dismissButton: { justifyContent: "center", minHeight: 38 },
  dismissText: { color: colors.muted, fontSize: 12, fontWeight: "600" },
  pressed: { opacity: 0.76, transform: [{ scale: 0.97 }] },
}));
