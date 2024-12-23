import React, { useEffect, useState } from 'react';
import { AreaEntity } from '../../../types/AreaEntity';
import CustomMapMarker from '../Marker/MapMarker';
import { createRoot } from 'react-dom/client';

interface AreaKakaoApiMapProps {
  factoryAreaList: AreaEntity[];
  selectedArea: AreaEntity;
}

const AreaKakaoApiMap: React.FC<AreaKakaoApiMapProps> = ({
  factoryAreaList,
  selectedArea,
}) => {
  const [map, setMap] = useState<any>();
  const [customMakerList, setCustomMarkerList] = useState<any>();

  useEffect(() => {
    const initializeMap = async () => {
      try {
        await loadKakaoMap();
        const kakao = (window as any).kakao;
        kakao.maps.load(() => {
          const container = document.getElementById('map'); // 지도를 표시할 div
          const options = {
            center: new kakao.maps.LatLng(37.49351, 127.1131), // 초기 중심 좌표 // 가락시장 중앙
            level: 2, // 확대 레벨
            mapTypeId: kakao.maps.MapTypeId.SKYVIEW,
          };

          // 지도 및 마커(커스텀 마커) 생성
          const map = new kakao.maps.Map(container, options);

          // 구역별 위치를 미리 마커(커스텀 마커)로 선정
          const customMakerRenderList = factoryAreaList.map(
            (factoryArea: AreaEntity) => {
              const markerContainer = document.createElement('div');
              const root = createRoot(markerContainer);
              root.render(
                <CustomMapMarker
                  markerId={factoryArea.areaId}
                  markerName={factoryArea.areaName}
                />
              );

              return new kakao.maps.CustomOverlay({
                position: new kakao.maps.LatLng(
                  factoryArea.areaLatitude,
                  factoryArea.areaLongitude
                ),
                content: markerContainer,
                map: map,
              });
            }
          );

          // 커스텀 마커를 지도에 표시
          customMakerRenderList.forEach((customMaker) =>
            customMaker.setMap(map)
          );

          setMap(map);
          setCustomMarkerList(customMakerRenderList);
        });
      } catch (error) {
        console.error(error);
      }
    };

    initializeMap();
  }, []);

  useEffect(() => {
    if (map && selectedArea) {
      // 선택 구역이 변경될시 map 이동
      const kakao = (window as any).kakao;
      const { areaLatitude, areaLongitude } = selectedArea;
      const selectedAreaPosition = new kakao.maps.LatLng(
        areaLatitude,
        areaLongitude
      );

      removeAllCustomMarkerList();

      // selctedArea 적용을 위해 커스텀 마커 리스트 재생성
      const customMakerRenderList = factoryAreaList.map(
        (factoryArea: AreaEntity) => {
          const markerContainer = document.createElement('div');
          const root = createRoot(markerContainer);
          root.render(
            <CustomMapMarker
              markerId={factoryArea.areaId}
              selectedMarkerId={selectedArea.areaId}
              markerName={factoryArea.areaName}
            />
          );

          return new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(
              factoryArea.areaLatitude,
              factoryArea.areaLongitude
            ),
            content: markerContainer,
            map: map,
          });
        }
      );

      // 커스텀 마커를 지도에 표시
      customMakerRenderList.forEach((customMaker) => customMaker.setMap(map));
      setCustomMarkerList(customMakerRenderList);

      // 지도 표시 후 selectedArea Position 이동
      map.panTo(selectedAreaPosition);
    }
  }, [map, selectedArea]);

  // 동적 스크립트 로드 함수
  const loadKakaoMap = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('kakao-map-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'kakao-map-script';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_MAP_API_KEY
      }&autoload=false`;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error('Kakao Maps script loading failed'));
      document.head.appendChild(script);
    });
  };

  // 모든 커스텀 마커 제거 함수
  const removeAllCustomMarkerList = () => {
    customMakerList.forEach((customMarker: any) => customMarker.setMap(null)); // 지도에서 커스텀 마커 제거
    customMakerList.length = 0; // 배열 초기화
  };

  return <div className="h-screen py-20" id="map" />;
};

export default AreaKakaoApiMap;
