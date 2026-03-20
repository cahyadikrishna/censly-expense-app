import { useMutation } from "@tanstack/react-query";
import { supabase } from "@lib/supabase";

export interface ScanItem {
  name: string;
  price: number;
}

export interface ScanResult {
  store_name: string;
  total_amount: number;
  date: string;
  items: ScanItem[];
}

export interface ScanReceiptResponse {
  extracted: ScanResult;
  imagePath: string;
}

async function scanReceipt(uri: string): Promise<ScanReceiptResponse> {
  const formData = new FormData();

  formData.append("file", {
    uri,
    name: "receipt.jpg",
    type: "image/jpeg",
  } as any);

  const { data, error } = await supabase.functions.invoke("process-receipt", {
    body: formData,
  });

  if (error) {
    console.error("[useScanReceipt] scanReceipt error:", error);
    throw error;
  }

  return data as ScanReceiptResponse;
}

export function useScanReceipt() {
  return useMutation({
    mutationFn: scanReceipt,
    onError: (error) => {
      console.error("[useScanReceipt] onError:", error);
    },
  });
}
