import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, 
  TrendingUp, 
  Users, 
  Crown, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Target,
  ChevronRight,
  Rocket,
  Trophy,
  Globe,
  Shield
} from 'lucide-react';

interface UserProfile {
  current_connections: number;
  total_purchased_connections: number;
  username: string;
}

const PACKAGES = [ { id: 'starter', 
                    name: 'Starter Boost',
                    connections: 100, price: 9.99, 
                    description: 'Perfect for beginners ready to shine',
                    icon: '🚀', color: 'bg-stone-200',
, 
                    popular: false, 
                    features: ['Instant delivery', 'Real connections', '24/7 support'] },
                  { id: 'professional', 
                   name: 'Professional Pro',
                   connections: 500, price: 29.99, 
                   description: 'For serious professionals who mean business', 
                   icon: '💼', color: 'bg-stone-200',
,
                   popular: true, 
                   features: ['Priority delivery', 'Premium connections', 'VIP support', 'Growth analytics'] }, 
                  { id: 'enterprise', 
                   name: 'Ultimate Legend', 
                   connections: 1000, 
                   price: 49.99,
                   description: 'Maximum impact - become a LinkedIn legend', 
                   icon: '👑', 
                   color: 'bg-stone-200',
 
                   popular: false, 
                   features: ['Lightning fast', 'Elite connections', 'Personal manager', 'Advanced analytics', 'Custom targeting'] }, ];

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
      
      // Redirect to Stripe checkout
      window.location.href = data.url;
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-primary p-6 rounded-full w-20 h-20 mx-auto mb-6 animate-float">
            <Users className="h-8 w-8 text-white mx-auto" />
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-lg blur-lg opacity-30 animate-pulse"></div>
            <p className="relative text-lg font-medium bg-white/90 backdrop-blur-md px-6 py-3 rounded-lg">
              Loading your LinkedIn superpowers...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-primary p-2 rounded-xl shadow-glow">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  LinkedIn Booster
                </span>
              </div>
              
              <Link to="/auth">
                <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-hero opacity-60"></div>
          <div className="container mx-auto px-6 relative">
            <div className="text-center max-w-5xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-8 animate-float">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Transform Your LinkedIn Presence</span>
                <Crown className="h-4 w-4 text-accent" />
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-extrabold mb-8 animate-fade-in">
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  Flex
                </span>
                <span className="text-foreground">your firends lmaoo</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in">
                Wanna to get 500+ connections in your wbesite to flex your firends??? 
                <span className="bg-gradient-accent bg-clip-text text-transparent font-bold"> professional powerhouse </span>
                you were meant to be(Daummmmmmm)! 
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-scale-in">
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-10 py-6 group"
                  >
                    Start Boosting Now
                    <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-lg px-10 py-6"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">Our Platform?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
               If you have brain, you shoudn't platform like this✨anywas this website is a scam lel
              </p>
            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
              {[
                { icon: Zap, title: "Lightning Fast", description: "Instant delivery guaranteed", color: "text-yellow-500" },
                { icon: Shield, title: "100% Secure", description: "Safe & authentic profiles", color: "text-green-500" },
                { icon: Globe, title: "Global Reach", description: "Worldwide connections", color: "text-blue-500" },
                { icon: Trophy, title: "Premium Quality", description: "Curated connections only", color: "text-purple-500" }
              ].map((feature, index) => (
                <Card key={index} className="border-0 bg-white/90 backdrop-blur-md shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-3 group">
                  <CardContent className="p-8 text-center">
                    <div className={`bg-gradient-primary p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Choose Your Power Level
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Select the perfect package to dominate your LinkedIn network
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {PACKAGES.map((pkg, index) => (
                <Card 
                  key={pkg.id} 
                  className={`relative overflow-hidden border-0 shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-4 group ${
                    pkg.popular ? 'lg:scale-105 ring-2 ring-primary/20' : ''
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute top-4 right-4 bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  )}
                  
                  <div className={`h-2 bg-gradient-to-r ${pkg.color}`}></div>
                  
                  <CardHeader className="text-center pb-4">
                    <div className="text-5xl mb-4">{pkg.icon}</div>
                    <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                    <CardDescription className="text-base">{pkg.description}</CardDescription>
                    <div className="space-y-2 pt-4">
                      <div className="text-5xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">
                        ${pkg.price}
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Target className="h-5 w-5 text-accent" />
                        <span className="text-lg font-semibold">+{pkg.connections} connections</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <ChevronRight className="h-4 w-4 text-accent flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link to="/auth">
                      <Button 
                        className={`w-full bg-gradient-to-r ${pkg.color} hover:shadow-glow transition-all duration-300 group-hover:scale-105 font-semibold text-white border-0`}
                      >
                        Get {pkg.connections} Connections
                        <Sparkles className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <div className="container mx-auto px-6 relative">
            <div className="text-center text-white">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Ready to Become a LinkedIn Legend?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of professionals who've already transformed their LinkedIn presence
              </p>
              <Link to="/auth">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-6 font-semibold group shadow-xl"
                >
                  Start Your Transformation
                  <Crown className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Logged-in user view
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-primary p-2 rounded-xl shadow-glow">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Welcome back, {profile?.username || 'Legend'}!
                </span>
                <p className="text-sm text-muted-foreground">Ready to boost your network?</p>
              </div>
            </div>
            
            <Button onClick={signOut} variant="outline" size="sm" className="group">
              <LogOut className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Dashboard */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-12">
          <Card className="border-0 bg-white/90 backdrop-blur-md shadow-card hover:shadow-glow transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Connections</CardTitle>
              <Users className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{profile?.current_connections || 0}</div>
              <p className="text-xs text-muted-foreground">Total LinkedIn connections</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/90 backdrop-blur-md shadow-card hover:shadow-glow transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Purchased</CardTitle>
              <TrendingUp className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{profile?.total_purchased_connections || 0}</div>
              <p className="text-xs text-muted-foreground">Connections from us</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/90 backdrop-blur-md shadow-card hover:shadow-glow transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Level</CardTitle>
              <Crown className="h-5 w-5 text-yellow-500 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {(profile?.current_connections || 0) > 1000 ? 'Legend' : 
                 (profile?.current_connections || 0) > 500 ? 'Pro' : 
                 (profile?.current_connections || 0) > 100 ? 'Rising' : 'Starter'}
              </div>
              <p className="text-xs text-muted-foreground">Your current tier</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-md shadow-card hover:shadow-glow transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <Star className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">
                {Math.round(((profile?.total_purchased_connections || 0) / Math.max(profile?.current_connections || 1, 1)) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Boost contribution</p>
            </CardContent>
          </Card>
        </div>

        {/* Packages Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Level Up Your <span className="bg-gradient-primary bg-clip-text text-transparent">Network</span>
          </h2>
          <p className="text-xl text-muted-foreground">Choose your next power boost</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PACKAGES.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative overflow-hidden border-0 shadow-card hover:shadow-glow transition-all duration-500 hover:-translate-y-4 group ${
                pkg.popular ? 'lg:scale-105 ring-2 ring-primary/20' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-4 right-4 bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className={`h-2 bg-gradient-to-r ${pkg.color}`}></div>
              
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-3">{pkg.icon}</div>
                <CardTitle className="text-xl font-bold">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="space-y-2 pt-3">
                  <div className="text-4xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">
                    ${pkg.price}
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Target className="h-4 w-4 text-accent" />
                    <span className="font-semibold">+{pkg.connections} connections</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-2">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                      <ChevronRight className="h-3 w-3 text-accent flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full bg-gradient-to-r ${pkg.color} hover:shadow-glow transition-all duration-300 group-hover:scale-105 font-semibold text-white border-0`}
                  onClick={() => handlePurchase(pkg)}
                  disabled={purchasing === pkg.id}
                >
                  {purchasing === pkg.id ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Boost +{pkg.connections}
                      <Sparkles className="ml-2 h-4 w-4" />
                    </>
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
