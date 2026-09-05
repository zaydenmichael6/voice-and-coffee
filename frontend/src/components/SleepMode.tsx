import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { RecordingConfig } from "@/src/content";
import { makeStyles } from "@/src/theme";

type Props = { recording: RecordingConfig | null; playing: boolean; timer: number; remaining: number; onTimer: (value: number) => void; onToggle: () => void; onClose: () => void };

export function SleepMode({ recording, playing, timer, remaining, onTimer, onToggle, onClose }: Props) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const breathe = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(breathe, { toValue: 1.08, duration: 2600, useNativeDriver: true }),
      Animated.timing(breathe, { toValue: 1, duration: 2600, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [breathe]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}> 
        <View style={styles.topRow}>
          <Text style={styles.modeLabel}>SLEEP MODE</Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Close sleep mode" style={styles.closeButton}>
            <Ionicons name="close" size={22} color={styles.closeIcon.color} />
          </Pressable>
        </View>
        <View style={styles.center}>
          <Animated.View style={[styles.moonGlow, { transform: [{ scale: breathe }] }]}>
            <Ionicons name="moon" size={38} color={styles.moon.color} />
          </Animated.View>
          <Text style={styles.kicker}>A little quieter now</Text>
          <Text style={styles.title}>{recording?.title ?? "I'm right here"}</Text>
          <Text style={styles.subtitle}>Put your phone beside your pillow.</Text>
          <Pressable onPress={onToggle} accessibilityRole="button" accessibilityLabel={playing ? "Pause recording" : "Play recording"} style={({ pressed }) => [styles.mainButton, pressed && styles.pressed]}>
            <Ionicons name={playing ? "pause" : "play"} size={26} color={styles.mainIcon.color} />
          </Pressable>
          <Text style={styles.helper}>{playing ? "I'm staying right here with you" : "Press play when you're ready"}</Text>
        </View>
        <View style={styles.timerBox}>
          <View style={styles.timerHeading}><Text style={styles.timerTitle}>Sleep timer</Text><Text style={styles.remaining}>{timer > 0 && remaining > 0 ? `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")} left` : "ends with recording"}</Text></View>
          <View style={styles.timerRow}>
            {[15, 30, 60, 0].map((value) => (
              <Pressable key={value} onPress={() => onTimer(value)} accessibilityRole="button" style={[styles.timerChip, timer === value && styles.timerChipActive]}>
                <Text style={[styles.timerText, timer === value && styles.timerTextActive]}>{value === 0 ? "End" : `${value}m`}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
  );
}

const useStyles = makeStyles((colors) => StyleSheet.create({
  container: { backgroundColor: colors.surface, bottom: 0, flex: 1, justifyContent: "space-between", left: 0, paddingHorizontal: 24, position: "absolute", right: 0, top: 0, zIndex: 50, elevation: 50 },
  topRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  modeLabel: { color: colors.muted, fontSize: 11, fontWeight: "700", letterSpacing: 2 },
  closeButton: { alignItems: "center", borderColor: colors.border, borderRadius: 20, borderWidth: 1, height: 40, justifyContent: "center", width: 40 },
  closeIcon: { color: colors.onSurface },
  center: { alignItems: "center", marginTop: -30 },
  moonGlow: { alignItems: "center", backgroundColor: colors.brandTertiary, borderColor: colors.borderStrong, borderRadius: 72, borderWidth: 1, height: 144, justifyContent: "center", shadowColor: colors.brandPrimary, shadowOpacity: 0.3, shadowRadius: 28, shadowOffset: { width: 0, height: 12 }, width: 144 },
  moon: { color: colors.brandPrimary },
  kicker: { color: colors.muted, fontSize: 13, marginTop: 32 },
  title: { color: colors.onSurface, fontSize: 28, fontWeight: "700", marginTop: 10, textAlign: "center" },
  subtitle: { color: colors.onSurfaceSecondary, fontSize: 15, marginTop: 8, textAlign: "center" },
  mainButton: { alignItems: "center", backgroundColor: colors.brandPrimary, borderRadius: 38, height: 76, justifyContent: "center", marginTop: 30, width: 76 },
  mainIcon: { color: colors.onBrandPrimary },
  helper: { color: colors.muted, fontSize: 12, marginTop: 14 },
  timerBox: { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, borderRadius: 20, borderWidth: 1, padding: 16 },
  timerHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  timerTitle: { color: colors.onSurfaceSecondary, fontSize: 14, fontWeight: "700" },
  remaining: { color: colors.brandPrimary, fontSize: 12, fontWeight: "700" },
  timerRow: { flexDirection: "row", gap: 8 },
  timerChip: { alignItems: "center", backgroundColor: colors.surfaceTertiary, borderRadius: 14, flex: 1, minHeight: 44, justifyContent: "center" },
  timerChipActive: { backgroundColor: colors.brandPrimary },
  timerText: { color: colors.muted, fontSize: 13, fontWeight: "700" },
  timerTextActive: { color: colors.onBrandPrimary },
  pressed: { opacity: 0.76, transform: [{ scale: 0.96 }] },
}));