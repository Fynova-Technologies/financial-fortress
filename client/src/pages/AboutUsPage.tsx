import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { AboutUs } from "@/components/AboutUs";
import AuthPopup from "@/components/auth/AuthPopup";

export default function AboutUsPage() {
    const [showAuthPopup, setShowAuthPopup] = useState<boolean>(false);
  return (
    <div>
        <PageHeader 
            title="About Us" 
            description="Learn more about our mission and team"
        />
        
        <AboutUs />

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