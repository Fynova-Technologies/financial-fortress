import React, {useState} from "react"
import { PageHeader } from "@/components/page-header"
import { TermsConditions } from "@/components/TermsConditions"

export const TermsConditionsPage = () => {
    return (
        <div>
            <PageHeader 
                title="Terms and Conditions" 
                description="Understand the terms governing your use of our app"
            />
            <TermsConditions />
        </div>
    )
}