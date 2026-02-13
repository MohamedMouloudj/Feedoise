import { Globe } from "@/components/ui/globe";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import AppButton from "@/components/AppButton";
import Lenis from "@/components/Lenis";
import Features from "@/components/pages/Home/Features";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Lenis />
      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background">
        <FlickeringGrid
          className="absolute inset-0 z-0"
          squareSize={4}
          gridGap={6}
          color="rgba(0, 0, 0, 0.6)"
          maxOpacity={0.3}
          flickerChance={0.3}
        />
        <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col gap-6 text-center lg:text-start">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Feedback without language barriers
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Collect feedback in any language. Users submit in their native
                language, you read it in yours. Powered by AI translation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <AppButton size="lg" className="cursor-pointer" href="/signup">
                  Get Started Free
                </AppButton>
                <AppButton size="lg" type="outline" href="/projects">
                  Browse Projects
                </AppButton>
              </div>
            </div>
            <div className="relative h-100 lg:h-125">
              <Globe />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Built for global teams
          </h2>
          <Features />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join teams around the world using Feedoise to collect and manage
            feedback across languages.
          </p>
          <AppButton size="lg" href="/signup">
            Create Your Organization
          </AppButton>
        </div>
      </section>
      <Lenis />
    </div>
  );
}
