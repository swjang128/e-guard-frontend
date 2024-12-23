import { AreaEntity } from '../../../types/AreaEntity';
import ImageMapMarker from '../Marker/ImageMapMarker';

interface AreaImageMapProps {
  selectedArea: AreaEntity;
  markers: any;
  movings: any;
}

// const movings: WorkersActions = {
//   AteWorker0001: [
//     { x: 50, y: 55 },
//     { x: 70, y: 55 },
//     { x: 90, y: 55 },
//     { x: 110, y: 55 },
//     { x: 110, y: 85 },
//     { x: 110, y: 105 },
//     { x: 110, y: 125 },
//     { x: 110, y: 145 },
//     { x: 110, y: 165 },
//     { x: 110, y: 185 },
//     { x: 110, y: 205 },
//     { x: 110, y: 225 },
//     { x: 130, y: 225 },
//     { x: 150, y: 225 },
//     { x: 165, y: 225 },
//     { x: 165, y: 205 },
//     { x: 165, y: 185 },
//     { x: 165, y: 170 },
//     // 회차
//     // for문 거꾸로 돌기
//     { x: 165, y: 185 },
//     { x: 165, y: 205 },
//     { x: 165, y: 225 },
//     { x: 150, y: 225 },
//     { x: 130, y: 225 },
//     { x: 110, y: 225 },
//     { x: 110, y: 205 },
//     { x: 110, y: 185 },
//     { x: 110, y: 165 },
//     { x: 110, y: 145 },
//     { x: 110, y: 125 },
//     { x: 110, y: 105 },
//     { x: 110, y: 85 },
//     { x: 110, y: 55 },
//     { x: 90, y: 55 },
//     { x: 70, y: 55 },
//     { x: 50, y: 55 },
//     // 필요한 만큼 추가
//   ],
//   AteWorker0002: [{ x: 210, y: 380 }],
//   AteWorker0003: [{ x: 400, y: 390 }],
//   AteWorker0004: [{ x: 210, y: 360 }],
//   AteWorker0005: [{ x: 230, y: 370 }],
//   AteWorker0006: [
//     { x: 500, y: 500 },
//     { x: 500, y: 480 },
//     { x: 500, y: 460 },
//     { x: 500, y: 440 },
//     { x: 500, y: 420 },
//     { x: 500, y: 400 },
//     { x: 520, y: 400 },
//     // 회차
//     // for문 거꾸로 돌기
//     { x: 500, y: 400 },
//     { x: 500, y: 420 },
//     { x: 500, y: 440 },
//     { x: 500, y: 460 },
//     { x: 500, y: 480 },
//   ],
//   AteWorker0007: [{ x: 520, y: 100 }],
//   AteWorker0008: [{ x: 520, y: 120 }],
//   AteWorker0009: [
//     { x: 620, y: 140 },
//     { x: 640, y: 140 },
//     { x: 660, y: 140 },
//     { x: 670, y: 140 },
//     { x: 670, y: 160 },
//     { x: 670, y: 180 },
//     { x: 670, y: 200 },
//     { x: 670, y: 220 },
//     { x: 650, y: 220 },
//     { x: 640, y: 210 },
//     { x: 620, y: 210 },
//     { x: 600, y: 210 },
//     { x: 580, y: 210 },
//     { x: 560, y: 210 },
//     { x: 560, y: 180 },
//     { x: 540, y: 180 },
//     // 회차
//     { x: 560, y: 180 },
//     { x: 560, y: 210 },
//     { x: 580, y: 210 },
//     { x: 600, y: 210 },
//     { x: 620, y: 210 },
//     { x: 640, y: 210 },
//     { x: 650, y: 220 },
//     { x: 670, y: 220 },
//     { x: 670, y: 200 },
//     { x: 670, y: 180 },
//     { x: 670, y: 160 },
//     { x: 670, y: 140 },
//     { x: 660, y: 140 },
//     { x: 640, y: 140 },
//   ],
//   AteWorker0010: [
//     { x: 520, y: 180 },
//     { x: 500, y: 180 },
//     { x: 480, y: 180 },
//     // 회차
//     { x: 500, y: 180 },
//   ],
// };

const handleOnChange = () => {};

// 현재 적용 : 2D
const AreaImageMap: React.FC<AreaImageMapProps> = ({
  selectedArea,
  markers,
  movings,
}) => {
  return (
    <div>
      <img
        src={`http://193.122.125.229${selectedArea.areaPlan2DFilePath}`}
        alt="평면도"
        className="w-full rounded"
      />
      {markers &&
        markers.map((marker: any, index: number) => (
          <ImageMapMarker
            key={index}
            actionData={movings[marker.employeeNumber] || []}
            id={marker.employeeNumber}
          />
        ))}
    </div>
  );
};
export default AreaImageMap;
