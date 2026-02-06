import Image from "next/image";
import AppButton from "@/components/AppButton";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <Image
          src="/not-found.svg"
          alt="404 Not Found"
          width={256}
          height={256}
          className="mx-auto mb-8"
          priority
        />

        <h1 className="mb-2 text-4xl font-bold">Page Not Found</h1>
        <p className="mb-8 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <AppButton href="/" size="lg">
            Go Home
          </AppButton>
          <AppButton href="/projects" type="secondary" size="lg">
            Browse community projects
          </AppButton>
        </div>
      </div>
    </div>
  );
}
