import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 lg:flex lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      
      <div className="hidden lg:flex lg:items-center mt-4 lg:mt-0 space-x-3">
        <Button className="bg-primary-500 hover:bg-primary-600 text-white">
          <i className="fas fa-save mr-2"></i>
          Save Data
        </Button>
        <Button variant="outline" className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200">
          <i className="fas fa-file-export mr-2"></i>
          Export
        </Button>
      </div>
    </div>
  );
}
