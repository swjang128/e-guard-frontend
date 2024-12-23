interface CloseButtonProps {
  // primaryColor?: string;
  text: string;
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  additionalClasses?: string; // tailwind css 클래스형으로 옵션 추가 ((ex) md:block hidden)
  onClick?: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({
  // primaryColor = 'gray', // primaryColor 기본 gray
  text,
  size,
  disabled = false, // disabled 기본 false
  additionalClasses = '', // additionalClasses 기본 ''
  onClick = () => {},
}) => {
  let genratedSizeClass = '';

  switch (size) {
    case 'sm':
      genratedSizeClass = 'w-12 px-1';
      break;
    case 'md':
      genratedSizeClass = 'w-24 px-2';
      break;
    case 'lg':
      genratedSizeClass = 'w-40 px-4';
      break;
    default:
      throw new Error(
        "'size'가 올바르지 않습니다. : 'size'는 'sm','md','lg'만 선택할 수 있습니다."
      );
  }

  return (
    <button
      type="button" // hook form submit 방지
      className={`${genratedSizeClass} items-center rounded border border-stroke bg-gray hover:bg-opacity-90 hover:text-black dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-90 ${additionalClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
export default CloseButton;
