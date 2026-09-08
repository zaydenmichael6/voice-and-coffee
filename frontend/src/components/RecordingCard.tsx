import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { RecordingConfig } from "@/src/content";
import { makeStyles } from "@/src/theme";

type Props = {
  recording: RecordingConfig;
  active: boolean;
  playing: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  onToggle: () => void;
};

export function RecordingCard({ recording, active, playing, progress, currentTime, duration, onToggle }: Props) {
  const styles = useStyles();
  const iconName = recording.icon as keyof typeof Ionicons.glyphMap;
  return (
    <View style={[styles.card, active && styles.activeCard]} testID={`recording-card-${recording.id}`}>
      <View style={styles.cardTop}>
        <View style={[styles.iconBubble, active && styles.activeIconBubble]}>
          <Ionicons name={iconName} size={20} color={active ? styles.activeIcon.color : styles.icon.color} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>{recording.title}</Text>
          <Text style={styles.description}>{recording.description}</Text>
        </View>
        <Pressable
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityLabel={`${playing ? "Pause" : "Play"} ${recording.title}`}
          style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}
          testID={`play-${recording.id}`}
        >
          <Ionicons name={playing ? "pause" : "play"} size={19} color={styles.playIcon.color} />
        </Pressable>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, progress * 100))}%` }]} />
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.time}>{formatTime(currentTime)}</Text>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>
      {active && !recording.file ? <Text style={styles.placeholder}>placeholder audio · add your recording in src/content.ts</Text> : null}
    </View>
  );
}

function formatTime(value: number) {
  const seconds = Math.max(0, Math.floor(value));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

const useStyles = makeStyles((colors) => StyleSheet.create({
  card: { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, borderRadius: 20, borderWidth: 1, marginBottom: 12, padding: 16 },
  activeCard: { borderColor: colors.brand, shadowColor: colors.brand, shadowOpacity: 0.22, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  cardTop: { alignItems: "center", flexDirection: "row", gap: 12 },
  iconBubble: { alignItems: "center", backgroundColor: colors.surfaceTertiary, borderRadius: 16, height: 44, justifyContent: "center", width: 44 },
  activeIconBubble: { backgroundColor: colors.brandTertiary },
  icon: { color: colors.muted },
  activeIcon: { color: colors.brandPrimary },
  copy: { flex: 1, gap: 4 },
  title: { color: colors.onSurfaceSecondary, fontSize: 16, fontWeight: "700" },
  description: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  playButton: { alignItems: "center", backgroundColor: colors.brandPrimary, borderRadius: 24, height: 46, justifyContent: "center", width: 46 },
  playIcon: { color: colors.onBrandPrimary },
  pressed: { opacity: 0.72, transform: [{ scale: 0.94 }] },
  progressTrack: { backgroundColor: colors.surfaceTertiary, borderRadius: 3, height: 5, marginTop: 16, overflow: "hidden" },
  progressFill: { backgroundColor: colors.brandPrimary, borderRadius: 3, height: "100%" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 7 },
  time: { color: colors.muted, fontSize: 12, fontVariant: ["tabular-nums"] },
  placeholder: { color: colors.brandPrimary, fontSize: 11, marginTop: 10 },
}));