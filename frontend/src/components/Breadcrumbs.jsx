import { ChevronRight } from "lucide-react";

export const Breadcrumbs = ({ paths }) => {
  return (
    <div className="flex items-center space-x-2 text-gray-600 text-sm sm:text-sm lg:text-md font-medium">
      {paths.map((path, index) => (
        <div key={index} className="flex items-center">
          <a
            href={path.href}
            className={`${
              index === paths.length - 1 ? "text-gray-900 font-medium" : "hover:underline"
            }`}
          >
            {path.label}
          </a>
          {index < paths.length - 1 && <ChevronRight className="w-4 h-4 mx-1 text-gray-500" />}
        </div>
      ))}
    </div>
  );
};

