import { Image } from "expo-image";

const emojiToUrlCache = new Map<string, string>();

const TWEMOJI_BASE_URL = "https://twemoji.maxcdn.com/v/latest/72x72";

export function getTwemojiUrl(emoji: string): string {
  const cached = emojiToUrlCache.get(emoji);
  if (cached) return cached;

  const codePoint = Array.from(emoji)
    .map((char) => char.codePointAt(0)?.toString(16))
    .filter(Boolean)
    .join("-");

  const url = `${TWEMOJI_BASE_URL}/${codePoint}.png`;
  emojiToUrlCache.set(emoji, url);
  return url;
}

export function extractUniqueEmojis(emojis: (string | null | undefined)[]): string[] {
  const unique = new Set<string>();
  emojis.forEach((emoji) => {
    if (emoji) {
      unique.add(emoji);
    }
  });
  return Array.from(unique);
}

export async function prefetchEmojis(emojis: string[]): Promise<void> {
  const urls = emojis.map((emoji) => ({
    uri: getTwemojiUrl(emoji),
    headers: { Authorization: "emoji-prefetch" },
  }));

  try {
    await Image.prefetch(urls.map((u) => u.uri));
  } catch (error) {
    console.warn("Emoji prefetch failed:", error);
  }
}

export function clearEmojiCache(): void {
  emojiToUrlCache.clear();
}
