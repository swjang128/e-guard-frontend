import { useState } from 'react';
import { Link } from 'react-router-dom';

interface TabsProps {
  data: any[];
}

const Tabs: React.FC<TabsProps> = ({ data }) => {
  const [openTab, setOpenTab] = useState(0);

  const activeClasses = 'bg-primary text-white';
  const inactiveClasses = 'bg-gray dark:bg-meta-4 text-black dark:text-white';

  return (
    <div className="grid-row mb-7.5 grid max-h-15 gap-2 pb-5 dark:border-strokedark">
      {data &&
        data.map((dataItem, index): any => (
          <Link
            key={index}
            to="#"
            className={`rounded-r px-4 py-3 text-sm font-medium hover:bg-primary hover:text-white dark:hover:bg-primary lg:px-6 md:text-base ${
              openTab === index ? activeClasses : inactiveClasses
            }`}
            onClick={() => setOpenTab(index)}
          >
            {dataItem.name}
          </Link>
        ))}
    </div>
  );
};

export default Tabs;
