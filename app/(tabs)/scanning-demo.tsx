import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReceiptScanCard from "@components/ui/ReceiptScanCard";

type DemoPageProps = {
  navigation?: {
    goBack: () => void;
  };
};

const ScanningDemo: React.FC<DemoPageProps> = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleScanComplete = (): void => {
    console.log("[ScanningDemo] Scan complete!");
  };

  const handleRestart = (): void => {
    setIsScanning(true);
    setProgress(0);
    setShowImage(false);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const handleToggleImage = (): void => {
    setShowImage(!showImage);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Scanning Animation Demo</Text>
        
        <View style={styles.componentContainer}>
          <ReceiptScanCard
            imageSource={showImage ? "https://picsum.photos/400/400" : undefined}
            isScanning={isScanning}
            label="Scanning document..."
            onScanComplete={handleScanComplete}
            size="large"
          />
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleRestart}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Restart Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleToggleImage}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>
              {showImage ? "Hide Image" : "Show Image"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoText}>Props:</Text>
          <Text style={styles.infoItem}>- isScanning: boolean</Text>
          <Text style={styles.infoItem}>- progress: 0-100</Text>
          <Text style={styles.infoItem}>- imageSource: string | number</Text>
          <Text style={styles.infoItem}>- size: small | medium | large</Text>
          <Text style={styles.infoItem}>- onScanComplete: callback</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 32,
  },
  componentContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#1A1A1A",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  info: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 13,
    color: "#757575",
    marginBottom: 4,
  },
});

export default ScanningDemo;