import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Grid, List } from "lucide-react";
import { PluginDetailsDialog } from "@/components/PluginDetailsDialog";

const pluginCategories = [
  { 
    name: "Science Education Teacher", 
    description: "Explain scientific concepts with empathy and curiosity",
    icon: "science",
    price: 250 
  },
  { 
    name: "Advertiser Plugin", 
    description: "Craft persuasive and emotionally resonant ads",
    icon: "megaphone", 
    price: 300 
  },
  { 
    name: "News Reader Plugin", 
    description: "Present news with emotional depth and awareness",
    icon: "newspaper", 
    price: 275 
  },
  { 
    name: "Programming Assistant", 
    description: "Provide coding help with moral support",
    icon: "code", 
    price: 350 
  },
  { 
    name: "Yoga Instructor", 
    description: "Personalized yoga guidance with stress-aware tone",
    icon: "yoga", 
    price: 225 
  },
  { 
    name: "Fitness Trainer Plugin", 
    description: "Motivational coaching with progress tracking",
    icon: "fitness", 
    price: 275 
  },
  { 
    name: "Singing Coach", 
    description: "Learn vocal techniques with confidence-boosting duets",
    icon: "mic", 
    price: 300 
  },
  { 
    name: "Medical Assistant", 
    description: "Health tracking with empathetic support",
    icon: "medkit", 
    price: 400 
  },
  { 
    name: "Creative Writer Plugin", 
    description: "Story and essay writing with emotional intelligence",
    icon: "pencil", 
    price: 250 
  },
  { 
    name: "Multilingual Communicator", 
    description: "Communicate across languages with cultural empathy",
    icon: "globe", 
    price: 450 
  }
];

const Marketplace = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlugin, setSelectedPlugin] = useState<null | typeof pluginCategories[0]>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredPlugins = pluginCategories.filter(plugin => 
    plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (plugin: typeof pluginCategories[0]) => {
    setSelectedPlugin(plugin);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-8 bg-primary/5">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">
                Plugin <span className="gradient-text">Marketplace</span>
              </h1>
              <p className="text-muted-foreground">
                Enhance your avatar's emotional intelligence with specialized plugins.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-8">
          <div className="container">
            <Tabs defaultValue="discover" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <TabsList>
                  <TabsTrigger value="discover">Discover</TabsTrigger>
                  <TabsTrigger value="my-plugins">My Plugins</TabsTrigger>
                  <TabsTrigger value="create">Create Plugin</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewMode("grid")}>
                      <Grid className={`h-5 w-5 ${viewMode === "grid" ? "text-primary" : "text-muted-foreground"}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setViewMode("list")}>
                      <List className={`h-5 w-5 ${viewMode === "list" ? "text-primary" : "text-muted-foreground"}`} />
                    </Button>
                  </div>
                  
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-8" 
                      placeholder="Search plugins..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <TabsContent value="discover">
                <div className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"} gap-6`}>
                  {filteredPlugins.map((plugin, index) => (
                    <Card 
                      key={index} 
                      className="bg-card/50 backdrop-filter backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all"
                    >
                      <CardHeader className={viewMode === "list" ? "flex flex-row items-center justify-between" : ""}>
                        <div>
                          <CardTitle>{plugin.name}</CardTitle>
                          <CardDescription>{plugin.description}</CardDescription>
                        </div>
                        {viewMode === "list" && (
                          <Button onClick={() => handleViewDetails(plugin)}>View Details</Button>
                        )}
                      </CardHeader>
                      {viewMode === "grid" && (
                        <>
                          <CardContent>
                            <div className="aspect-square rounded-md bg-gradient-to-br from-rohum-blue/20 to-rohum-pink/20 flex items-center justify-center">
                              <span className="text-2xl font-bold gradient-text">#{index + 1}</span>
                            </div>
                            <div className="mt-4">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Category</span>
                                <span className="text-xs font-medium capitalize">{plugin.name}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <span className="font-semibold">{plugin.price} $C8R</span>
                            <Button variant="outline" onClick={() => handleViewDetails(plugin)}>View Details</Button>
                          </CardFooter>
                        </>
                      )}
                    </Card>
                  ))}
                </div>
                {filteredPlugins.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    No plugins match your search criteria.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="my-plugins">
                <div className="text-center py-16">
                  <p className="text-muted-foreground">
                    Connect your wallet to view your plugins.
                  </p>
                  <Button className="mt-4">Connect Wallet</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="create">
                <div className="text-center py-16">
                  <p className="text-muted-foreground">
                    Coming soon! Developer tools for creating and minting new plugins.
                  </p>
                  <Button className="mt-4" disabled>Get Notified</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      {selectedPlugin && (
        <PluginDetailsDialog 
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          plugin={selectedPlugin}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Marketplace;
