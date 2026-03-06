import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';

interface SessionData {
  status: string;
  customerEmail?: string;
  amountTotal?: number;
  currency?: string;
}

export default function CheckoutSuccess() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    
    if (sessionId) {
      fetch(`/api/stripe/session/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setSessionData(data);
          setLoading(false);
          localStorage.removeItem('cart');
        })
        .catch(err => {
          console.error('Error fetching session:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-[#1a1a1a] border-[#333] text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#2DD4BF] to-[#C5A059] flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-black" />
              </div>
            </div>
            <CardTitle className="text-3xl font-cormorant bg-gradient-to-r from-[#C5A059] via-[#2DD4BF] to-[#E8736F] bg-clip-text text-transparent">
              Order Confirmed!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-300 text-lg">
              Thank you for your purchase. Your order is being prepared with care.
            </p>
            
            {sessionData && (
              <div className="bg-[#0a0a0a] rounded-lg p-6 space-y-3">
                {sessionData.customerEmail && (
                  <p className="text-gray-400">
                    Confirmation sent to: <span className="text-white">{sessionData.customerEmail}</span>
                  </p>
                )}
                {sessionData.amountTotal && (
                  <p className="text-2xl font-bold text-[#C5A059]">
                    ${(sessionData.amountTotal / 100).toFixed(2)} {sessionData.currency?.toUpperCase()}
                  </p>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-center gap-3 py-4">
              <Package className="w-5 h-5 text-[#2DD4BF]" />
              <span className="text-gray-300">Your premium cigars will arrive in 3-5 business days</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/">
                <Button variant="outline" className="border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059]/10">
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Button>
              </Link>
              <Link href="/products">
                <Button className="bg-gradient-to-r from-[#C5A059] to-[#2DD4BF] text-black hover:opacity-90">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
