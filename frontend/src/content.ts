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
  { id: "one-yr", title: "1 yr", description: "one whole year of us. 🤎", icon: "heart-outline", file: require("../assets/audio/1 yr.m4a"), placeholderDuration: 18 },
  { id: "dreams", title: "dreams", description: "meet me in your dreams.", icon: "moon-outline", file: require("../assets/audio/dreams.m4a"), placeholderDuration: 22 },
  { id: "why-i-love-u", title: "why i love u", description: "a few of the endless reasons.", icon: "infinite-outline", file: require("../assets/audio/why i love u.m4a"), placeholderDuration: 16 },
  { id: "emily", title: "e m i l y", description: "your name, the way i love saying it.", icon: "sparkles-outline", file: require("../assets/audio/e m i l y.m4a"), placeholderDuration: 20 },
  { id: "happy-bday-baby", title: "happy bday baby", description: "for your special day, my love.", icon: "cafe-outline", file: require("../assets/audio/happy bday baby.m4a"), placeholderDuration: 24 },
];

export const DEFAULT_NOTE = `whenever you can't sleep, come here close your eyes, press play,\nand pretend i'm right beside you.\n\ni may not physically be there,\nbut i'm always only one play button away.\n\ngoodnight, angel :) 🤎`;

export const BIRTHDAY_TITLE = "happy bdayy my goat";
export const BIRTHDAY_MESSAGE = `hehe you found this smartie, wanted to give you something that you could keep with you. something small. something that's always here whenever you need it. happy 19th my love, have an amazing bdayyy :)`;