import { Button } from "@/components/ui/button";
import { ExportPDFButton } from "./ExportPDFButton";
import { RefObject, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSave } from "@/store/saveContext";

interface PageHeaderProps {
  title: string;
  description: string;
  exportTargetRef?: RefObject<HTMLElement>;
}

export function PageHeader({ title, description, exportTargetRef }: PageHeaderProps) {
  const { isAuthenticated, user} = useAuth0();
  const [data, setData] = useState({});
  const { save } = useSave();

  return (
    <div className="mb-8 lg:flex lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      
      <div className="hidden lg:flex lg:items-center mt-4 lg:mt-0 space-x-3">
        <Button 
          className="bg-primary-500 hover:bg-primary-600 text-white"
          onClick={save}
        >
          <i className="fas fa-save mr-2"></i>
          Save Data
        </Button>
        {exportTargetRef && <ExportPDFButton targetRef={exportTargetRef} />}
      </div>
    </div>
  );
}
