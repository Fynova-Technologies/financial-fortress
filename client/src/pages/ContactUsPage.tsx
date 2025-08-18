import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ContactUs as ContactUsComponent } from "@/components/ContactUs";
import AuthPopup from "@/components/auth/AuthPopup";

export default function ContactUsPage() {
  const [showAuthPopup, setShowAuthPopup] = useState<boolean>(false);

  return (
    <div>
      <PageHeader 
        title="Contact Us" 
        description="Get in touch with us for any inquiries or support"
      />
      
      <ContactUsComponent />

      {showAuthPopup && (
        <AuthPopup
          visible={showAuthPopup}
          onClose={() => setShowAuthPopup(false)}
          // These props are now handled inside AuthPopup with Auth0
          onLogin={() => {}}
          onSignup={() => {}}
        />
      )}
    </div>
  );
}