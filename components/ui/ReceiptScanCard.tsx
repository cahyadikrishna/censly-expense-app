import React, { useEffect, useCallback, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, ViewStyle, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";

interface ReceiptScanCardProps {
  imageSource?: string | number;
  isScanning?: boolean;
  label?: string;
  onScanComplete?: () => void;
  containerStyle?: ViewStyle;
  size?: "small" | "medium" | "large";
  progressIntervalMs?: number;
}

export const ReceiptScanCard = React.memo<ReceiptScanCardProps>(
  ({
    imageSource,
    isScanning = true,
    label = "Scanning Receipt...",
    onScanComplete,
    containerStyle,
    size = "medium",
    progressIntervalMs = 600,
  }) => {
    const { width: screenWidth } = useWindowDimensions();
    const cardMaxWidth = screenWidth * 0.9;

    const scanPosition = useSharedValue(0);
    const opacity = useSharedValue(0);
    const isCompleteShared = useSharedValue(false);
    const [isCompleteLabel, setIsCompleteLabel] = useState(false);
    const [displayProgress, setDisplayProgress] = useState(0);

    const progressSequence = [20, 38, 56, 80, 92];
    const progressIndexRef = useRef(0);
    const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const sizeStyles: Record<"small" | "medium" | "large", { width: number; height: number }> = {
      small: { width: 160, height: 160 },
      medium: { width: 240, height: 240 },
      large: { width: 320, height: 320 },
    };

    const dimensions = sizeStyles[size];

    const startScanAnimation = useCallback(() => {
      scanPosition.value = 0;
      opacity.value = 1;

      scanPosition.value = withRepeat(
        withTiming(1, {
          duration: 2500,
          easing: Easing.linear,
        }),
        -1,
        true
      );
    }, []);

    const stopProgressTimer = useCallback(() => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setDisplayProgress(100);
    }, []);

    const startProgressTimer = useCallback(() => {
      progressIndexRef.current = 0;
      setDisplayProgress(progressSequence[0]);

      progressIntervalRef.current = setInterval(() => {
        progressIndexRef.current += 1;
        if (progressIndexRef.current < progressSequence.length) {
          setDisplayProgress(progressSequence[progressIndexRef.current]);
        } else {
          const lastSequenceValue = progressSequence[progressSequence.length - 1];
          const nextProgress = Math.min(lastSequenceValue + 4, 100);
          setDisplayProgress(nextProgress);
          if (nextProgress >= 100) {
            stopProgressTimer();
          }
        }
      }, progressIntervalMs);
    }, [progressIntervalMs, stopProgressTimer]);

    const showComplete = useCallback(() => {
      cancelAnimation(scanPosition);
      stopProgressTimer();
      isCompleteShared.value = true;
      setIsCompleteLabel(true);
      opacity.value = withTiming(0, { duration: 300 });
      onScanComplete?.();
    }, [onScanComplete, stopProgressTimer]);

    useEffect(() => {
      if (isScanning) {
        setIsCompleteLabel(false);
        isCompleteShared.value = false;
        startScanAnimation();
        startProgressTimer();
      } else {
        cancelAnimation(scanPosition);
        showComplete();
      }

      return () => {
        cancelAnimation(scanPosition);
        stopProgressTimer();
      };
    }, [isScanning]);

    const scanLineStyle = useAnimatedStyle(() => {
      const translateY = scanPosition.value * dimensions.height;
      return {
        transform: [{ translateY }],
        opacity: opacity.value,
      };
    });

    const glowStyle = useAnimatedStyle(() => {
      const translateY = scanPosition.value * dimensions.height;
      return {
        transform: [{ translateY }],
        opacity: opacity.value * 0.5,
      };
    });

    const successStyle = useAnimatedStyle(() => {
      return {
        opacity: isCompleteShared.value ? 1 : 0,
        transform: [{ scale: isCompleteShared.value ? 1 : 0.5 }],
      };
    });

    const renderContent = () => {
      if (imageSource) {
        return (
          <Image
            source={typeof imageSource === "string" ? { uri: imageSource } : imageSource}
            style={[styles.imagePreview, dimensions]}
            resizeMode="cover"
          />
        );
      }

      return (
        <View
          style={[
            styles.placeholder,
            dimensions,
            { backgroundColor: "#F5F5F5" },
          ]}
        >
          <Text style={styles.placeholderIcon}>🧾</Text>
          <Text style={styles.placeholderText}>Receipt preview</Text>
        </View>
      );
    };

    return (
      <View style={[styles.wrapper, containerStyle]}>
        <View style={styles.container}>
          {label && (
            <Text style={styles.label}>{isCompleteLabel ? "Complete!" : label}</Text>
          )}

          <View style={[styles.card, { maxWidth: cardMaxWidth }]}>
            <View style={[styles.imageContainer, dimensions]}>
              {renderContent()}

              <View style={[styles.overlay, dimensions]} />

              <Animated.View style={[styles.scanLine, scanLineStyle, dimensions]}>
                <View style={styles.scanLineInner} />
              </Animated.View>

              <Animated.View style={[styles.glowLine, glowStyle, dimensions]} />

              <Animated.View style={[styles.successOverlay, successStyle, dimensions]}>
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              </Animated.View>
            </View>
          </View>

          {isScanning && (
            <Text style={styles.progress}>{displayProgress}% Complete</Text>
          )}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignSelf: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#757575",
    marginBottom: 12,
    letterSpacing: -0.01,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  imagePreview: {
    borderRadius: 6,
  },
  placeholder: {
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: "#757575",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 6,
  },
  scanLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  scanLineInner: {
    width: "100%",
    height: 3,
    backgroundColor: "#1A1A1A",
    borderRadius: 2,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  glowLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    zIndex: 5,
  },
  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    zIndex: 20,
  },
  checkmark: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  checkmarkText: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  progress: {
    fontSize: 12,
    color: "#757575",
    marginTop: 12,
    letterSpacing: -0.01,
  },
});

export default ReceiptScanCard;
