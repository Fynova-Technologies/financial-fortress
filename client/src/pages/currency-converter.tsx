import { CurrencyConverter as CurrencyConverterComponent } from "@/components/calculators/currency-converter";
import { PageHeader } from "@/components/page-header";
import { useAuth0 } from "@auth0/auth0-react";
import { AuthPopup } from "@/components/auth/AuthPopup";
import { useState } from "react";

export default function CurrencyConverter() {
  const { isAuthenticated } = useAuth0();
  const [showAuthPopup, setShowAuthPopup] = useState<boolean>(false);
  return (
    <div>
      <PageHeader 
        title="Currency Converter" 
        description="Convert between currencies"
      />
      <CurrencyConverterComponent onRequireLogic={() => setShowAuthPopup(true)}/>

      <AuthPopup 
       visible={showAuthPopup}
       onClose={() => setShowAuthPopup(false)}
       onLogin={() =>{}}
       onSignup={() =>{}}
      />
    </div>
  );
}
