
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff } from "lucide-react";

const Companion = () => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    console.log("Message sent:", message);
    setMessage("");
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col">
        <section className="py-8 bg-primary/5">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">
                Your AI <span className="gradient-text">Companion</span>
              </h1>
              <p className="text-muted-foreground">
                Chat with your emotionally intelligent avatar and earn $C8R tokens through journaling.
              </p>
            </div>
          </div>
        </section>
        
        <section className="flex-grow py-8">
          <div className="container h-full">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
              <div className="lg:col-span-1">
                <div className="bg-card/50 backdrop-filter backdrop-blur-sm border border-border/50 rounded-lg p-4 h-full">
                  <h3 className="font-medium mb-4">Your Avatars</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your wallet to view your avatars.
                  </p>
                </div>
              </div>
              
              <div className="lg:col-span-3 flex flex-col h-full">
                <div className="bg-card/50 backdrop-filter backdrop-blur-sm border border-border/50 rounded-lg p-4 flex-grow mb-4 min-h-[400px]">
                  <div className="flex items-center mb-4 pb-4 border-b">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rohum-blue to-rohum-pink"></div>
                    <div className="ml-3">
                      <h4 className="font-medium">Default Avatar</h4>
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                  </div>
                  
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <p className="text-muted-foreground mb-4">
                        Connect your wallet or mint an avatar to start chatting with your AI companion.
                      </p>
                      <Button>Connect Wallet</Button>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={toggleRecording}
                    className={isRecording ? "bg-rohum-pink/10 text-rohum-pink" : ""}
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Companion;
