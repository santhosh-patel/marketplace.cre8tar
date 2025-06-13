
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Palette, Mic, Globe, Gamepad2, Shield, Percent, Plus, X } from "lucide-react";

interface Plugin {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  type: string;
  purchasedAt: Date;
}

interface NFTDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nft: {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
    avatar_id?: string;
    model_source: string;
    voice_sample: string;
    role_type: string;
    language: string;
    gesture_package: string;
    nft_type: string;
    royalty_percentage: number;
    personality_traits: string[];
  };
  userPlugins: Plugin[];
  onAddPlugin: (nftId: string, pluginId: string) => void;
}

export function NFTDetailsDialog({ 
  open, 
  onOpenChange, 
  nft, 
  userPlugins,
  onAddPlugin 
}: NFTDetailsDialogProps) {
  const [selectedPlugin, setSelectedPlugin] = useState("");
  const [linkedPlugins, setLinkedPlugins] = useState<Plugin[]>([]);

  const handleAddPlugin = () => {
    if (selectedPlugin) {
      const plugin = userPlugins.find(p => p.id === selectedPlugin);
      if (plugin && !linkedPlugins.find(p => p.id === plugin.id)) {
        setLinkedPlugins(prev => [...prev, plugin]);
        onAddPlugin(nft.id, selectedPlugin);
        setSelectedPlugin("");
      }
    }
  };

  const removePlugin = (pluginId: string) => {
    setLinkedPlugins(prev => prev.filter(p => p.id !== pluginId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto glass-card-strong border-white/30">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">{nft.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* NFT Image and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden glass-card">
                {nft.image_url ? (
                  <img 
                    src={nft.image_url} 
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                )  : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-16 h-16 text-white/40" />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="glass-card p-3">
                  <p className="text-white/70">NFT ID</p>
                  <p className="text-white font-mono">{nft.id.slice(0, 8)}...</p>
                </div>
                <div className="glass-card p-3">
                  <p className="text-white/70">Avatar ID</p>
                  <p className="text-white font-mono">{nft.avatar_id || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="glass-card border-white/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="text-white/70 text-sm">3D Model Source</p>
                      <p className="text-white">{nft.model_source}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-green-400" />
                    <div>
                      <p className="text-white/70 text-sm">Voice Sample</p>
                      <p className="text-white">{nft.voice_sample}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-purple-400" />
                    <div>
                      <p className="text-white/70 text-sm">Role Type</p>
                      <p className="text-white">{nft.role_type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-orange-400" />
                    <div>
                      <p className="text-white/70 text-sm">Language Support</p>
                      <p className="text-white">{nft.language}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-pink-400" />
                    <div>
                      <p className="text-white/70 text-sm">Gesture Package</p>
                      <p className="text-white">{nft.gesture_package}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-indigo-400" />
                    <div>
                      <p className="text-white/70 text-sm">NFT Type</p>
                      <p className="text-white">{nft.nft_type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-yellow-400" />
                    <div>
                      <p className="text-white/70 text-sm">Royalty Percentage</p>
                      <p className="text-white">{nft.royalty_percentage}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Description */}
          {nft.description && (
            <Card className="glass-card border-white/20">
              <CardContent className="pt-6">
                <h3 className="text-white font-semibold mb-2">Description</h3>
                <p className="text-white/80">{nft.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Personality Traits */}
          <Card className="glass-card border-white/20">
            <CardContent className="pt-6">
              <h3 className="text-white font-semibold mb-3">Personality Traits</h3>
              <div className="flex flex-wrap gap-2">
                {nft.personality_traits?.map((trait) => (
                  <Badge key={trait} variant="secondary" className="glass-input text-white border-white/30">
                    {trait}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Linked Plugins */}
          <Card className="glass-card border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Linked Plugins</h3>
                {userPlugins.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Select value={selectedPlugin} onValueChange={setSelectedPlugin}>
                      <SelectTrigger className="w-48 glass-input text-white">
                        <SelectValue placeholder="Select plugin" />
                      </SelectTrigger>
                      <SelectContent className="glass-card-strong border-white/30">
                        {userPlugins.map((plugin) => (
                          <SelectItem key={plugin.id} value={plugin.id}>
                            {plugin.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleAddPlugin}
                      disabled={!selectedPlugin}
                      size="sm"
                      className="glass-button text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {linkedPlugins.length > 0 ? (
                  linkedPlugins.map((plugin) => (
                    <div key={plugin.id} className="flex items-center justify-between p-3 glass-input rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full glass-card flex items-center justify-center">
                          <span className="text-xs text-white">{plugin.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{plugin.name}</p>
                          <p className="text-white/60 text-sm">{plugin.type}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => removePlugin(plugin.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-400/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60 text-center py-4">
                    {userPlugins.length === 0 
                      ? "No plugins purchased yet. Visit the marketplace to buy plugins."
                      : "No plugins linked to this avatar yet."
                    }
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
