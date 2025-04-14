import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "HR Director, TechCorp",
    content:
      "TalentSync has transformed our HR operations. The analytics dashboard alone has saved us countless hours of manual reporting.",
    avatar: "/avatars/01.png",
  },
  {
    name: "Michael Chen",
    role: "VP People, StartUp Inc",
    content:
      "The customizable workflows allowed us to tailor the platform exactly to our needs. Our onboarding time decreased by 40%.",
    avatar: "/avatars/02.png",
  },
  {
    name: "Emma Rodriguez",
    role: "Chief People Officer, Global Enterprises",
    content:
      "From recruitment to retirement, TalentSync covers all our HR needs with a beautiful, intuitive interface.",
    avatar: "/avatars/03.png",
  },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center space-y-6 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Trusted by HR Teams Worldwide
          </h2>
          <p className="text-muted-foreground">
            Join thousands of companies who have transformed their HR
            operations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <p className="italic mb-6">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
