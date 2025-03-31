"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Shield, Activity, Zap, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import LanguageSwitcher from "@/components/language-switcher";

export default function LandingPage() {
  const { t, direction } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen" dir={direction}>
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-green-50 to-white">
        <div className="container px-4 py-8 mx-auto sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Leaf className="w-8 h-8 text-green-600" />
              <span className="text-xl font-bold text-green-800">
                Plants Doc
              </span>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <LanguageSwitcher />
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-green-600"
              >
                {t("nav.login")}
              </Link>
              <Link href="/signup" passHref>
                <Button className="bg-green-600 hover:bg-green-700">
                  {t("nav.signup")}
                </Button>
              </Link>
            </div>
          </nav>

          <div className="grid items-center grid-cols-1 gap-12 py-16 md:grid-cols-2">
            <div>
              <h1
                className={`mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl ${
                  direction === "rtl" ? "leading-loose tracking-wide" : ""
                }`}
              >
                <span className="block">{t("hero.title1")}</span>
                <span
                  className={`block text-green-600 ${
                    direction === "rtl" ? "mt-4" : ""
                  }`}
                >
                  {t("hero.title2")}
                </span>
              </h1>
              <p className="mb-8 text-lg text-gray-600">
                {t("hero.description")}
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
                <Link href="/signup" passHref>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    {t("hero.cta.getStarted")}
                    <ArrowRight
                      className={`w-4 h-4 ${
                        direction === "rtl" ? "mr-2 rtl-flip" : "ml-2"
                      }`}
                    />
                  </Button>
                </Link>
                <Link href="#features" passHref>
                  <Button size="lg" variant="outline">
                    {t("hero.cta.learnMore")}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 md:h-96">
              <Image
                src="https://images.unsplash.com/photo-1607237896259-191316556483?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZyYW1zfGVufDB8fDB8fHww?height=600&width=800"
                alt="Plant diagnosis illustration"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              <span className="text-green-600">{t("features.title1")}</span>{" "}
              {t("features.title2")}
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-600">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-green-100 rounded-full">
                <Upload className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {t("features.imageAnalysis.title")}
              </h3>
              <p className="text-gray-600">
                {t("features.imageAnalysis.description")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-green-100 rounded-full">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {t("features.treatment.title")}
              </h3>
              <p className="text-gray-600">
                {t("features.treatment.description")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-green-100 rounded-full">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {t("features.prevention.title")}
              </h3>
              <p className="text-gray-600">
                {t("features.prevention.description")}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-green-100 rounded-full">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {t("features.history.title")}
              </h3>
              <p className="text-gray-600">
                {t("features.history.description")}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-green-100 rounded-full">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {t("features.ai.title")}
              </h3>
              <p className="text-gray-600">{t("features.ai.description")}</p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 transition-all bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-green-100 rounded-full">
                <div className="flex items-center justify-center w-6 h-6 text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {t("features.responsive.title")}
              </h3>
              <p className="text-gray-600">
                {t("features.responsive.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-50">
        <div className="container px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-600">
            {t("cta.subtitle")}
          </p>
          <div className="mt-8">
            <Link href="/signup" passHref>
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                {t("cta.button")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center mb-4 space-x-2 rtl:space-x-reverse md:mb-0">
              <Leaf className="w-6 h-6 text-green-600" />
              <span className="text-lg font-bold text-green-800">
                Plants Doc
              </span>
            </div>
            <div className="flex flex-wrap justify-center space-x-6 rtl:space-x-reverse">
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-green-600"
              >
                {t("footer.about")}
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-green-600"
              >
                {t("footer.privacy")}
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-green-600"
              >
                {t("footer.terms")}
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-green-600"
              >
                {t("footer.contact")}
              </Link>
            </div>
          </div>
          <div className="pt-8 mt-8 text-center border-t border-gray-200">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Plants Doc. {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
