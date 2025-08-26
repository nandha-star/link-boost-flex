import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, TrendingUp, Users, Crown, Zap } from 'lucide-react';

interface UserProfile {
  current_connections: number;
  total_purchased_connections: number;
  username: string;
}

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Flex',
    connections: 100,
    price: 9.99,
    description: 'Perfect for beginners wanting to impress',
    icon: '🚀',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional Flex',
    connections: 500,
    price: 29.99,
    description: 'For serious professionals who mean business',
    icon: '💼',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Ultimate Flex',
    connections: 1000,
    price: 49.99,
    description: 'Maximum flex potential - become a LinkedIn legend',
    icon: '👑',
    popular: false,
  },
];

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('current_connections, total_purchased_connections, username')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handlePurchase = async (packageInfo: typeof PACKAGES[0]) => {
    if (!user) return;
    
    setPurchasing(packageInfo.id);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          package_type: packageInfo.name,
          connections: packageInfo.connections,
          amount: packageInfo.price,
        }
      });

      if (error) throw error;
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Error",
        description: "Failed to create payment session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading your LinkedIn flex potential...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              LinkedIn Connection Booster
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Boost your LinkedIn connections instantly and flex on your friends! 💪
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 text-4xl">⚡</div>
                <CardTitle>Instant Boost</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get your connections added instantly after payment. No waiting around!
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 text-4xl">🎯</div>
                <CardTitle>Targeted Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Choose the perfect package size to match your professional goals.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 text-4xl">😎</div>
                <CardTitle>Flex Factor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Watch your friends' jaws drop when they see your massive network!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Preview */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Choose Your Flex Level</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {PACKAGES.map((pkg) => (
                <Card key={pkg.id} className={pkg.popular ? "border-primary shadow-lg scale-105" : ""}>
                  <CardHeader className="text-center">
                    {pkg.popular && (
                      <Badge className="mx-auto mb-2 bg-gradient-primary">Most Popular</Badge>
                    )}
                    <div className="text-3xl mb-2">{pkg.icon}</div>
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold mb-2">${pkg.price}</div>
                    <div className="text-lg text-muted-foreground mb-4">
                      +{pkg.connections} connections
                    </div>
                    <Link to="/auth">
                      <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                        Sign Up to Purchase
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Welcome back, {profile?.username || 'LinkedIn Legend'}!
            </h1>
            <p className="text-muted-foreground">Ready to boost your connections?</p>
          </div>
          <Button onClick={signOut} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Connections</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.current_connections || 0}</div>
              <p className="text-xs text-muted-foreground">Total LinkedIn connections</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Purchased Connections</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.total_purchased_connections || 0}</div>
              <p className="text-xs text-muted-foreground">Connections bought through us</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flex Level</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(profile?.current_connections || 0) > 1000 ? 'Legend' : 
                 (profile?.current_connections || 0) > 500 ? 'Pro' : 
                 (profile?.current_connections || 0) > 100 ? 'Rising' : 'Starter'}
              </div>
              <p className="text-xs text-muted-foreground">Your current status</p>
            </CardContent>
          </Card>
        </div>

        {/* Packages */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Boost Your Connections</h2>
          <p className="text-muted-foreground">Choose the perfect package to level up your LinkedIn game</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => (
            <Card key={pkg.id} className={pkg.popular ? "border-primary shadow-lg scale-105" : ""}>
              <CardHeader className="text-center">
                {pkg.popular && (
                  <Badge className="mx-auto mb-2 bg-gradient-primary">Most Popular</Badge>
                )}
                <div className="text-4xl mb-2">{pkg.icon}</div>
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold mb-2">${pkg.price}</div>
                <div className="text-lg text-muted-foreground mb-4">
                  +{pkg.connections} connections
                </div>
                <Button 
                  className="w-full" 
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => handlePurchase(pkg)}
                  disabled={purchasing === pkg.id}
                >
                  {purchasing === pkg.id ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Boost ${pkg.connections} Connections`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
