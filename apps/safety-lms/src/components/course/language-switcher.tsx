"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface LanguageSwitcherProps {
  availableLanguages: string[];
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

const languageNames: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

const languageFlags: Record<string, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
};

export function LanguageSwitcher({
  availableLanguages,
  currentLanguage = "en",
  onLanguageChange,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLanguageChange = (language: string) => {
    // Update URL with new language parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", language);
    router.push(`${pathname}?${params.toString()}`);

    // Call optional callback
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  // Don't show switcher if only one language is available
  if (availableLanguages.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languageFlags[currentLanguage]}{" "}
            {languageNames[currentLanguage] || currentLanguage.toUpperCase()}
          </span>
          <span className="sm:hidden">
            {languageFlags[currentLanguage]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className="flex items-center justify-between gap-3 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>{languageFlags[lang]}</span>
              <span>{languageNames[lang] || lang.toUpperCase()}</span>
            </span>
            {lang === currentLanguage && (
              <Check className="h-4 w-4 text-primary-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


