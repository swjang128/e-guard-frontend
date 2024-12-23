interface PrimaryButtonProps {
  // primaryColor?: string;
  text: string;
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  outline?: boolean;
  additionalClasses?: string; // tailwind css 클래스형으로 옵션 추가 ((ex) md:block hidden)
  onClick?: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  // primaryColor = 'primary', // primaryColor 기본 primary color
  text,
  size,
  disabled = false, // disabled 기본 false
  outline = true, // outline 기본 true
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
      className={`${genratedSizeClass} items-center rounded border text-center ${
        disabled
          ? ' border-stroke bg-gray dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-80'
          : outline
          ? 'border-primary bg-transparent text-primary hover:bg-primary hover:bg-opacity-80 hover:text-white dark:bg-primary dark:text-white'
          : 'border-primary bg-primary text-white hover:bg-opacity-80 hover:text-white dark:bg-primary dark:text-white'
      } ${additionalClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
export default PrimaryButton;
