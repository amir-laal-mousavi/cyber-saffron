import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, GraduationCap, PlayCircle, Clock, Star, CheckCircle2, Lock, ChevronRight, Trophy, Search, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Define Course type based on schema
type Course = {
  _id: Id<"courses">;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  rating: number;
  students: number;
  image: string;
  modules: {
    title: string;
    duration: string;
    type: string;
  }[];
};

export default function Academy() {
  const navigate = useNavigate();
  const courses = useQuery(api.academy.list);
  const seedCourses = useMutation(api.academy.seed);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    seedCourses();
  }, [seedCourses]);

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || course.level.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
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
              <GraduationCap className="h-6 w-6 text-primary" />
              Cyber Saffron Academy
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search courses..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">My Learning</Button>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-8 py-12 mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-background border border-primary/10 mb-12">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
            <div className="space-y-4">
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">New Certification</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Become a Certified Saffron Expert</h1>
              <p className="text-muted-foreground text-lg max-w-lg">
                Complete our comprehensive curriculum to earn your blockchain-verified certificate and unlock higher commission tiers.
              </p>
              <div className="flex gap-4 pt-4">
                <Button size="lg" className="gap-2">
                  Start Learning <ChevronRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  View Certificates <Trophy className="h-4 w-4" />
                </Button>
              </div>
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

        {/* Course Filters */}
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Available Courses
            </h2>
            <TabsList>
              <TabsTrigger value="all">All Levels</TabsTrigger>
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length === 0 && courses === undefined ? (
                 // Loading skeletons could go here, for now just empty or loading text
                 <div className="col-span-full text-center py-12 text-muted-foreground">Loading courses...</div>
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
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
                          <PlayCircle className="h-6 w-6" />
                        </Button>
                      </div>
                      <Badge className="absolute top-3 right-3 bg-black/60 hover:bg-black/70 backdrop-blur-md border-none">
                        {course.category}
                      </Badge>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs font-normal">{course.level}</Badge>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                          <Star className="h-3 w-3 fill-current" />
                          {course.rating}
                        </div>
                      </div>
                      <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-sm mt-1">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3 flex-1">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {course.modules.length} Modules
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.students.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Course
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Course Detail Dialog */}
        <Dialog open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
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
                    <div className="flex items-center gap-4 text-white/80 text-sm mt-2">
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {selectedCourse.duration}</span>
                      <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {selectedCourse.rating}</span>
                      <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" /> {selectedCourse.level}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full"
                    onClick={() => setSelectedCourse(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </div>

                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">About this course</h3>
                      <p className="text-muted-foreground">{selectedCourse.description}</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Course Curriculum</h3>
                        <span className="text-sm text-muted-foreground">{selectedCourse.modules.length} modules</span>
                      </div>
                      
                      <div className="border rounded-lg divide-y">
                        {selectedCourse.modules.map((module, index) => (
                          <div key={index} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium group-hover:text-primary transition-colors">{module.title}</p>
                                <p className="text-xs text-muted-foreground capitalize">{module.type} • {module.duration}</p>
                              </div>
                            </div>
                            {index === 0 ? (
                              <Button size="sm" variant="ghost" className="text-primary">
                                <PlayCircle className="h-4 w-4 mr-2" /> Start
                              </Button>
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground/50" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        Certificate of Completion
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Complete all modules and pass the final assessment to receive your blockchain-verified certificate.
                      </p>
                      <Progress value={0} className="h-2" />
                      <p className="text-xs text-right mt-1 text-muted-foreground">0% Complete</p>
                    </div>
                  </div>
                </ScrollArea>

                <div className="p-4 border-t bg-background shrink-0 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedCourse(null)}>Close</Button>
                  <Button className="w-full sm:w-auto">Enroll Now</Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}