import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const { toast } = useToast();
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { session_id: sessionId }
        });

        if (error) throw error;

        setPaymentData(data);
        
        if (data.success) {
          toast({
            title: "Payment Successful! 🎉",
            description: `${data.connections_added} LinkedIn connections added to your account!`,
          });
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast({
          title: "Error verifying payment",
          description: "Please contact support if your payment was processed.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p>Verifying your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sessionId || !paymentData?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Payment Error</CardTitle>
            <CardDescription>
              There was an issue with your payment. Please try again or contact support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Payment Successful! 🎉
          </CardTitle>
          <CardDescription className="text-lg">
            Your LinkedIn connections have been boosted!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">
              +{paymentData.connections_added} LinkedIn Connections
            </h3>
            <p className="text-muted-foreground">
              Time to flex on your friends! 💪 Your expanded network is ready to impress.
            </p>
          </div>
          
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-center space-x-2">
              <span>📈</span>
              <span>Your LinkedIn profile just got a major upgrade</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>🚀</span>
              <span>Watch your professional credibility soar</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>😎</span>
              <span>Time to update that LinkedIn status</span>
            </div>
          </div>

          <div className="pt-4">
            <Link to="/">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;