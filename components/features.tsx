import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Icons } from "@/components/icons";

const features = [
  {
    title: "Talent Acquisition",
    description:
      "Streamline your hiring process with AI-powered candidate matching and automated workflows.",
    icon: "users",
  },
  {
    title: "Employee Engagement",
    description:
      "Boost productivity and retention with our engagement tools and pulse surveys.",
    icon: "heart",
  },
  {
    title: "Performance Management",
    description:
      "Continuous feedback and goal tracking to drive employee development.",
    icon: "barChart",
  },
  {
    title: "People Analytics",
    description:
      "Data-driven insights to make better HR decisions and predict trends.",
    icon: "lineChart",
  },
  {
    title: "Learning & Development",
    description: "Personalized learning paths to upskill your workforce.",
    icon: "book",
  },
  {
    title: "Workforce Planning",
    description: "Forecast and plan your workforce needs with precision.",
    icon: "calendar",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-muted">
      <div className="px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center space-y-6 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything You Need in One Platform
          </h2>
          <p className="text-muted-foreground">
            Our modular design allows you to customize the platform to your
            exact HR needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    {/* {Icons[feature.icon as keyof typeof Icons]({
                      className: "h-6 w-6 text-primary",
                    })} */}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
