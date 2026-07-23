import { useMemo, useId } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useWizard } from '../../contexts/WizardContext.jsx'

export default function CertificateScene() {
  const navigate = useNavigate()
  const {
    user,
    scoringResult: result,
    certCopy,
    saveStatus,
    saveError,
    retrySave: onRetrySave,
    onRestart,
  } = useWizard()

  const handleRestart = () => {
    onRestart()
    navigate('/')
  }

  const rawId = useId()
  const certId = useMemo(() => {
    let h = 0
    for (const c of rawId) h = (h * 31 + c.charCodeAt(0)) | 0
    return 1000 + (Math.abs(h) % 9000)
  }, [rawId])
  const certDate = useMemo(() => new Date().toISOString().slice(0, 10), [])

  if (!result || !certCopy) return <Navigate to="/" replace />

  return (
    <Outlet 
      context={{ 
        user, 
        result, 
        certCopy, 
        certId, 
        certDate, 
        saveStatus, 
        saveError, 
        onRetrySave, 
        onRestart: handleRestart 
      }} 
    />
  )
}
