import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, BookOpen, Search, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Define Course type based on simplified schema
type Course = {
  _id: Id<"courses">;
  title: string;
  description: string;
  content: string;
  category: string;
  image: string;
};

export default function Academy() {
  const navigate = useNavigate();
  const courses = useQuery(api.academy.list);
  const seedCourses = useMutation(api.academy.seed);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    seedCourses();
  }, [seedCourses]);

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center px-4 md:px-8 mx-auto justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="ml-4 font-semibold flex items-center gap-2 text-lg">
              <BookOpen className="h-6 w-6 text-primary" />
              Cyber Saffron Academy
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search articles..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-8 py-12 mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-background border border-primary/10 mb-12">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
            <div className="space-y-4">
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">Knowledge Base</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Learn About Saffron</h1>
              <p className="text-muted-foreground text-lg max-w-lg">
                Explore our library of articles covering everything from the history of saffron to blockchain verification and culinary arts.
              </p>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <img 
                  src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop" 
                  alt="Academy Hero" 
                  className="relative rounded-2xl shadow-2xl border border-border/50 w-[400px] h-[300px] object-cover rotate-3 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 && courses === undefined ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Loading content...</div>
          ) : filteredCourses.map((course) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full flex flex-col overflow-hidden hover:border-primary/50 transition-all duration-300 group cursor-pointer" onClick={() => setSelectedCourse(course)}>
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-3 right-3 bg-black/60 hover:bg-black/70 backdrop-blur-md border-none">
                    {course.category}
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm mt-1">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0 mt-auto">
                  <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Read Article
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Course Detail Dialog */}
        <Dialog open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
            {selectedCourse && (
              <>
                <div className="relative h-48 md:h-64 w-full shrink-0">
                  <img 
                    src={selectedCourse.image} 
                    alt={selectedCourse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <Badge className="mb-2">{selectedCourse.category}</Badge>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedCourse.title}</h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full"
                    onClick={() => setSelectedCourse(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <ScrollArea className="flex-1 p-6 md:p-8">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-muted-foreground mb-6 font-medium leading-relaxed">
                      {selectedCourse.description}
                    </p>
                    <div className="space-y-4 text-foreground/90 leading-relaxed whitespace-pre-line">
                      {selectedCourse.content}
                    </div>
                  </div>
                </ScrollArea>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}