"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createOrganization } from "@/actions/organizations.action";
import { updateUserLanguage } from "@/actions/auth.action";
import AppButton from "@/components/AppButton";
import { Logo } from "@/components/Logo";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LANGUAGES } from "@/config/static-data";
import {
  organizationSchema,
  type OrganizationFormData,
} from "@/schemas/organization.schema";
import {
  languageSchema,
  type LanguageFormData,
} from "@/schemas/onboarding.schema";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [_hasOrganization, setHasOrganization] = useState<boolean | null>(null);

  const {
    control: orgControl,
    handleSubmit: handleOrgSubmit,
    setValue: setOrgValue,
    getValues: getOrgValues,
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const { control: langControl, handleSubmit: handleLangSubmit } =
    useForm<LanguageFormData>({
      resolver: zodResolver(languageSchema),
      defaultValues: {
        language: "en",
      },
    });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleCreateOrg = async (data: OrganizationFormData) => {
    setLoading(true);
    try {
      const result = await createOrganization({
        name: data.name,
        slug: data.slug,
      });
      if (result.success) {
        toast.success("Organization created!");
        setHasOrganization(true);
        setStep(3);
      } else {
        toast.error(result.error);
      }
    } catch (_error) {
      toast.error("Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  const handleSkipOrg = () => {
    setHasOrganization(false);
    setStep(3);
  };

  const handleSetLanguage = async (data: LanguageFormData) => {
    setLoading(true);
    try {
      const result = await updateUserLanguage(data.language);
      if (result.success) {
        toast.success("Welcome to Feedoise!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update language");
      }
    } catch (_error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Logo className="mx-auto mb-6" size="lg" />
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant={step >= 1 ? "default" : "secondary"}>1</Badge>
            <div className="h-px w-12 bg-border"></div>
            <Badge variant={step >= 2 ? "default" : "secondary"}>2</Badge>
            <div className="h-px w-12 bg-border"></div>
            <Badge variant={step >= 3 ? "default" : "secondary"}>3</Badge>
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6 text-center animate-in fade-in duration-500">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Welcome to Feedoise! 🎉</h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Let&apos;s get you set up. It only takes a minute to get started
                with your multilingual feedback management platform.
              </p>
            </div>
            <div className="flex flex-col gap-3 max-w-sm mx-auto pt-4">
              <AppButton
                type="primary"
                size="lg"
                onClick={() => setStep(2)}
                className="w-full"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </AppButton>
            </div>
          </div>
        )}

        {/* Step 2: Create Organization */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Create your organization</h1>
              <p className="text-muted-foreground">
                Organizations help you manage multiple projects and teams. You
                can skip this for now.
              </p>
            </div>

            <form
              onSubmit={handleOrgSubmit(handleCreateOrg)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Controller
                  name="name"
                  control={orgControl}
                  render={({ field, fieldState }) => (
                    <div className="space-y-1">
                      <Input
                        {...field}
                        id="name"
                        placeholder="Acme Inc"
                        onChange={(e) => {
                          field.onChange(e);
                          const currentSlug = getOrgValues("slug");
                          const previousSlug = generateSlug(field.value);

                          if (!currentSlug || currentSlug === previousSlug) {
                            setOrgValue("slug", generateSlug(e.target.value));
                          }
                        }}
                      />
                      {fieldState.error && (
                        <p className="text-sm text-destructive">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Controller
                  name="slug"
                  control={orgControl}
                  render={({ field, fieldState }) => (
                    <div className="space-y-1">
                      <Input
                        {...field}
                        id="slug"
                        placeholder="acme-inc"
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase();
                          field.onChange(value);
                        }}
                      />
                      {fieldState.error && (
                        <p className="text-sm text-destructive">
                          {fieldState.error.message}
                        </p>
                      )}
                      {!fieldState.error && field.value && (
                        <p className="text-sm text-muted-foreground">
                          Your organization will be available at: /{field.value}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <AppButton
                  type="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </AppButton>
                <AppButton
                  type="ghost"
                  onClick={handleSkipOrg}
                  disabled={loading}
                  className="flex-1"
                >
                  Skip for now
                </AppButton>
                <AppButton
                  type="primary-submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Creating..." : "Create"}
                </AppButton>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Set Language */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Choose your language</h1>
              <p className="text-muted-foreground">
                Select your preferred language for the interface. You can change
                this later in settings.
              </p>
            </div>

            <form
              onSubmit={handleLangSubmit(handleSetLanguage)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Controller
                  name="language"
                  control={langControl}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <AppButton
                  type="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </AppButton>
                <AppButton
                  type="primary-submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Completing..." : "Complete Setup"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </AppButton>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
