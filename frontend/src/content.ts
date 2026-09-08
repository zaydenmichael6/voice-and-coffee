import type { AudioSource } from "expo-audio";

// ✦ The one easy place to personalize the app. Add your own files in assets/audio,
// then replace `null` with require("../assets/audio/your-file.mp3").
export type RecordingConfig = {
  id: string;
  title: string;
  description: string;
  icon: string;
  file: AudioSource | null;
  placeholderDuration: number;
};

export const recordings: RecordingConfig[] = [
  { id: "goodnight", title: "goodnight, emzilla", description: "just close your eyes and listen to me.", icon: "moon-outline", file: null, placeholderDuration: 18 },
  { id: "right-here", title: "i'm right here", description: "you don't have to think about anything right now.", icon: "heart-outline", file: null, placeholderDuration: 22 },
  { id: "close-eyes", title: "close your eyes", description: "just breathe and relax.", icon: "sparkles-outline", file: null, placeholderDuration: 16 },
  { id: "sleep-baby", title: "go to sleep, baby", description: "you've done enough for today.", icon: "cloud-outline", file: null, placeholderDuration: 20 },
  { id: "coffee-break", title: "a little coffee break", description: "okay, no coffee right now. you need to sleep.", icon: "cafe-outline", file: null, placeholderDuration: 24 },
  { id: "miss-me", title: "when you miss me", description: "this one's for when you just need to hear my voice.", icon: "infinite-outline", file: null, placeholderDuration: 26 },
];

export const DEFAULT_NOTE = `whenever you can't sleep, come here close your eyes, press play,\nand pretend i'm right beside you.\n\ni may not physically be there,\nbut i'm always only one play button away.\n\ngoodnight, angel :) 🤎`;

export const BIRTHDAY_TITLE = "happy bdayy my goat";
export const BIRTHDAY_MESSAGE = `hehe you found this smartie, wanted to give you something that you could keep with you. something small. something that's always here whenever you need it. happy 19th my love, have an amazing bdayyy :)`;