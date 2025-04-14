import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-purple-600">
      <div className=" px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
            Ready to Transform Your HR Operations?
          </h2>
          <p className="text-primary-foreground/90">
            Join thousands of companies who trust TalentSync for their HR needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10"
            >
              Request Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
