import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    title: "Essential",
    price: "$29",
    period: "per user/month",
    description: "Perfect for small teams getting started with HR automation.",
    features: [
      "Core HR management",
      "Basic recruitment tools",
      "Employee self-service",
      "Standard reporting",
    ],
    cta: "Get Started",
  },
  {
    title: "Professional",
    price: "$59",
    period: "per user/month",
    description: "For growing businesses needing advanced HR capabilities.",
    features: [
      "Everything in Essential",
      "Advanced analytics",
      "Performance management",
      "Learning management",
      "Custom workflows",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    title: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with complex HR needs.",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "Premium support",
    ],
    cta: "Contact Sales",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-muted">
      <div className="px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center space-y-6 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground">
            Choose the plan that fits your needs. Scale up or down as required.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`hover:shadow-lg transition-shadow ${
                plan.popular ? "border-2 border-primary" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.title}</CardTitle>
                <div className="flex items-end space-x-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
