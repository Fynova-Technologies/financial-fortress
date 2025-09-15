import { Button } from "@/components/ui/button";
import { ExportExcelButton } from "./ExportDataButton";
import { RefObject } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  exportTargetRef?: RefObject<HTMLElement>;
  onSave?: () => void;
  isSaving?: boolean;
}

export function PageHeader({ title, description, exportTargetRef, onSave, isSaving }: PageHeaderProps) {

  const extractData = (element: HTMLElement): Record<string, string>[] => {
    console.log("Exporting from element:", element);
    const rows = Array.from(element.querySelectorAll("table tr"));
    console.log("Rows found:", rows.length);
    return rows.map((row) => {
      const cells = row.querySelectorAll("th, td");
      const rowData: Record<string, string> = {};
      cells.forEach((cell, index) => {
        rowData[`Column ${index + 1}`] = cell.textContent?.trim() || "";
      });
      return rowData;
    });
  }; 

  return (
    <div className="mb-8 lg:flex lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      
      <div className="flex lg:items-center mt-4 lg:mt-0 space-x-3">
        {onSave && (
          <Button
            className={`${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            } text-gray-800 dark:text-gray-200`}
            onClick={onSave}
            disabled={isSaving}
          >
            <i className={`fas ${isSaving ? 'fa-spinner fa-spin' : 'fa-save'} mr-2`}></i>
            {isSaving ? 'Saving...' : 'Save Data'}
          </Button>
        )}
        {exportTargetRef && (
          <ExportExcelButton 
            targetRef={exportTargetRef} 
            fileName={`${title}.xlsx`}
            extractData={extractData}
          />
        )}
      </div>
    </div>
  );
}