import React, { useState, useCallback } from "react";
import { Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { getTwemojiUrl } from "@lib/emojiCache";

interface EmojiTextProps {
  text: string;
  size?: number;
}

export default function EmojiText({ text, size = 20 }: EmojiTextProps) {
  const [imageError, setImageError] = useState(false);

  const handleError = useCallback(() => {
    setImageError(true);
  }, []);

  if (imageError) {
    return <Text style={styles.fallback}>{text}</Text>;
  }

  return (
    <Image
      source={{ uri: getTwemojiUrl(text) }}
      style={{ width: size, height: size }}
      contentFit="contain"
      transition={200}
      onError={handleError}
      cachePolicy="memory-disk"
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    fontSize: 16,
  },
});
