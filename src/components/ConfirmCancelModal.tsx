// ConfirmCancelModal.js
import React from 'react';
import Modal from '../Modal';
import { t } from 'i18next';
import PrimaryButton from './Buttons/PrimaryButton';
import CloseButton from './Buttons/CloseButton';

interface ConfirmCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title: string;
}

const ConfirmCancelModal: React.FC<ConfirmCancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          {title}
        </h3>
      </div>
      <div className="px-5 py-4">
        <p className="mb-7.5 text-black dark:text-white">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <PrimaryButton
            text="실행"
            size="md"
            outline={false}
            additionalClasses="h-10"
            onClick={onConfirm}
          />
          <CloseButton
            text="닫기"
            size="md"
            additionalClasses="h-10"
            onClick={onClose}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmCancelModal;
