import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './lib/i18n/index.js'
import './styles.css'

import { WizardProvider } from './contexts/WizardContext.jsx'
import AppLayout from './App.jsx'
import IntroScene from './components/scenes/Intro.jsx'

// Route-level code-splitting for non-landing scenes
const ScanningScene = lazy(() => import('./components/scenes/Scanning.jsx'))
const RoleRevealScene = lazy(() => import('./components/scenes/RoleReveal.jsx'))
const ThemeScene = lazy(() => import('./components/scenes/Theme.jsx'))
const MissionPickScene = lazy(() => import('./components/scenes/MissionPick.jsx'))
const MissionPlayScene = lazy(() => import('./components/scenes/MissionPlay.jsx'))
const ReflectionScene = lazy(() => import('./components/scenes/Reflection.jsx'))
const CertificateScene = lazy(() => import('./components/scenes/Certificate.jsx'))
const ReportLoading = lazy(() => import('./components/scenes/ReportLoading.jsx'))
const ReportSummary = lazy(() => import('./components/scenes/ReportSummary.jsx'))
const ReportDetails = lazy(() => import('./components/scenes/ReportDetails.jsx'))
const HistoryScene = lazy(() => import('./components/scenes/History.jsx'))
const CompareResultsScene = lazy(() => import('./components/scenes/CompareResults.jsx'))
const CreditsScene = lazy(() => import('./components/scenes/Credits.jsx'))

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <WizardProvider>
        <AppLayout />
      </WizardProvider>
    ),
    children: [
      { path: '/', element: <IntroScene /> },
      { path: 'credits', element: <CreditsScene /> },
      { path: 'scan', element: <ScanningScene /> },
      { path: 'role-reveal', element: <RoleRevealScene /> },
      { path: 'theme', element: <ThemeScene /> },
      { path: 'mission-pick', element: <MissionPickScene /> },
      { path: 'mission-play', element: <MissionPlayScene /> },
      { path: 'reflect', element: <ReflectionScene /> },
      {
        path: 'certificate',
        element: <CertificateScene />,
        children: [
          { path: '', element: <Navigate to="loading" replace /> },
          { path: 'loading', element: <ReportLoading /> },
          { path: 'summary', element: <ReportSummary /> },
          { path: 'details', element: <ReportDetails /> },
        ],
      },
      { path: 'history', element: <HistoryScene /> },
      { path: 'history/compare', element: <CompareResultsScene /> },
      { path: 'compare', element: <CompareResultsScene /> },
    ],
  },
])

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Missing #root in index.html')

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
