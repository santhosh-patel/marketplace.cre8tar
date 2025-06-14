
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Initialize user profile with correct balance on first sign in
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            console.log('Checking/creating profile for user:', session.user.id);
            
            // First check if profile exists
            const { data: existingProfile, error: checkError } = await supabase
              .from('profiles')
              .select('c8r_balance')
              .eq('user_id', session.user.id)
              .single();

            console.log('Existing profile check:', existingProfile, checkError);

            // If no profile exists, create one with the correct balance
            if (checkError && checkError.code === 'PGRST116') {
              console.log('Creating new profile with 2500 C8R balance');
              const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert({
                  user_id: session.user.id,
                  name: session.user.user_metadata?.name || 'User',
                  email: session.user.email || '',
                  c8r_balance: 2500
                })
                .select()
                .single();

              console.log('Profile creation result:', newProfile, insertError);
              
              if (insertError) {
                console.error('Error creating profile:', insertError);
              }
            } else if (!checkError && existingProfile) {
              console.log('Profile exists with balance:', existingProfile.c8r_balance);
            }
          } catch (error) {
            console.error('Error handling user profile:', error);
          }
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Signing up user with name:', name);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });

      console.log('Signup result:', data, error);

      if (data.user && !data.session && !error) {
        return { 
          error: null,
          needsConfirmation: true
        };
      }

      return { error, needsConfirmation: false };
    } catch (err: any) {
      console.error('Signup error:', err);
      return { error: err, needsConfirmation: false };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      console.log('Sign in result:', error);
      return { error };
    } catch (err: any) {
      console.error('Sign in error:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
