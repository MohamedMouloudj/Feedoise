"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createOrganization } from "@/actions/organizations";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");

  const handleCreateOrg = async () => {
    setLoading(true);
    try {
      const result = await createOrganization({ name: orgName, slug: orgSlug });
      if (result.success) {
        toast.success("Organization created!");
        router.push("/dashboard");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <div className="container max-w-md mx-auto py-16">
      <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
      <p className="text-muted-foreground mb-8">
        Create an organization to get started, or skip for now.
      </p>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Organization Name</label>
          <Input
            value={orgName}
            onChange={(e) => {
              setOrgName(e.target.value);
              // Auto-generate slug
              setOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
            }}
            placeholder="Acme Inc"
          />
        </div>

        <div>
          <label className="text-sm font-medium">URL Slug</label>
          <Input
            value={orgSlug}
            onChange={(e) => setOrgSlug(e.target.value)}
            placeholder="acme-inc"
          />
        </div>

        <Button
          onClick={handleCreateOrg}
          disabled={!orgName || !orgSlug || loading}
          className="w-full"
        >
          Create Organization
        </Button>

        <Button onClick={handleSkip} variant="ghost" className="w-full">
          Skip for now
        </Button>
      </div>
    </div>
  );
}
