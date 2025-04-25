
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">ProtonHub TaskManger</h1>
          {user && (
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          )}
        </div>
        {user && (
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        )}
      </div>
    </header>
  );
}
