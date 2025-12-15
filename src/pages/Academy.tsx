import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, GraduationCap, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function Academy() {
  const navigate = useNavigate();

  const courses = [
    {
      title: "Saffron 101: The Red Gold",
      description: "Learn the history, cultivation, and grading of premium saffron.",
      level: "Beginner",
      duration: "15 min",
      image: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Blockchain Verification",
      description: "Understanding how we use blockchain to guarantee provenance.",
      level: "Intermediate",
      duration: "25 min",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Agent Success Masterclass",
      description: "Strategies to grow your network and maximize commissions.",
      level: "Advanced",
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center px-4 md:px-8 mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="ml-4 font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Cyber Saffron Academy
          </span>
        </div>
      </header>

      <main className="container px-4 md:px-8 py-12 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Learn & Earn</h1>
          <p className="text-muted-foreground text-lg">
            Master the art of saffron and blockchain technology. Enhance your skills to become a top-tier agent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card key={index} className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{course.level}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {course.duration}
                  </span>
                </div>
                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">Start Learning</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
