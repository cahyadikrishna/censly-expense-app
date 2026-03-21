import React, { useEffect, useCallback, useRef } from "react";
import { View, Text, Image, StyleSheet, ViewStyle, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
  runOnJS,
  interpolate,
} from "react-native-reanimated";

interface ReceiptScanCardProps {
  imageSource?: string | number;
  isScanning?: boolean;
  progress?: number;
  showProgress?: boolean;
  label?: string;
  onScanComplete?: () => void;
  containerStyle?: ViewStyle;
  size?: "small" | "medium" | "large";
}

export const ReceiptScanCard = React.memo<ReceiptScanCardProps>(
  ({
    imageSource,
    isScanning = true,
    progress = 0,
    showProgress = true,
    label = "Scanning Receipt...",
    onScanComplete,
    containerStyle,
    size = "medium",
  }) => {
    const { width: screenWidth } = useWindowDimensions();
    const cardMaxWidth = screenWidth * 0.9;

    const scanPosition = useSharedValue(0);
    const opacity = useSharedValue(0);
    const isComplete = useSharedValue(false);
    const hasCompletedRef = useRef(false);

    const sizeStyles: Record<"small" | "medium" | "large", { width: number; height: number }> = {
      small: { width: 160, height: 160 },
      medium: { width: 240, height: 240 },
      large: { width: 320, height: 320 },
    };

    const dimensions = sizeStyles[size];

    const startScanAnimation = useCallback(() => {
      scanPosition.value = 0;
      opacity.value = 1;

      scanPosition.value = withTiming(1, {
        duration: 2500,
        easing: Easing.linear,
      }, (finished) => {
        if (finished && isScanning) {
          runOnJS(startScanAnimation)();
        }
      });
    }, [isScanning]);

    const showComplete = useCallback(() => {
      isComplete.value = true;
      opacity.value = withTiming(0, { duration: 300 });
      onScanComplete?.();
    }, [onScanComplete]);

    useEffect(() => {
      if (isScanning && !hasCompletedRef.current) {
        startScanAnimation();
      } else if (!isScanning && scanPosition.value > 0) {
        cancelAnimation(scanPosition);
        if (progress >= 100 && !hasCompletedRef.current) {
          hasCompletedRef.current = true;
          showComplete();
        }
      }

      return () => {
        cancelAnimation(scanPosition);
      };
    }, [isScanning, startScanAnimation, showComplete, progress]);

    const scanLineStyle = useAnimatedStyle(() => {
      const translateY = (scanPosition.value + 1) * 0.5 * dimensions.height;
      return {
        transform: [{ translateY }],
        opacity: opacity.value,
      };
    });

    const glowStyle = useAnimatedStyle(() => {
      const translateY = (scanPosition.value + 1) * 0.5 * dimensions.height;
      return {
        transform: [{ translateY }],
        opacity: opacity.value * 0.5,
      };
    });

    const successStyle = useAnimatedStyle(() => {
      return {
        opacity: isComplete.value ? 1 : 0,
        transform: [{ scale: isComplete.value ? 1 : 0.5 }],
      };
    });

    const isCompleteValue = isComplete.value;

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
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={styles.label}>{isCompleteValue ? "Complete!" : label}</Text>
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

        {showProgress && isScanning && (
          <Text style={styles.progress}>{Math.round(progress)}% Complete</Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
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
