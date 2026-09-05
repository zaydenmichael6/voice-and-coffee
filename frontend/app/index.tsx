import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BIRTHDAY_MESSAGE, DEFAULT_NOTE, recordings, type RecordingConfig } from "@/src/content";
import { RecordingCard } from "@/src/components/RecordingCard";
import { SleepMode } from "@/src/components/SleepMode";
import { makeStyles } from "@/src/theme";

const NOTE_KEY = "emzilla-personal-note";

export default function Index() {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView | null>(null);
  const player = useAudioPlayer(null, { updateInterval: 250 });
  const audioStatus = useAudioPlayerStatus(player);
  const coffeeTaps = useRef(0);
  const coffeeReset = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [placeholderTime, setPlaceholderTime] = useState(0);
  const [sleepMode, setSleepMode] = useState(false);
  const [birthdayVisible, setBirthdayVisible] = useState(false);
  const [timer, setTimer] = useState(15);
  const [timerRemaining, setTimerRemaining] = useState(15 * 60);
  const [note, setNote] = useState(DEFAULT_NOTE);
  const [noteSaved, setNoteSaved] = useState(false);
  const coffeePulse = useRef(new Animated.Value(1)).current;
  const activeRecording = recordings.find((recording) => recording.id === activeId) ?? null;
  const duration = activeRecording?.file && audioStatus.duration > 0 ? audioStatus.duration : activeRecording?.placeholderDuration ?? 0;
  const currentTime = activeRecording?.file ? audioStatus.currentTime : placeholderTime;
  const progress = duration ? currentTime / duration : 0;

  useEffect(() => {
    AsyncStorage.getItem(NOTE_KEY).then((saved) => saved && setNote(saved)).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;
    const manifest = document.createElement("link");
    manifest.rel = "manifest";
    manifest.href = "/manifest.json";
    document.head.appendChild(manifest);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/service-worker.js").catch(() => undefined);
    return () => manifest.remove();
  }, []);

  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(coffeePulse, { toValue: 1.06, duration: 2200, useNativeDriver: true }),
      Animated.timing(coffeePulse, { toValue: 1, duration: 2200, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [coffeePulse]);

  useEffect(() => {
    if (!activeRecording?.file || !audioStatus.didJustFinish) return;
    setIsPlaying(false);
  }, [activeRecording?.file, audioStatus.didJustFinish]);

  useEffect(() => {
    if (!activeRecording || activeRecording.file || !isPlaying) return;
    const interval = setInterval(() => {
      setPlaceholderTime((value) => {
        if (value + 0.25 >= activeRecording.placeholderDuration) {
          setIsPlaying(false);
          return activeRecording.placeholderDuration;
        }
        return value + 0.25;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [activeRecording, isPlaying]);

  useEffect(() => {
    if (!isPlaying || timer === 0) return;
    const interval = setInterval(() => {
      setTimerRemaining((value) => {
        if (value <= 1) {
          player.pause();
          setIsPlaying(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, player, timer]);

  const toggleRecording = (recording: RecordingConfig) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (recording.id !== activeId) {
      player.pause();
      setActiveId(recording.id);
      setPlaceholderTime(0);
      setIsPlaying(true);
      if (recording.file) {
        player.replace(recording.file);
        player.play();
      }
      return;
    }
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      if (recording.file) player.play();
      setIsPlaying(true);
    }
  };

  const startListening = () => {
    scrollRef.current?.scrollTo({ y: 430, animated: true });
  };

  const surpriseMe = () => {
    const pick = recordings[Math.floor(Math.random() * recordings.length)];
    toggleRecording(pick);
    scrollRef.current?.scrollTo({ y: 430, animated: true });
  };

  const handleCoffeeTap = () => {
    coffeeTaps.current += 1;
    if (coffeeReset.current) clearTimeout(coffeeReset.current);
    if (coffeeTaps.current >= 3) {
      coffeeTaps.current = 0;
      setBirthdayVisible(true);
      return;
    }
    coffeeReset.current = setTimeout(() => { coffeeTaps.current = 0; }, 1200);
  };

  const handleTimer = (value: number) => {
    setTimer(value);
    setTimerRemaining(value * 60);
  };

  const saveNote = async () => {
    await AsyncStorage.setItem(NOTE_KEY, note);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1800);
  };

  const openSleepMode = () => {
    if (!activeRecording) toggleRecording(recordings[0]);
    setSleepMode(true);
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar style="light" />
      <LinearGradient colors={[styles.gradientStart.color, styles.gradientEnd.color]} style={styles.root}>
        <ScrollView ref={scrollRef} testID="home-screen" contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 28 }]} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>YOUR LITTLE SLEEP SPACE</Text>
              <Text style={styles.brand}>Emzilla <Text style={styles.brandHeart}>🤎</Text></Text>
            </View>
            <Pressable onPress={handleCoffeeTap} accessibilityRole="button" accessibilityLabel="Coffee cup surprise" testID="coffee-secret" style={({ pressed }) => [styles.coffeeButton, pressed && styles.pressed]}>
              <Ionicons name="cafe" size={21} color={styles.coffeeIcon.color} />
            </Pressable>
          </View>

          <View style={styles.hero}>
            <View style={styles.heroCopy}>
              <Text style={styles.greeting}>Hey, Emzilla 🤎</Text>
              <Text style={styles.heroTitle}>Can&apos;t sleep?</Text>
              <Text style={styles.heroSubtitle}>Don&apos;t worry. I&apos;m right here.</Text>
              <Pressable onPress={startListening} testID="sleep-cta" accessibilityRole="button" style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
                <Text style={styles.primaryButtonText}>Let me help you sleep</Text>
                <Ionicons name="arrow-forward" size={18} color={styles.primaryButtonIcon.color} />
              </Pressable>
            </View>
            <Animated.View style={[styles.coffeeOrb, { transform: [{ scale: coffeePulse }] }]}>
              <Ionicons name="cafe-outline" size={48} color={styles.coffeeOrbIcon.color} />
              <View style={styles.steamOne} />
              <View style={styles.steamTwo} />
            </Animated.View>
          </View>

          <View style={styles.moodRow}>
            <View style={styles.moodItem}><Ionicons name="moon-outline" size={17} color={styles.moodIcon.color} /><Text style={styles.moodText}>soft nights</Text></View>
            <View style={styles.moodDot} />
            <View style={styles.moodItem}><Ionicons name="heart-outline" size={17} color={styles.moodIcon.color} /><Text style={styles.moodText}>made for you</Text></View>
            <View style={styles.moodDot} />
            <View style={styles.moodItem}><Ionicons name="headset-outline" size={17} color={styles.moodIcon.color} /><Text style={styles.moodText}>my voice</Text></View>
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleWrap}><Text style={styles.sectionTitle}>For the nights</Text><Text style={styles.sectionTitleAccent}>you can&apos;t sleep 🤎</Text></View>
            <Text style={styles.trackCount}>{recordings.length} little notes</Text>
          </View>

          <View style={styles.featuredCard}>
            <View style={styles.featuredIcon}><Ionicons name="volume-medium-outline" size={22} color={styles.featuredIconColor.color} /></View>
            <View style={styles.featuredCopy}><Text style={styles.featuredLabel}>READY WHEN YOU ARE</Text><Text style={styles.featuredTitle}>{activeRecording?.title ?? "Pick a little piece of me"}</Text></View>
            <Pressable onPress={openSleepMode} testID="sleep-mode-button" accessibilityRole="button" style={({ pressed }) => [styles.sleepButton, pressed && styles.pressed]}><Ionicons name="moon-outline" size={18} color={styles.sleepButtonIcon.color} /><Text style={styles.sleepButtonText}>Sleep mode</Text></Pressable>
          </View>

          {recordings.map((recording) => <RecordingCard key={recording.id} recording={recording} active={recording.id === activeId} playing={recording.id === activeId && isPlaying} progress={recording.id === activeId ? progress : 0} currentTime={recording.id === activeId ? currentTime : 0} duration={recording.id === activeId ? duration : recording.placeholderDuration} onToggle={() => toggleRecording(recording)} />)}

          <Pressable onPress={surpriseMe} testID="surprise-me" accessibilityRole="button" style={({ pressed }) => [styles.surpriseButton, pressed && styles.pressed]}>
            <Ionicons name="sparkles" size={18} color={styles.surpriseIcon.color} /><Text style={styles.surpriseText}>Surprise me</Text><Ionicons name="shuffle" size={17} color={styles.surpriseIcon.color} />
          </Pressable>

          <View style={styles.noteSection}>
            <View style={styles.noteHeading}><View style={styles.noteIcon}><Ionicons name="mail-open-outline" size={20} color={styles.noteIconColor.color} /></View><View><Text style={styles.eyebrow}>A LOVE LETTER</Text><Text style={styles.noteTitle}>A little note from me</Text></View></View>
            <TextInput value={note} onChangeText={setNote} multiline textAlignVertical="top" style={styles.noteInput} placeholderTextColor={styles.mutedText.color} accessibilityLabel="Personal note" />
            <Pressable onPress={saveNote} accessibilityRole="button" style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}><Text style={styles.saveButtonText}>{noteSaved ? "Saved with love" : "Save this note"}</Text><Ionicons name={noteSaved ? "checkmark" : "heart-outline"} size={16} color={styles.saveIcon.color} /></Pressable>
          </View>

          <View style={styles.replaceBox}><Ionicons name="information-circle-outline" size={19} color={styles.infoIcon.color} /><View style={styles.replaceCopy}><Text style={styles.replaceTitle}>Make it yours</Text><Text style={styles.replaceText}>Your cards are ready for real recordings. In <Text style={styles.replaceCode}>src/content.ts</Text>, change a file from null to your audio asset in assets/audio.</Text></View></View>
          <Text style={styles.footer}>A tiny digital love letter, for the nights you need me.</Text>
        </ScrollView>
      </LinearGradient>
      {sleepMode ? <SleepMode recording={activeRecording} playing={isPlaying} timer={timer} remaining={timerRemaining} onTimer={handleTimer} onToggle={() => activeRecording && toggleRecording(activeRecording)} onClose={() => setSleepMode(false)} /> : null}
      {birthdayVisible ? <BirthdayModal visible onClose={() => setBirthdayVisible(false)} /> : null}
    </KeyboardAvoidingView>
  );
}

function BirthdayModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const styles = useStyles();
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => { if (visible) Animated.timing(fade, { toValue: 1, duration: 650, useNativeDriver: true }).start(); }, [fade, visible]);
  return (
    <Animated.View pointerEvents={visible ? "auto" : "none"} style={[styles.birthdayOverlay, { opacity: visible ? fade : 0 }]}>
      <View style={styles.birthdayGlow}><Ionicons name="cafe" size={30} color={styles.birthdayIcon.color} /></View>
      <Text style={styles.birthdayKicker}>A tiny secret, just for you</Text>
      <Text style={styles.birthdayTitle}>Happy Birthday, Emzilla 🤎</Text>
      <Text style={styles.birthdayBody}>{BIRTHDAY_MESSAGE}</Text>
      <Text style={styles.birthdaySignoff}>Okay, now go to sleep. 😭🤎</Text>
      <Pressable onPress={onClose} accessibilityRole="button" style={({ pressed }) => [styles.birthdayButton, pressed && styles.pressed]}><Text style={styles.birthdayButtonText}>Keep this little secret</Text></Pressable>
    </Animated.View>
  );
}

const useStyles = makeStyles((colors) => StyleSheet.create({
  root: { flex: 1 }, gradientStart: { color: colors.surface }, gradientEnd: { color: colors.brandTertiary }, content: { paddingHorizontal: 20 },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 22 }, eyebrow: { color: colors.muted, fontSize: 10, fontWeight: "700", letterSpacing: 1.8 }, brand: { color: colors.onSurface, fontSize: 20, fontWeight: "700", marginTop: 5 }, brandHeart: { fontSize: 17 }, coffeeButton: { alignItems: "center", backgroundColor: colors.surfaceSecondary, borderColor: colors.border, borderRadius: 22, borderWidth: 1, height: 44, justifyContent: "center", width: 44 }, coffeeIcon: { color: colors.brandPrimary }, pressed: { opacity: 0.76, transform: [{ scale: 0.96 }] },
  hero: { backgroundColor: colors.brandTertiary, borderColor: colors.borderStrong, borderRadius: 26, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", minHeight: 244, overflow: "hidden", padding: 22, shadowColor: colors.brand, shadowOpacity: 0.2, shadowRadius: 22, shadowOffset: { width: 0, height: 12 }, elevation: 5 }, heroCopy: { flex: 1 }, greeting: { color: colors.brandPrimary, fontSize: 15, fontWeight: "700" }, heroTitle: { color: colors.onSurface, fontSize: 34, fontWeight: "700", letterSpacing: -1, marginTop: 18 }, heroSubtitle: { color: colors.onSurfaceSecondary, fontSize: 16, marginTop: 5 }, primaryButton: { alignItems: "center", backgroundColor: colors.brandPrimary, borderRadius: 18, flexDirection: "row", gap: 10, justifyContent: "center", marginTop: 28, minHeight: 48, paddingHorizontal: 15 }, primaryButtonText: { color: colors.onBrandPrimary, fontSize: 13, fontWeight: "700" }, primaryButtonIcon: { color: colors.onBrandPrimary }, coffeeOrb: { alignItems: "center", backgroundColor: colors.surfaceSecondary, borderColor: colors.brand, borderRadius: 62, borderWidth: 1, height: 124, justifyContent: "center", marginLeft: 8, marginTop: 20, width: 124 }, coffeeOrbIcon: { color: colors.brandPrimary }, steamOne: { backgroundColor: colors.brandPrimary, borderRadius: 4, height: 18, opacity: 0.55, position: "absolute", right: 42, top: 20, transform: [{ rotate: "14deg" }], width: 3 }, steamTwo: { backgroundColor: colors.brandPrimary, borderRadius: 4, height: 13, opacity: 0.4, position: "absolute", right: 55, top: 16, transform: [{ rotate: "-12deg" }], width: 3 },
  moodRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginVertical: 21, paddingHorizontal: 4 }, moodItem: { alignItems: "center", flexDirection: "row", gap: 6 }, moodIcon: { color: colors.brandPrimary }, moodText: { color: colors.muted, fontSize: 11 }, moodDot: { backgroundColor: colors.borderStrong, borderRadius: 3, height: 4, width: 4 }, sectionHeader: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between", marginBottom: 14 }, sectionTitleWrap: { gap: 1 }, sectionTitle: { color: colors.onSurface, fontSize: 23, fontWeight: "700" }, sectionTitleAccent: { color: colors.onSurfaceSecondary, fontSize: 19, fontWeight: "500" }, trackCount: { color: colors.muted, fontSize: 11 },
  featuredCard: { alignItems: "center", backgroundColor: colors.surfaceSecondary, borderColor: colors.border, borderRadius: 18, borderWidth: 1, flexDirection: "row", gap: 10, marginBottom: 16, padding: 13 }, featuredIcon: { alignItems: "center", backgroundColor: colors.brandTertiary, borderRadius: 14, height: 42, justifyContent: "center", width: 42 }, featuredIconColor: { color: colors.brandPrimary }, featuredCopy: { flex: 1, gap: 4 }, featuredLabel: { color: colors.muted, fontSize: 9, fontWeight: "700", letterSpacing: 1.2 }, featuredTitle: { color: colors.onSurfaceSecondary, fontSize: 13, fontWeight: "700" }, sleepButton: { alignItems: "center", backgroundColor: colors.surfaceTertiary, borderRadius: 12, flexDirection: "row", gap: 5, minHeight: 38, paddingHorizontal: 9 }, sleepButtonIcon: { color: colors.brandPrimary }, sleepButtonText: { color: colors.onSurfaceSecondary, fontSize: 11, fontWeight: "700" },
  surpriseButton: { alignItems: "center", backgroundColor: colors.brandSecondary, borderRadius: 18, flexDirection: "row", gap: 10, justifyContent: "center", marginVertical: 7, minHeight: 54 }, surpriseIcon: { color: colors.onBrandSecondary }, surpriseText: { color: colors.onBrandSecondary, fontSize: 15, fontWeight: "700" },
  noteSection: { backgroundColor: colors.surfaceInverse, borderRadius: 24, marginTop: 31, padding: 20 }, noteHeading: { alignItems: "center", flexDirection: "row", gap: 12 }, noteIcon: { alignItems: "center", backgroundColor: colors.brandTertiary, borderRadius: 17, height: 46, justifyContent: "center", width: 46 }, noteIconColor: { color: colors.brandPrimary }, noteTitle: { color: colors.onSurfaceInverse, fontSize: 20, fontWeight: "700", marginTop: 4 }, noteInput: { color: colors.onSurfaceInverse, fontSize: 16, lineHeight: 25, minHeight: 205, paddingBottom: 8, paddingTop: 22 }, mutedText: { color: colors.muted }, saveButton: { alignItems: "center", alignSelf: "flex-start", backgroundColor: colors.brandPrimary, borderRadius: 14, flexDirection: "row", gap: 8, minHeight: 44, paddingHorizontal: 14 }, saveButtonText: { color: colors.onBrandPrimary, fontSize: 13, fontWeight: "700" }, saveIcon: { color: colors.onBrandPrimary },
  replaceBox: { alignItems: "flex-start", backgroundColor: colors.surfaceSecondary, borderColor: colors.border, borderRadius: 18, borderWidth: 1, flexDirection: "row", gap: 10, marginTop: 18, padding: 15 }, infoIcon: { color: colors.brandPrimary, marginTop: 1 }, replaceCopy: { flex: 1, gap: 5 }, replaceTitle: { color: colors.onSurfaceSecondary, fontSize: 13, fontWeight: "700" }, replaceText: { color: colors.muted, fontSize: 12, lineHeight: 18 }, replaceCode: { color: colors.brandPrimary, fontWeight: "700" }, footer: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 27, textAlign: "center" },
  birthdayOverlay: { alignItems: "center", backgroundColor: colors.surface, bottom: 0, justifyContent: "center", left: 0, paddingHorizontal: 28, paddingVertical: 30, position: "absolute", right: 0, top: 0, zIndex: 20 }, birthdayGlow: { alignItems: "center", backgroundColor: colors.brandTertiary, borderColor: colors.borderStrong, borderRadius: 42, borderWidth: 1, height: 84, justifyContent: "center", marginBottom: 22, shadowColor: colors.brandPrimary, shadowOpacity: 0.35, shadowRadius: 28, shadowOffset: { width: 0, height: 10 }, width: 84 }, birthdayIcon: { color: colors.brandPrimary }, birthdayKicker: { color: colors.brandPrimary, fontSize: 12, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase" }, birthdayTitle: { color: colors.onSurface, fontSize: 29, fontWeight: "700", marginTop: 13, textAlign: "center" }, birthdayBody: { color: colors.onSurfaceSecondary, fontSize: 16, lineHeight: 25, marginTop: 27, textAlign: "center" }, birthdaySignoff: { color: colors.brandPrimary, fontSize: 15, fontWeight: "700", marginTop: 23, textAlign: "center" }, birthdayButton: { borderColor: colors.borderStrong, borderRadius: 17, borderWidth: 1, marginTop: 27, minHeight: 48, justifyContent: "center", paddingHorizontal: 18 }, birthdayButtonText: { color: colors.onSurface, fontSize: 13, fontWeight: "700" },
}));
