interface ThumbnailItemProps {
  onClick: () => void;
  bgFileUri: string;
  title: string;
  subTitle: string;
  useEtcCase?: boolean;
  isEtcCondition?: boolean;
  trueNode?: React.ReactNode;
  falseNode?: React.ReactNode;
}

const ThumbnailItem: React.FC<ThumbnailItemProps> = ({
  onClick,
  bgFileUri,
  title,
  subTitle,
  useEtcCase = false,
  isEtcCondition,
  trueNode = <></>,
  falseNode = <></>,
}) => {
  return (
    <div
      className="grid-row grid cursor-pointer rounded border border-slate-300 shadow-2 hover:opacity-80 md:h-100"
      onClick={onClick}
    >
      <div
        className="border-b border-stroke bg-gray"
        style={{
          height: '300px',
          width: 'inherit',
          backgroundImage: `url('${bgFileUri}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      ></div>
      <div className="px-3 py-3 text-sm text-black">
        <p className="text-base font-semibold">{title}</p>
        <p>{subTitle}</p>
        {useEtcCase && (isEtcCondition ? <>{trueNode}</> : <>{falseNode}</>)}
      </div>
    </div>
  );
};
export default ThumbnailItem;
