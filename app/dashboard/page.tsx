"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, History, LogOut, Leaf, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "@/components/image-uploader";
import DiagnosisResult from "@/components/diagnosis-result";
import HistoryList from "@/components/history-list";
import { useLanguage } from "@/contexts/language-context";
import LanguageSwitcher from "@/components/language-switcher";
import RouteGuard from "@/components/route-guard";
import { useAuth } from "@/contexts/auth-context";
import { saveDiagnosisToHistory } from "@/lib/firebase";

export default function DashboardPage() {
  const { toast } = useToast();
  const { t, direction, language } = useLanguage();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("diagnose");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<null | {
    disease: string;
    confidence: number;
    description: string;
    treatment: string[];
    prevention: string[];
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
  }>(null);
  const [currentImageBase64, setCurrentImageBase64] = useState<string | null>(
    null
  );

  // Handle logout
  const handleLogout = async () => {
    const { success, error } = await logout();
    if (error) {
      console.error("Logout error:", error);
    }
  };

  // Function to handle image upload and analysis
  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    setDiagnosisResult(null);

    try {
      // Convert the file to base64 and store it
      const base64Image = await convertToBase64(file);
      setCurrentImageBase64(base64Image);

      // Create form data to send the image
      const formData = new FormData();
      formData.append("image", file);

      // Send the image to our API endpoint
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      // Parse the diagnosis results
      const analysisData = await response.json();

      // The response has nested data structure with en/ar translations
      if (analysisData.data) {
        // Extract the appropriate language data based on current language
        const languageData =
          analysisData.data[language] || analysisData.data.en;

        // Set the diagnosis result with the language-specific data
        setDiagnosisResult({
          ...languageData,
          // Keep a reference to both language versions for language switching
          en: analysisData.data.en,
          ar: analysisData.data.ar,
        });

        toast({
          title: t("uploader.analysisComplete") || "Analysis Complete",
          description:
            t("uploader.diagnosisSuccessful") ||
            "Your plant has been diagnosed successfully.",
        });
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        variant: "destructive",
        title: t("uploader.analysisFailed") || "Analysis Failed",
        description:
          t("uploader.errorAnalyzing") ||
          "There was an error analyzing your plant image.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add the save to history function
  const handleSaveDiagnosis = async (diagnosisData: any) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: t("history.loginRequired") || "Login Required",
        description:
          t("history.loginToSave") ||
          "Please login to save diagnosis to history",
      });
      return;
    }

    // Save to Firestore
    await saveDiagnosisToHistory(
      user.uid,
      diagnosisData,
      currentImageBase64 || ""
    );
  };

  // Add the convertToBase64 helper function
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <RouteGuard>
      <div className="flex flex-col min-h-screen bg-gray-50" dir={direction}>
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6 lg:px-8">
            <Link
              href="/"
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Leaf className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold text-green-800">
                Plants Doc
              </span>
            </Link>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <LanguageSwitcher />
              <span className="text-sm font-medium text-gray-600">
                {user?.email || "User"}
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 py-8">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
              {t("dashboard.title")}
            </h1>

            <Tabs
              defaultValue="diagnose"
              value={activeTab}
              onValueChange={setActiveTab}
              dir={direction}
              className="w-full"
              data-orientation={direction === "rtl" ? "rtl" : "ltr"}
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger
                  value="diagnose"
                  className="flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Upload className="w-4 h-4" />
                  <span>{t("dashboard.tab.diagnose")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <History className="w-4 h-4" />
                  <span>{t("dashboard.tab.history")}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="diagnose"
                className="space-y-6"
                dir={direction}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{t("dashboard.diagnose.title")}</CardTitle>
                    <CardDescription>
                      {t("dashboard.diagnose.subtitle")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!diagnosisResult ? (
                      <ImageUploader
                        onImageUpload={handleImageUpload}
                        isLoading={isAnalyzing}
                        hideCamera={true}
                      />
                    ) : (
                      <DiagnosisResult
                        result={diagnosisResult}
                        onReset={() => {
                          setDiagnosisResult(null);
                          setCurrentImageBase64(null);
                        }}
                        onSave={handleSaveDiagnosis}
                        imageUrl={currentImageBase64 || ""}
                      />
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("dashboard.tips.title")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <AlertCircle className="w-6 h-6 mt-1 text-amber-500" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {t("dashboard.tips.forBestResults")}
                        </h4>
                        <ul className="pl-5 mt-2 space-y-1 text-sm text-gray-600 list-disc rtl:pr-5 rtl:pl-0">
                          <li>{t("dashboard.tips.tip1")}</li>
                          <li>{t("dashboard.tips.tip2")}</li>
                          <li>{t("dashboard.tips.tip3")}</li>
                          <li>{t("dashboard.tips.tip4")}</li>
                          <li>{t("dashboard.tips.tip5")}</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" dir={direction}>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("dashboard.history.title")}</CardTitle>
                    <CardDescription>
                      {t("dashboard.history.subtitle")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <HistoryList />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 bg-white border-t">
          <div className="container px-4 mx-auto text-center sm:px-6 lg:px-8">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Plants Doc. {t("footer.rights")}
            </p>
          </div>
        </footer>
      </div>
    </RouteGuard>
  );
}
