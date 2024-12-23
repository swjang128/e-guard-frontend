interface ChipButtonProps {
  text: string;
  selected?: boolean;
  disabled?: boolean;
  additionalClasses?: string;
  onClick?: () => void;
}

const ChipButton: React.FC<ChipButtonProps> = ({
  selected = false,
  disabled = false,
  text,
  additionalClasses = '', // additionalClasses 기본 ''
  onClick = () => {},
}) => {
  return (
    <button
      type="button" // hook form submit 방지
      className={`flex items-center gap-2 rounded border px-4 py-2 shadow-2 outline-none transition ${
        disabled
          ? 'cursor-default border-stroke bg-slate-400 text-graydark opacity-30 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
          : selected
          ? 'cursor-pointer border-primary bg-primary py-2 pl-2 pr-4 text-white hover:bg-primary hover:opacity-70 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
          : 'cursor-pointer border-stroke bg-white hover:bg-primary hover:text-white hover:opacity-90 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
      } ${additionalClasses}`}
      onClick={onClick}
    >
      {selected && (
        <svg
          width="11"
          height="8"
          viewBox="0 0 11 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.16992 7.23438C3.89649 7.23438 3.66211 7.15625 3.42774 6.96094L0.849609 4.46094C0.576172 4.1875 0.576172 3.75781 0.849609 3.48438C1.12305 3.21094 1.55273 3.21094 1.82617 3.48438L4.16992 5.78906L9.16992 0.945312C9.44336 0.671875 9.87305 0.671875 10.1465 0.945312C10.4199 1.21875 10.4199 1.64844 10.1465 1.92188L4.95117 7C4.67774 7.15625 4.4043 7.23438 4.16992 7.23438Z"
            fill="white"
          />
        </svg>
      )}
      <span>{text}</span>
    </button>
  );
};
export default ChipButton;
