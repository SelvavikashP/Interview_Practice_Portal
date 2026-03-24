'use client'

import { useEffect, useState, useRef, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export function ProctorWrapper({ children }: { children: ReactNode }) {
  const [warnings, setWarnings] = useState(0)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [violationMsg, setViolationMsg] = useState('')
  const router = useRouter()

  const MAX_WARNINGS = 3

  // Camera stream — started when assessment starts, stopped on unmount
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    // Start camera + mic recording when the assessment page mounts
    async function startProctoring() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        streamRef.current = s
      } catch (err) {
        console.warn('Proctoring camera/mic unavailable:', err)
      }
    }
    startProctoring()

    // Cleanup — stop ALL tracks when assessment page is left
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  // Violation detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) triggerWarning('Tab switching or minimizing window is not allowed.')
    }
    const handleBlur = () => {
      triggerWarning('Moving focus away from the assessment window is not allowed.')
    }
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) triggerWarning('Exiting fullscreen is not allowed.')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [warnings])

  const triggerWarning = (msg: string) => {
    const newWarnings = warnings + 1

    if (newWarnings >= MAX_WARNINGS) {
      // Stop camera + mic immediately on termination
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }
      router.replace('/dashboard?error=violation_terminated')
      return
    }

    setWarnings(newWarnings)
    setViolationMsg(msg)
    setShowWarningModal(true)
  }

  const handleAcknowledge = () => {
    setShowWarningModal(false)
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    }
  }

  return (
    <>
      {children}

      <Dialog open={showWarningModal}>
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            <div className="mx-auto bg-amber-100 text-amber-600 p-3 rounded-full mb-4 dark:bg-amber-900/30 dark:text-amber-500">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <DialogTitle className="text-center text-xl">Proctoring Warning</DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              {violationMsg}
              <br /><br />
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                Warning {warnings} of {MAX_WARNINGS - 1}.
              </span>
              <br />
              Further violations may result in automatic termination of the test.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-6">
            <Button type="button" onClick={handleAcknowledge}>
              I Understand, Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
