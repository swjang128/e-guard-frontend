import { useState } from 'react';
import { Link } from 'react-router-dom';

interface AreaTabsProps {
  data: any[];
  setSelectedArea: (seletedArea: any) => void;
}

const AreaTabs: React.FC<AreaTabsProps> = ({ data, setSelectedArea }) => {
  const [openTab, setOpenTab] = useState(0);

  const activeClasses = 'bg-primary text-white';
  const inactiveClasses = 'bg-gray dark:bg-meta-4 text-black dark:text-white';

  return (
    <div className="grid-row grid max-h-15 max-w-60 gap-2 dark:border-strokedark">
      {data &&
        data.map((dataItem, index): any => (
          <Link
            key={index}
            to="#"
            className={`rounded-r px-4 py-3 text-sm shadow-1 hover:bg-primary hover:text-white dark:hover:bg-primary ${
              openTab === index ? activeClasses : inactiveClasses
            }`}
            onClick={() => {
              setOpenTab(index);
              setSelectedArea(data[index]);
            }}
          >
            {dataItem.areaName}
          </Link>
        ))}
    </div>
  );
};

export default AreaTabs;
