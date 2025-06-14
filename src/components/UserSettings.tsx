
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Camera, Save, Key } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface UserSettingsProps {
  profile: any;
  onProfileUpdate: () => void;
}

export function UserSettings({ profile, onProfileUpdate }: UserSettingsProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    profilePicture: null as File | null
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let avatarUrl = profile?.avatar_url;

      // Upload profile picture if provided
      if (formData.profilePicture) {
        const fileExt = formData.profilePicture.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, formData.profilePicture, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
          
        avatarUrl = publicUrl;
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email,
          avatar_url: avatarUrl
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully!",
        description: "Your profile information has been saved."
      });

      onProfileUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Password mismatch",
        description: "New passwords don't match.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });

      if (error) throw error;

      toast({
        title: "Password updated successfully!",
        description: "Your password has been changed."
      });

      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error updating password",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card className="glass-card-strong border-white/30 dark:border-white/30 border-gray-300">
        <CardHeader>
          <CardTitle className="text-white dark:text-white text-gray-900">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profile Picture Upload */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-gray-900">
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="profilePicture" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  Upload Photo
                </div>
              </Label>
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white dark:text-white text-gray-900">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
                className="glass-input text-white dark:text-white text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white dark:text-white text-gray-900">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                className="glass-input text-white dark:text-white text-gray-900"
              />
            </div>
          </div>

          <Button onClick={handleUpdateProfile} disabled={isLoading} className="glass-button text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card className="glass-card-strong border-white/30 dark:border-white/30 border-gray-300">
        <CardHeader>
          <CardTitle className="text-white dark:text-white text-gray-900">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-white dark:text-white text-gray-900">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
              placeholder="Enter current password"
              className="glass-input text-white dark:text-white text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-white dark:text-white text-gray-900">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
              placeholder="Enter new password"
              className="glass-input text-white dark:text-white text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white dark:text-white text-gray-900">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
              placeholder="Confirm new password"
              className="glass-input text-white dark:text-white text-gray-900"
            />
          </div>

          <Button 
            onClick={handlePasswordChange} 
            disabled={isLoading || !passwords.current || !passwords.new || !passwords.confirm}
            className="glass-button text-white"
          >
            <Key className="w-4 h-4 mr-2" />
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
