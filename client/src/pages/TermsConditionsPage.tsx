import React, {useState} from "react"
import { PageHeader } from "@/components/page-header"
import { TermsConditions } from "@/components/TermsConditions"
import AuthPopup from "@/components/auth/AuthPopup"

export const TermsConditionsPage = () => {
    return (
        <div>
            <PageHeader 
                title="Terms and Conditions" 
                description="Understand the terms governing your use of our app"
            />
            <TermsConditions />
            <AuthPopup
                visible={false} // This can be controlled based on your app's logic
                onClose={() => {}}
                onLogin={() => {}}
                onSignup={() => {}}
            />
        </div>
    )
}