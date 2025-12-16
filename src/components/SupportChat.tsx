import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Minimize2, User, Headphones } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize session ID for anonymous users
  useEffect(() => {
    let storedSession = localStorage.getItem("support_session_id");
    if (!storedSession) {
      storedSession = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("support_session_id", storedSession);
    }
    setSessionId(storedSession);
  }, []);

  const activeTicket = useQuery(api.support.getActiveTicket, { sessionId });
  const messages = useQuery(api.support.getMessages, { ticketId: activeTicket?._id });
  
  const createTicket = useMutation(api.support.createTicket);
  const sendMessage = useMutation(api.support.sendMessage);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      let ticketId = activeTicket?._id;
      
      if (!ticketId) {
        ticketId = await createTicket({ sessionId });
      }

      if (ticketId) {
        await sendMessage({
          ticketId,
          content: message,
          sender: "user",
        });
        setMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[350px] sm:w-[380px] shadow-2xl rounded-2xl overflow-hidden border border-border/50"
          >
            <Card className="border-0 h-[500px] flex flex-col bg-background/95 backdrop-blur-xl">
              <CardHeader className="bg-primary/5 border-b border-border/50 p-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Headphones className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Support Team</CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      Online
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 p-0 overflow-hidden relative">
                <ScrollArea className="h-full p-4">
                  <div className="flex flex-col gap-4 pb-4">
                    {!activeTicket && messages?.length === 0 && (
                      <div className="text-center text-muted-foreground text-sm py-8 px-4">
                        <p>Welcome to Cyber Saffron!</p>
                        <p className="mt-2">Send us a message and we'll get back to you shortly.</p>
                      </div>
                    )}
                    
                    {messages?.map((msg) => (
                      <div
                        key={msg._id}
                        className={cn(
                          "flex w-max max-w-[80%] flex-col gap-1 rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                          msg.sender === "user"
                            ? "ml-auto bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted text-foreground rounded-bl-none"
                        )}
                      >
                        <p>{msg.content}</p>
                        <span className={cn(
                          "text-[10px] opacity-70",
                          msg.sender === "user" ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-3 bg-muted/20 border-t border-border/50">
                <div className="flex w-full items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 bg-background border-border/50 focus-visible:ring-primary/20"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSend} 
                    disabled={!message.trim()}
                    className="h-10 w-10 shrink-0 rounded-full shadow-md"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          className={cn(
            "h-14 w-14 rounded-full shadow-xl border-2 border-white/10 transition-all duration-300",
            isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </motion.div>
    </div>
  );
}
