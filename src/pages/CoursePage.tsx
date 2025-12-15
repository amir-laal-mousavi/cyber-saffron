import { useParams, useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Calendar, Clock, Share2 } from "lucide-react";
import { SaffronLoader } from "@/components/SaffronLoader";
import { motion } from "framer-motion";
import { toast } from "sonner";
// @ts-ignore
import ReactMarkdown from "react-markdown";
// @ts-ignore
import remarkGfm from "remark-gfm";

export default function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = useQuery(api.academy.get, { id: id as Id<"courses"> });

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

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-8 mx-auto justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate("/academy")} className="hover:bg-primary/10 hover:text-primary mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-bold flex items-center gap-2 text-lg tracking-tight">
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

      <main className="container px-4 md:px-8 py-8 mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Image */}
          <div className="relative w-full h-[40vh] md:h-[50vh] rounded-3xl overflow-hidden mb-10 shadow-2xl shadow-primary/10 border border-border/50">
            <img 
              src={course.image} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
              <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90 border-none px-4 py-1.5 text-sm shadow-lg shadow-primary/20">
                {course.category}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight drop-shadow-sm mb-4 leading-tight">
                {course.title}
              </h1>
              <div className="flex items-center gap-6 text-muted-foreground text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Published recently</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-xl text-muted-foreground mb-10 font-medium leading-relaxed border-l-4 border-primary/50 pl-6 italic">
                  {course.description}
                </p>
                <div className="text-foreground/90 leading-relaxed">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}: any) => <h1 className="text-3xl font-bold mt-12 mb-6 text-primary scroll-m-20" {...props} />,
                      h2: ({node, ...props}: any) => <h2 className="text-2xl font-bold mt-10 mb-5 text-foreground border-b border-border/50 pb-2 scroll-m-20" {...props} />,
                      h3: ({node, ...props}: any) => <h3 className="text-xl font-bold mt-8 mb-4 text-foreground scroll-m-20" {...props} />,
                      p: ({node, ...props}: any) => <p className="mb-6 leading-7" {...props} />,
                      ul: ({node, ...props}: any) => <ul className="list-disc list-inside mb-6 space-y-2 ml-4" {...props} />,
                      ol: ({node, ...props}: any) => <ol className="list-decimal list-inside mb-6 space-y-2 ml-4" {...props} />,
                      li: ({node, ...props}: any) => <li className="pl-2" {...props} />,
                      strong: ({node, ...props}: any) => <strong className="font-bold text-primary/90" {...props} />,
                      em: ({node, ...props}: any) => <em className="italic text-foreground/80" {...props} />,
                      blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-primary/50 pl-6 italic my-8 py-2 bg-primary/5 rounded-r-lg text-muted-foreground" {...props} />,
                      code: ({node, ...props}: any) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...props} />,
                      img: ({node, ...props}: any) => <img className="rounded-xl shadow-lg my-8 border border-border/50 w-full" {...props} />,
                    }}
                  >
                    {course.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-24">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    About this Course
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    This article is part of the Cyber Saffron Academy, dedicated to educating the world about premium saffron and blockchain technology.
                  </p>
                  <Button className="w-full" onClick={() => navigate("/academy")}>
                    Browse More Courses
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