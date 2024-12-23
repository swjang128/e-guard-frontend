import { Canvas } from '@react-three/fiber';
import { AreaEntity } from '../../types/AreaEntity';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';

interface AreaTDViewerProps {
  selectedArea: AreaEntity;
}

const Model = ({ scenePath }: { scenePath: string }) => {
  const { scene } = useGLTF(scenePath);
  return <primitive object={scene} scale={[2, 2, 2]} position={[0, 0, 0]} />;
};

const AreaTDViewer: React.FC<AreaTDViewerProps> = ({ selectedArea }) => {
  return (
    <div className="h-screen py-20">
      <Canvas camera={{ position: [0, 0, 15], fov: 100 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />

        {/* 모델 추가 */}
        <Model
          scenePath={`http://193.122.125.229${selectedArea.areaPlan3DFilePath}`}
        />

        {/* 카메라 컨트롤 추가 */}
        <OrbitControls
          target={[0, 0, 0]} // 카메라가 바라볼 중심 좌표
          //maxPolarAngle={Math.PI / 2} // 아래로 회전 제한
          //minDistance={10} // 최소 줌 거리
          //maxDistance={30} // 최대 줌 거리
        />
      </Canvas>
    </div>
  );
};
export default AreaTDViewer;
