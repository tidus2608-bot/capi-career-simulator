import React from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../Modal.jsx'

export default function FeedbackInvitationModal({ isOpen, onClose, onAccept }) {
  const { t } = useTranslation()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('feedback.modal_header')}
      description={t('feedback.modal_content')}
      cancelText={t('feedback.modal_btn_no')}
      confirmText={t('feedback.modal_btn_survey')}
      onConfirm={onAccept}
      confirmVariant="primary"
    />
  )
}
