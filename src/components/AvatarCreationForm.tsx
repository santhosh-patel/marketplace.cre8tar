
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Zap, Palette, Mic, Globe, Gamepad2, Shield, Percent } from "lucide-react";

interface AvatarFormData {
  name: string;
  description: string;
  avatarId: string;
  modelSource: string;
  voiceSample: string;
  personalityTraits: string[];
  roleType: string;
  language: string;
  gesturePackage: string;
  nftType: string;
  royaltyPercentage: number;
  imageFile: File | null;
}

interface AvatarCreationFormProps {
  onMint: (data: AvatarFormData) => void;
  isLoading: boolean;
}

export function AvatarCreationForm({ onMint, isLoading }: AvatarCreationFormProps) {
  const [formData, setFormData] = useState<AvatarFormData>({
    name: "",
    description: "",
    avatarId: "",
    modelSource: "",
    voiceSample: "",
    personalityTraits: [],
    roleType: "",
    language: "",
    gesturePackage: "",
    nftType: "ERC-721",
    royaltyPercentage: 5,
    imageFile: null
  });

  const [newTrait, setNewTrait] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const personalityOptions = [
    "Creative", "Analytical", "Empathetic", "Humorous", "Professional", 
    "Adventurous", "Calm", "Energetic", "Wise", "Playful"
  ];

  const handleInputChange = (field: keyof AvatarFormData, value: any) => {
    console.log('Form field changed:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Image file selected:', file.name);
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addPersonalityTrait = () => {
    if (newTrait && !formData.personalityTraits.includes(newTrait)) {
      console.log('Adding personality trait:', newTrait);
      handleInputChange("personalityTraits", [...formData.personalityTraits, newTrait]);
      setNewTrait("");
    }
  };

  const removePersonalityTrait = (trait: string) => {
    console.log('Removing personality trait:', trait);
    handleInputChange("personalityTraits", formData.personalityTraits.filter(t => t !== trait));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    // Validate required fields
    const requiredFields = ['name', 'avatarId', 'modelSource', 'voiceSample', 'roleType', 'language', 'gesturePackage'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof AvatarFormData]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return;
    }
    
    if (formData.personalityTraits.length === 0) {
      console.error('No personality traits selected');
      return;
    }
    
    onMint(formData);
  };

  const isFormValid = formData.name && formData.avatarId && formData.modelSource && 
                     formData.voiceSample && formData.roleType && formData.language && 
                     formData.gesturePackage && formData.personalityTraits.length > 0;

  return (
    <Card className="glass-card-strong border-white/30">
      <CardHeader>
        <CardTitle className="text-white">Create Your Avatar NFT</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Avatar Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter avatar name"
                className="glass-input text-white placeholder:text-white/50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatarId" className="text-white">Avatar ID *</Label>
              <Input
                id="avatarId"
                value={formData.avatarId}
                onChange={(e) => handleInputChange("avatarId", e.target.value)}
                placeholder="Maya/Blender/Unreal Engine ID"
                className="glass-input text-white placeholder:text-white/50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your avatar..."
              className="glass-input text-white placeholder:text-white/50 min-h-[80px]"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-white">Avatar Image</Label>
            <div className="flex items-center gap-4">
              <div className="glass-input flex-1 p-4 border-2 border-dashed border-white/30">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-white/60 mb-2" />
                  <Label htmlFor="image" className="cursor-pointer text-white/80 hover:text-white">
                    Click to upload avatar image
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
              {imagePreview && (
                <div className="w-24 h-24 rounded-lg overflow-hidden glass-card">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Palette className="h-4 w-4" />
                3D Model Source *
              </Label>
              <Select value={formData.modelSource} onValueChange={(value) => handleInputChange("modelSource", value)}>
                <SelectTrigger className="glass-input text-white">
                  <SelectValue placeholder="Select model source" />
                </SelectTrigger>
                <SelectContent className="glass-card-strong border-white/30">
                  <SelectItem value="custom-scan">Custom 3D Scan</SelectItem>
                  <SelectItem value="ai-generated">AI Generated</SelectItem>
                  <SelectItem value="pre-built">Pre-built Template</SelectItem>
                  <SelectItem value="maya">Maya Model</SelectItem>
                  <SelectItem value="blender">Blender Model</SelectItem>
                  <SelectItem value="unreal">Unreal Engine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Voice Sample *
              </Label>
              <Select value={formData.voiceSample} onValueChange={(value) => handleInputChange("voiceSample", value)}>
                <SelectTrigger className="glass-input text-white">
                  <SelectValue placeholder="Select voice type" />
                </SelectTrigger>
                <SelectContent className="glass-card-strong border-white/30">
                  <SelectItem value="synthetic">Synthetic Voice</SelectItem>
                  <SelectItem value="cloned">Voice Clone</SelectItem>
                  <SelectItem value="celebrity">Celebrity Voice</SelectItem>
                  <SelectItem value="custom">Custom Recording</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Role Type *
              </Label>
              <Select value={formData.roleType} onValueChange={(value) => handleInputChange("roleType", value)}>
                <SelectTrigger className="glass-input text-white">
                  <SelectValue placeholder="Select role type" />
                </SelectTrigger>
                <SelectContent className="glass-card-strong border-white/30">
                  <SelectItem value="influencer">Influencer</SelectItem>
                  <SelectItem value="educator">Educator</SelectItem>
                  <SelectItem value="entertainer">Entertainer</SelectItem>
                  <SelectItem value="therapist">Therapist</SelectItem>
                  <SelectItem value="companion">Companion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Language Support *
              </Label>
              <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                <SelectTrigger className="glass-input text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="glass-card-strong border-white/30">
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="mandarin">Mandarin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              Gesture Package *
            </Label>
            <Select value={formData.gesturePackage} onValueChange={(value) => handleInputChange("gesturePackage", value)}>
              <SelectTrigger className="glass-input text-white">
                <SelectValue placeholder="Select gesture package" />
              </SelectTrigger>
              <SelectContent className="glass-card-strong border-white/30">
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NFT Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Shield className="h-4 w-4" />
                NFT Type
              </Label>
              <Select value={formData.nftType} onValueChange={(value) => handleInputChange("nftType", value)}>
                <SelectTrigger className="glass-input text-white">
                  <SelectValue placeholder="Select NFT type" />
                </SelectTrigger>
                <SelectContent className="glass-card-strong border-white/30">
                  <SelectItem value="ERC-721">ERC-721</SelectItem>
                  <SelectItem value="ERC-1155">ERC-1155</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Royalty Percentage (2-10%)
              </Label>
              <Input
                type="number"
                value={formData.royaltyPercentage.toString()}
                onChange={(e) => {
                  const value = Math.max(2, Math.min(10, parseInt(e.target.value) || 2));
                  handleInputChange("royaltyPercentage", value);
                }}
                placeholder="Enter royalty %"
                className="glass-input text-white placeholder:text-white/50"
                min="2"
                max="10"
              />
            </div>
          </div>

          {/* Personality Traits */}
          <div className="space-y-2">
            <Label className="text-white">Personality Traits *</Label>
            <div className="flex flex-wrap gap-2">
              {formData.personalityTraits.map(trait => (
                <Badge key={trait} variant="secondary" className="glass-input text-white border-white/30 flex items-center gap-1">
                  {trait}
                  <Button type="button" variant="ghost" size="icon" onClick={() => removePersonalityTrait(trait)} className="text-red-400 hover:bg-red-400/20 h-4 w-4 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={newTrait}
                onChange={(e) => setNewTrait(e.target.value)}
                placeholder="Enter trait"
                className="glass-input text-white placeholder:text-white/50"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addPersonalityTrait();
                  }
                }}
              />
              <Button type="button" onClick={addPersonalityTrait} className="glass-button text-white border-white/30">
                Add Trait
              </Button>
            </div>
            <div className="mt-1 text-sm text-white/60">
              Choose at least one personality trait for your avatar.
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full glass-button text-white border-white/30 hover:bg-white/25"
          >
            {isLoading ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-spin" />
                Minting Avatar...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Mint Avatar NFT
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
