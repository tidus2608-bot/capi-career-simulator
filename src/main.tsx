import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './i18n/index.js'
import './styles.css'

import { WizardProvider } from './contexts/WizardContext.jsx'
import AppLayout from './App.jsx'
import {
  IntroScene,
  ScanningScene,
  RoleRevealScene,
  ThemeScene,
  MissionPickScene,
  MissionPlayScene,
  ReflectionScene,
  CertificateScene,
  ReportLoading,
  ReportSummary,
  ReportDetails,
  HistoryScene,
  CapiGeneInfoScene,
} from './components/scenes/index.js'

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
      { path: 'capi-gene-info', element: <CapiGeneInfoScene /> },
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
        ]
      },
      { path: 'history', element: <HistoryScene /> },
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
