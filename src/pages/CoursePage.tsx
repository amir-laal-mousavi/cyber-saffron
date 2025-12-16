import { useParams, useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Calendar, Clock, Share2, ArrowRight } from "lucide-react";
import { SaffronLoader } from "@/components/SaffronLoader";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { OptimizedImage } from "@/components/ui/optimized-image";
// @ts-ignore
import ReactMarkdown from "react-markdown";
// @ts-ignore
import remarkGfm from "remark-gfm";

export default function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = useQuery(api.academy.get, { id: id as Id<"courses"> });
  const allCourses = useQuery(api.academy.list);

  const handleShare = async () => {
    if (!course) return;
    
    const shareData = {
      title: course.title,
      text: course.description,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch (error) {
      // Fallback to clipboard if share fails or is not supported
      if ((error as Error).name !== 'AbortError') {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    }
  };

  if (course === undefined) {
    return <SaffronLoader />;
  }

  if (course === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <Button onClick={() => navigate("/academy")}>Back to Academy</Button>
      </div>
    );
  }

  const relatedCourses = allCourses?.filter(c => c._id !== id).slice(0, 2);

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-8 mx-auto justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate("/academy")} className="hover:bg-primary/10 hover:text-primary mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-bold flex items-center gap-2 text-lg tracking-tight cursor-pointer" onClick={() => navigate("/academy")}>
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="hidden sm:inline">Cyber Saffron Academy</span>
            </span>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </header>

      <main className="container px-4 md:px-8 py-8 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Image */}
          <div className="relative w-full h-[45vh] md:h-[55vh] rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-primary/5 border border-border/50 group">
            <OptimizedImage 
              src={course.image} 
              alt={course.title}
              containerClassName="w-full h-full"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90 border-none px-4 py-1.5 text-sm shadow-lg shadow-primary/20 backdrop-blur-md">
                  {course.category}
                </Badge>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight drop-shadow-sm mb-6 leading-tight">
                  {course.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-foreground/80 text-sm md:text-base font-medium">
                  <div className="flex items-center gap-2 bg-background/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <Calendar className="h-4 w-4" />
                    <span>Published recently</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <Clock className="h-4 w-4" />
                    <span>5 min read</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-medium leading-relaxed border-l-4 border-primary/50 pl-6 italic">
                  {course.description}
                </p>
                <div className="text-foreground/90 leading-relaxed">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}: any) => <h1 className="text-3xl md:text-4xl font-bold mt-16 mb-8 text-foreground scroll-m-20 tracking-tight" {...props} />,
                      h2: ({node, ...props}: any) => <h2 className="text-2xl md:text-3xl font-bold mt-14 mb-6 text-foreground border-b border-border/40 pb-4 scroll-m-20 tracking-tight flex items-center gap-3" {...props} />,
                      h3: ({node, ...props}: any) => <h3 className="text-xl md:text-2xl font-bold mt-10 mb-4 text-foreground scroll-m-20 tracking-tight" {...props} />,
                      h4: ({node, ...props}: any) => <h4 className="text-lg md:text-xl font-bold mt-8 mb-4 text-foreground scroll-m-20 tracking-tight" {...props} />,
                      p: ({node, ...props}: any) => <p className="mb-8 leading-8 text-lg text-muted-foreground/90" {...props} />,
                      ul: ({node, ...props}: any) => <ul className="list-disc list-outside mb-8 space-y-3 ml-6 text-muted-foreground/90 text-lg" {...props} />,
                      ol: ({node, ...props}: any) => <ol className="list-decimal list-outside mb-8 space-y-3 ml-6 text-muted-foreground/90 text-lg" {...props} />,
                      li: ({node, ...props}: any) => <li className="pl-2" {...props} />,
                      a: ({node, ...props}: any) => <a className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors decoration-primary/30" {...props} />,
                      strong: ({node, ...props}: any) => <strong className="font-bold text-foreground" {...props} />,
                      em: ({node, ...props}: any) => <em className="italic text-foreground/80" {...props} />,
                      blockquote: ({node, ...props}: any) => (
                        <blockquote className="border-l-4 border-primary/50 pl-8 italic my-10 py-6 bg-primary/5 rounded-r-xl text-muted-foreground shadow-sm text-lg" {...props} />
                      ),
                      code: ({node, ...props}: any) => <code className="bg-muted px-2 py-1 rounded-md text-sm font-mono text-primary border border-border/50" {...props} />,
                      pre: ({node, ...props}: any) => <pre className="mb-8 mt-8 overflow-x-auto rounded-xl border border-border/50 bg-muted/50 p-6 shadow-inner" {...props} />,
                      hr: ({node, ...props}: any) => <hr className="my-12 border-border/60" {...props} />,
                      table: ({node, ...props}: any) => <div className="my-8 w-full overflow-y-auto rounded-xl border border-border/50 shadow-sm"><table className="w-full border-collapse text-sm" {...props} /></div>,
                      thead: ({node, ...props}: any) => <thead className="bg-muted/50" {...props} />,
                      tr: ({node, ...props}: any) => <tr className="m-0 border-t border-border/50 p-0 even:bg-muted/20 hover:bg-muted/30 transition-colors" {...props} />,
                      th: ({node, ...props}: any) => <th className="border-r border-border/50 last:border-r-0 px-6 py-4 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right text-foreground" {...props} />,
                      td: ({node, ...props}: any) => <td className="border-r border-border/50 last:border-r-0 px-6 py-4 text-left [&[align=center]]:text-center [&[align=right]]:text-right text-muted-foreground" {...props} />,
                      img: ({node, ...props}: any) => <OptimizedImage containerClassName="my-12 w-full rounded-2xl shadow-2xl border border-border/50 overflow-hidden" className="w-full hover:scale-[1.02] transition-transform duration-700" {...props} />,
                    }}
                  >
                    {course.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Related Articles Section */}
              {relatedCourses && relatedCourses.length > 0 && (
                <div className="mt-16 pt-12 border-t border-border/40">
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    Related Articles
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {relatedCourses.map((related) => (
                      <Card 
                        key={related._id} 
                        className="overflow-hidden border-border/50 bg-card/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full flex flex-col"
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          navigate(`/academy/${related._id}`);
                        }}
                      >
                        <div className="aspect-video relative overflow-hidden">
                          <OptimizedImage 
                            src={related.image} 
                            alt={related.title}
                            containerClassName="w-full h-full"
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                          />
                          <Badge className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border-none text-xs">
                            {related.category}
                          </Badge>
                        </div>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                            {related.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex-grow">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {related.description}
                          </p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Read Article <ArrowRight className="h-3 w-3" />
                          </span>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-24 space-y-6">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    About this Course
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    This article is part of the Cyber Saffron Academy, dedicated to educating the world about premium saffron and blockchain technology.
                  </p>
                  <Button className="w-full group" onClick={() => navigate("/academy")}>
                    Browse More Courses
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>

                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    Share Knowledge
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    Found this article helpful? Share it with your network and help us spread the truth about premium saffron.
                  </p>
                  <Button variant="outline" className="w-full" onClick={handleShare}>
                    Share Article
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}