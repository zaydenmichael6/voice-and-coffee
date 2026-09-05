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
  { id: "goodnight", title: "Goodnight, Emzilla", description: "Just close your eyes and listen to me.", icon: "moon-outline", file: null, placeholderDuration: 18 },
  { id: "right-here", title: "I'm right here", description: "You don't have to think about anything right now.", icon: "heart-outline", file: null, placeholderDuration: 22 },
  { id: "close-eyes", title: "Close your eyes", description: "Just breathe and relax.", icon: "sparkles-outline", file: null, placeholderDuration: 16 },
  { id: "sleep-baby", title: "Go to sleep, baby", description: "You've done enough for today.", icon: "cloud-outline", file: null, placeholderDuration: 20 },
  { id: "coffee-break", title: "A little coffee break", description: "Okay, no coffee right now. You need to sleep.", icon: "cafe-outline", file: null, placeholderDuration: 24 },
  { id: "miss-me", title: "When you miss me", description: "This one's for when you just need to hear my voice.", icon: "infinite-outline", file: null, placeholderDuration: 26 },
];

export const DEFAULT_NOTE = `Whenever you can't sleep, come here.\n\nClose your eyes, press play,\nand pretend I'm right beside you.\n\nI may not physically be there,\nbut I'm always only one play button away.\n\nGoodnight, Emzilla. 🤎`;

export const BIRTHDAY_MESSAGE = `I wanted to give you something that you could keep with you.\n\nSomething small.\n\nSomething that's always here whenever you need it.\n\nSo whenever you can't sleep,\nwhenever you need comfort,\nor whenever you just miss me...\n\nPress play.\n\nAnd pretend I'm right beside you.\n\nI love you. 🤎`;