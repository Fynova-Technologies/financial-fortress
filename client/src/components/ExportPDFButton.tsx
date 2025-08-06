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


import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/utils/exportToExcel";
import { RefObject } from "react";

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
  const handleExport = () => {
    const element = targetRef.current;
    if (!element) return;

    const data = extractData(element);
    exportToExcel(data, fileName);
  };

  return (
    <Button
      variant="outline"
      className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
      onClick={handleExport}
    >
      <i className="fas fa-file-excel mr-2"></i>
      Export to Excel
    </Button>
  );
};
