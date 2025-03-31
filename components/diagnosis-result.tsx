"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Leaf,
  Shield,
  Save,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

type DiagnosisResultProps = {
  result: {
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
  };
  onReset: () => void;
  onSave?: (result: any) => Promise<void>;
  imageUrl?: string;
  fromHistory?: boolean;
};

export default function DiagnosisResult({
  result,
  onReset,
  onSave,
  imageUrl,
  fromHistory = false,
}: DiagnosisResultProps) {
  const { t, direction, language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const displayContent =
    language === "ar" && result.ar
      ? result.ar
      : language === "en" && result.en
      ? result.en
      : result;

  const { disease, confidence, description, treatment, prevention } =
    displayContent;

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave({
        ...result,
        imageUrl,
      });

      toast({
        title: t("history.saveSuccess") || "Saved to History",
        description:
          t("history.saveSuccessMessage") ||
          "Diagnosis has been saved to your history",
      });

      onReset();
    } catch (error) {
      console.error("Error saving diagnosis:", error);
      toast({
        variant: "destructive",
        title: t("history.saveError") || "Save Failed",
        description:
          t("history.saveErrorMessage") ||
          "Could not save diagnosis to history",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6" dir={direction}>
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onReset}>
          <ArrowLeft
            className={`w-4 h-4 ${
              direction === "rtl" ? "ml-2 rtl-flip" : "mr-2"
            }`}
          />
          {t("result.back")}
        </Button>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">
            {t("result.confidence")}
          </span>
          <span
            className={`text-sm font-bold ${
              confidence > 80 ? "text-green-600" : "text-amber-500"
            }`}
          >
            {confidence}%
          </span>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 rtl:ml-2 rtl:mr-0 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">
              {t("result.diagnosis")} {disease}
            </h3>
            <p className="mt-1 text-sm text-amber-700">{description}</p>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="treatment"
        dir={direction}
        className="w-full"
        data-orientation={direction === "rtl" ? "rtl" : "ltr"}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="treatment"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{t("result.treatment.tab")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="prevention"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Shield className="w-4 h-4" />
            <span>{t("result.prevention.tab")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="treatment" className="mt-4" dir={direction}>
          <Card className="p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Leaf className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-green-600" />
              {t("result.treatment.title")}
            </h4>
            {treatment && treatment.length > 0 ? (
              <ul className="space-y-2" dir={direction}>
                {treatment.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start text-right rtl:text-right ltr:text-left"
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-800 text-xs font-medium mr-2 rtl:ml-2 rtl:mr-0 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                {t("result.treatment.empty") ||
                  "No recommended treatment available."}
              </p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="prevention" className="mt-4" dir={direction}>
          <Card className="p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 text-green-600" />
              {t("result.prevention.title")}
            </h4>
            {prevention && prevention.length > 0 ? (
              <ul className="space-y-2" dir={direction}>
                {prevention.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start text-right rtl:text-right ltr:text-left"
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-800 text-xs font-medium mr-2 rtl:ml-2 rtl:mr-0 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                {t("result.prevention.empty") ||
                  "No prevention tips available."}
              </p>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {!fromHistory && user && (
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="mr-2 spinner"></span>
              {t("result.saving") || "Saving..."}
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {t("result.saveButton")}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
