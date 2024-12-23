import { useEffect, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface ImageMapMarkerProps {
  actionData: Position[];
  id: string; // ID 태그를 위한 속성
  isAccident?: boolean; // 사고 발생
  accidentInfo?: string; // 사고 발생 정보
  speed?: number; // 작업 속도
}

// 이미지 파일인 평면도에서 사용하는 마커
const ImageMapMarker: React.FC<ImageMapMarkerProps> = ({
  actionData,
  id,
  isAccident = false,
  accidentInfo = '',
  speed = 700,
}) => {
  const [currentPosition, setCurrentPosition] = useState<Position>(
    actionData[0]
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % actionData.length;
        setCurrentPosition(actionData[nextIndex]);
        return nextIndex;
      });
    }, speed); // speed초 간격으로 위치 변경

    return () => clearInterval(interval);
  }, []);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 transform 
        cursor-pointer rounded-full bg-gradient-to-r ${
          isAccident
            ? 'from-eguard-red to-eguard-orange'
            : 'from-eguard-sidebar-end to-eguard-green'
        } z-10
        shadow-md transition-all duration-700 ease-out hover:z-50`}
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() =>
        setTimeout(() => {
          setIsHovered(false);
        }, 100)
      }
    >
      <div
        className={`absolute z-10 -translate-x-1/2 bg-black px-2 py-1 text-white opacity-70 ${
          isHovered === true ? 'z-50 opacity-100' : ''
        }`}
        style={{
          top: '25px', // 마커 위나 아래에 표시될 위치를 조정
          left: '50%',
          borderRadius: '5px',
          whiteSpace: 'nowrap',
        }}
      >
        <div>
          <span>{id}</span>
        </div>
        {isAccident === true && accidentInfo && (
          <div>
            <span className="text-eguard-orange">{accidentInfo}</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default ImageMapMarker;
