// import { Button } from "@/components/ui/button";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { RefObject } from "react";

// interface ExportPDFButtonProps {
//   targetRef: RefObject<HTMLElement>;
//   fileName?: string;
// }

// export const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ targetRef, fileName = "export.pdf" }) => {
//   const handleExport = async () => {
//     const element = targetRef.current;
//     if (!element) return;

//     const canvas = await html2canvas(element);
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save(fileName);
//   };

//   return (
//     <Button
//       variant="outline"
//       className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
//       onClick={handleExport}
//     >
//       <i className="fas fa-file-export mr-2"></i>
//       Export
//     </Button>
//   );
// };

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/utils/exportToExcel";
import { RefObject } from "react";
import AuthPopup from "./auth/AuthPopup";
import { useAuth0 } from "@auth0/auth0-react";

interface ExportExcelButtonProps {
  targetRef: RefObject<HTMLElement>;
  fileName?: string;
  extractData: (element: HTMLElement) => any[]; // Function to extract structured data
}

export const ExportExcelButton: React.FC<ExportExcelButtonProps> = ({
  targetRef,
  fileName = "export.xlsx",
  extractData,
}) => {
  const { isAuthenticated } = useAuth0();
  const [showAuthPopup, setShowAuthPopup] = useState<boolean>(false);

  const handleExport = () => {
    if (!isAuthenticated) {
      setShowAuthPopup(true);
      return;
    }
    const element = targetRef.current;
    if (!element) return;

    const data = extractData(element);
    exportToExcel(data, fileName);
  };

  return (
    <>
    <Button
      variant="outline"
      className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
      onClick={handleExport}
    >
      <i className="fas fa-file-excel mr-2"></i>
      Export to Excel
    </Button>

      {showAuthPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="pointer-events-auto max-w-lg w-full px-4">
            <AuthPopup
              visible={showAuthPopup}
              onClose={() => setShowAuthPopup(false)}
              onLogin={() => {}}
              onSignup={() => {}}
            />
          </div>
        </div>
      )}
  </>
  );
};
