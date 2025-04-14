import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted">
      <div className="grid items-center gap-8 px-4 md:px-6">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Modern HR Platform for <br className="hidden md:inline" />
            the Future of Work
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
            Streamline your HR processes with our all-in-one platform. Talent
            acquisition, employee engagement, and analytics in one seamless
            solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="aspect-video overflow-hidden rounded-xl border bg-background shadow-2xl">
            <img
              alt="Dashboard preview"
              className="object-cover"
              height="450"
              src="/placeholder.jpg"
              width="800"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
