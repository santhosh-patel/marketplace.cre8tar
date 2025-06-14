
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";
import { ArrowRight } from "lucide-react";
import Orb from "./Orb";

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Lightning background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted"></div>
        <div className="absolute inset-0 opacity-20">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="lightning1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="lightning2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            
            {/* Lightning bolt 1 */}
            <path
              d="M200 100 L180 300 L220 300 L180 600 L300 350 L250 350 L290 200 Z"
              fill="url(#lightning1)"
              className="animate-pulse"
              style={{ animationDuration: '3s', animationDelay: '0s' }}
            />
            
            {/* Lightning bolt 2 */}
            <path
              d="M700 150 L680 350 L720 350 L680 650 L800 400 L750 400 L790 250 Z"
              fill="url(#lightning2)"
              className="animate-pulse"
              style={{ animationDuration: '2.5s', animationDelay: '1s' }}
            />
            
            {/* Lightning bolt 3 */}
            <path
              d="M450 50 L430 250 L470 250 L430 550 L550 300 L500 300 L540 150 Z"
              fill="url(#lightning1)"
              className="animate-pulse"
              style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}
            />
            
            {/* Additional scattered lightning effects */}
            <circle cx="150" cy="200" r="3" fill="#3b82f6" className="animate-ping" style={{ animationDuration: '2s' }} />
            <circle cx="850" cy="300" r="2" fill="#ec4899" className="animate-ping" style={{ animationDuration: '2.2s', animationDelay: '0.8s' }} />
            <circle cx="300" cy="100" r="2.5" fill="#8b5cf6" className="animate-ping" style={{ animationDuration: '1.8s', animationDelay: '1.2s' }} />
            <circle cx="600" cy="450" r="3" fill="#3b82f6" className="animate-ping" style={{ animationDuration: '2.4s', animationDelay: '0.3s' }} />
            <circle cx="750" cy="150" r="2" fill="#ec4899" className="animate-ping" style={{ animationDuration: '2.1s', animationDelay: '1.5s' }} />
          </svg>
        </div>
      </div>

      {/* Background glow effect */}
      <div className="absolute inset-0 bg-glow-gradient z-0"></div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6 max-w-xl">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 w-fit">
              <span className="animate-pulse-glow w-3 h-3 rounded-full bg-CRE8TAR-blue"></span>
              <span className="text-sm font-medium">Emotionally Intelligent NFT Avatars</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Your own avatar <span className="gradient-text">as an NFT</span>
            </h1>

            <p className="text-lg text-muted-foreground">
              Create, train, and evolve your digital companion with emotional intelligence.
              Mint unique NFT avatars that learn and grow with you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <WalletConnect />
              <Button
                variant="outline"
                className="group"
              >
                Buy $CRE8TAR
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square max-w-md mx-auto">
              <Orb
                hoverIntensity={0.5}
                rotateOnHover={true}
                hue={0}
                forceHoverState={false}
              />
            </div>
            <div className="absolute inset-0 animate-float">
              <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-CRE8TAR-blue/20 to-CRE8TAR-pink/20 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
