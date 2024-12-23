import React, { useEffect, useState } from 'react';
import { AreaEntity } from '../../types/AreaEntity';
import PrimaryButton from '../../components/Buttons/PrimaryButton';

interface MainMonitoringAreaMenuProps {
  viewType: string;
  setViewType: (selectedViewType: string) => void;
  factoryAreaList: AreaEntity[];
  selectedArea: AreaEntity;
  setSelectedArea: (seletedArea: AreaEntity) => void;
}

const MainMonitoringAreaMenu: React.FC<MainMonitoringAreaMenuProps> = ({
  viewType,
  setViewType,
  factoryAreaList,
  selectedArea,
  setSelectedArea,
}) => {
  return (
    <>
      <div className="absolute left-2 top-1 z-10">
        <span className="text-title-xl text-white">{viewType}</span>
      </div>
      <div className="absolute right-1 top-1 z-10 flex flex-row gap-1">
        <select
          className={`max-h-12 min-w-15 items-center rounded border border-primary bg-transparent px-4 py-2 text-primary hover:bg-primary hover:bg-opacity-90 hover:text-white`}
          onChange={(e) => {
            const targetAreaId = Number(e.target.value);
            const targetSelectedArea = factoryAreaList.find(
              (factoryArea) => factoryArea.areaId === targetAreaId
            );
            targetSelectedArea && setSelectedArea(targetSelectedArea);
          }}
        >
          {factoryAreaList &&
            factoryAreaList.map((area: AreaEntity, index: number) => (
              <option
                key={index}
                value={area.areaId}
                selected={selectedArea.areaId === area.areaId}
              >
                구역 : {area.areaName}
              </option>
            ))}
        </select>
        <PrimaryButton
          text="2D"
          size="sm"
          onClick={() => setViewType('2D')}
          outline={viewType === '2D' ? false : true}
        />
        <PrimaryButton
          text="3D"
          size="sm"
          onClick={() => setViewType('3D')}
          outline={viewType === '3D' ? false : true}
        />
        <PrimaryButton
          text="Map"
          size="sm"
          onClick={() => setViewType('Map')}
          outline={viewType === 'Map' ? false : true}
        />
      </div>
    </>
  );
};

export default MainMonitoringAreaMenu;
