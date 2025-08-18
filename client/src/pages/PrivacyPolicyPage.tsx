import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { PrivacyPolicy as PrivacyPolicyComponent } from "@/components/PrivacyPolicy";
import AuthPopup from "@/components/auth/AuthPopup";

export default function PrivacyPolicyPage() {
  const [showAuthPopup, setShowAuthPopup] = useState<boolean>(false);

  return (
    <div>
      <PageHeader 
        title="Privacy Policy" 
        description="Learn how we handle your data and privacy"
      />
      
      <PrivacyPolicyComponent />

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