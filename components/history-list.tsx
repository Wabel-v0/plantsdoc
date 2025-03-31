"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Leaf,
  Calendar,
  ChevronRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import DiagnosisResult from "@/components/diagnosis-result";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { getUserDiagnosisHistory } from "@/lib/firebase";

// Updated DiagnosisItem type to match Firestore data
type DiagnosisItem = {
  id: string;
  date: Date;
  disease: string;
  confidence: number;
  description: string;
  treatment: string[];
  prevention: string[];
  imageUrl: string;
  // Add language versions
  en?: {
    disease: string;
    confidence: number;
    description: string;
    treatment: string[];
    prevention: string[];
  };
  ar?: {
    disease: string;
    confidence: number;
    description: string;
    treatment: string[];
    prevention: string[];
  };
};

export default function HistoryList() {
  const { t, direction, language } = useLanguage();
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState<DiagnosisItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DiagnosisItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modify the fetchHistory function to handle permission errors
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { history, error } = await getUserDiagnosisHistory(user.uid);

        if (error) {
          // Check if it's a permissions error or an index error
          if (
            error.includes("permission") ||
            error.includes("Permission") ||
            error.includes("requires an index")
          ) {
            console.warn("Firestore access issue:", error);
            // Just set empty history instead of throwing
            setHistoryItems([]);

            // If it's an index error, show a more specific message
            if (error.includes("requires an index")) {
              setError(
                "The history feature is being set up. Please try again in a few minutes."
              );
            }
          } else {
            throw new Error(error);
          }
        } else {
          setHistoryItems(history as DiagnosisItem[]);
        }
      } catch (err: any) {
        console.error("Error fetching history:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  // Reset selected item when navigating back
  const handleBackToList = () => {
    setSelectedItem(null);
  };

  // Display error if fetching failed
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <AlertTriangle className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          {t("history.error") || "Error loading history"}
        </h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  // Display loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">
          {t("history.loading") || "Loading history..."}
        </span>
      </div>
    );
  }

  // Display selected diagnosis details
  if (selectedItem) {
    return (
      <DiagnosisResult
        result={selectedItem}
        onReset={handleBackToList}
        fromHistory={true}
      />
    );
  }

  // Display empty state if no history
  if (historyItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Leaf className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          {t("dashboard.history.empty.title")}
        </h3>
        <p className="text-gray-500">
          {t("dashboard.history.empty.description")}
        </p>
      </div>
    );
  }

  // Display history list
  return (
    <div className="space-y-4">
      {historyItems.map((item) => {
        // Use appropriate language content based on current language
        const displayContent =
          language === "ar" && item.ar
            ? { ...item, ...item.ar }
            : language === "en" && item.en
            ? { ...item, ...item.en }
            : item;

        return (
          <Card key={item.id} className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-start">
                <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 mr-4 rtl:ml-4 rtl:mr-0 flex-shrink-0">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={displayContent.disease}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-green-50">
                      <Leaf className="h-8 w-8 text-green-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {displayContent.disease}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
                    <Calendar className="h-3.5 w-3.5 mr-1 rtl:ml-1 rtl:mr-0" />
                    {item.date instanceof Date
                      ? item.date.toLocaleDateString(
                          language === "ar" ? "ar-SA" : "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : new Date(item.date).toLocaleDateString(
                          language === "ar" ? "ar-SA" : "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-xs font-medium text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">
                      {t("history.confidence")}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        displayContent.confidence > 80
                          ? "text-green-600"
                          : "text-amber-500"
                      }`}
                    >
                      {displayContent.confidence}%
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => setSelectedItem(item)}
                >
                  {t("history.viewDetails")}
                  <ChevronRight
                    className={`h-4 w-4 ${
                      direction === "rtl" ? "mr-1 rtl-flip" : "ml-1"
                    }`}
                  />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
