import ImageMapMarker from '../Marker/ImageMapMarker';

interface ImageMapProps {
  src: string;
  markers: any;
  movings: any;
}

// 평면도 이미지맵
const ImageMap: React.FC<ImageMapProps> = ({ src, markers, movings }) => {
  return (
    <div>
      <img src={src} alt="평면도" className="w-full rounded" />
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
export default ImageMap;
