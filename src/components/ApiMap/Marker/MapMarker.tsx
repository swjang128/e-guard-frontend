interface CustomMapMarkerProps {
  markerId: number;
  selectedMarkerId?: number;
  markerName: string;
}

// API 기반 지도용 마커
// 커스텀 오버레이
const CustomMapMarker: React.FC<CustomMapMarkerProps> = ({
  markerId,
  selectedMarkerId = 0,
  markerName,
}) => {
  return (
    <div className="rounded border-2 border-stroke bg-white px-4 py-2 shadow-2 transition">
      <span
        className={`font-semibold ${
          markerId === selectedMarkerId ? 'text-eguard-green' : 'text-slate-400'
        }`}
      >
        {markerName}
      </span>
    </div>
  );
};
export default CustomMapMarker;
