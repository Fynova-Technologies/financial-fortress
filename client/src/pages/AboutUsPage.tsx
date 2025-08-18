import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { AboutUs } from "@/components/AboutUs";

export default function AboutUsPage() {
    const [showAuthPopup, setShowAuthPopup] = useState<boolean>(false);
  return (
    <div>
        <PageHeader 
            title="About Us" 
            description="Learn more about our mission and team"
        />
        
        <AboutUs />
    </div>
  );
}