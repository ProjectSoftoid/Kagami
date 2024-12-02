import React from 'react';
import styles from './Modal.module.scss';

interface ModalProps {
  isOpen: boolean; // 控制弹窗是否打开
  onClose: () => void; // 关闭弹窗的回调函数
  children: React.ReactNode; // 弹窗内容
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // 如果 isOpen 为 false，不渲染任何内容

    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()} // 阻止点击内容区域触发关闭
        >
          <button className={styles.closeButton} onClick={onClose}>
            ✖
          </button>
          {children}
        </div>
      </div>
    );
  };

  export default Modal;
