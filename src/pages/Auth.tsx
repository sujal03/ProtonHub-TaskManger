import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/');
    });
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      toast({
        title: isSignUp ? 'Account created' : 'Welcome back!',
        description: isSignUp
          ? 'Check your email to verify your account'
          : 'Successfully logged in'
      });

      if (!isSignUp) navigate('/');
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute w-80 h-80 bg-indigo-300 rounded-full opacity-20 blur-3xl top-0 -left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-pink-300 rounded-full opacity-15 blur-3xl bottom-0 -right-20 animate-pulse-slow"></div>
      <div className="absolute w-64 h-64 bg-purple-200 rounded-full opacity-25 blur-2xl top-1/2 left-1/3 animate-pulse"></div>

      {/* Auth Card */}
      <Card className="w-full max-w-md bg-white/30 backdrop-blur-xl shadow-xl border border-white/20 rounded-3xl z-10 transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="text-center space-y-3 pb-2">
          <CardTitle className="text-4xl font-bold tracking-tight text-gray-900 bg-clip-text">
            {isSignUp ? 'Join Us' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-gray-600 text-base font-medium">
            {isSignUp
              ? 'Create your account to start exploring.'
              : 'Sign in to continue your journey.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
              />
            </div>
            <div className="flex flex-col gap-4 pt-2">
              <Button
                type="button"
                onClick={handleAuth}
                disabled={loading || !email || !password}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}