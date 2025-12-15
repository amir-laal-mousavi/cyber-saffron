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
import { OptimizedImage } from "@/components/ui/optimized-image";
// @ts-ignore
import ReactMarkdown from "react-markdown";
// @ts-ignore
import remarkGfm from "remark-gfm";

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
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-8 mx-auto justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="hover:bg-primary/10 hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="ml-4 font-bold flex items-center gap-2 text-lg tracking-tight">
              <BookOpen className="h-6 w-6 text-primary" />
              Cyber Saffron Academy
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="relative w-72 group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <Input 
                placeholder="Search articles..." 
                className="pl-10 bg-secondary/50 border-transparent focus:border-primary/50 focus:bg-background transition-all duration-300" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 md:px-8 py-12 mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden mb-16 border border-primary/20 shadow-2xl shadow-primary/5 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background z-0" />
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 p-10 md:p-16 items-center">
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-4 py-1.5 text-sm backdrop-blur-sm">
                Knowledge Base
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                The Art & Science of Saffron
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-lg leading-relaxed">
                Explore our curated library covering everything from ancient history to blockchain verification and modern culinary arts.
              </p>
            </div>
            <div className="hidden md:flex justify-center perspective-1000">
              <div className="relative group-hover:scale-105 transition-transform duration-700 ease-out">
                <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-pulse" />
                <img 
                  src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop" 
                  alt="Academy Hero" 
                  className="relative rounded-2xl shadow-2xl border border-border/50 w-[450px] h-[320px] object-cover rotate-3 group-hover:rotate-1 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length === 0 && courses === undefined ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p>Loading knowledge base...</p>
              </div>
          ) : filteredCourses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card 
                className="h-full flex flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 group cursor-pointer" 
                onClick={() => navigate(`/academy/${course._id}`)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                  <OptimizedImage 
                    src={course.image} 
                    alt={course.title}
                    containerClassName="w-full h-full"
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <Badge className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-md border-none text-xs font-medium tracking-wide z-20">
                    {course.category}
                  </Badge>
                </div>
                <CardHeader className="pb-4 space-y-2">
                  <CardTitle className="line-clamp-1 text-xl group-hover:text-primary transition-colors duration-300">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0 mt-auto pb-6 px-6">
                  <Button 
                    variant="secondary" 
                    className="w-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 group-hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/academy/${course._id}`);
                    }}
                  >
                    Read Article
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}