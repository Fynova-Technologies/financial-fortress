import { CurrencyConverter as CurrencyConverterComponent } from "@/components/calculators/currency-converter";
import { PageHeader } from "@/components/page-header";

export default function CurrencyConverter() {
  return (
    <div>
      <PageHeader 
        title="Currency Converter" 
        description="Convert between currencies"
      />
      <CurrencyConverterComponent />
    </div>
  );
}
