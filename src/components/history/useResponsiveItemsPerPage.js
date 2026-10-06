import { useState, useEffect } from 'react'

/** Cards per page for the history grid, by viewport width. */
export function useResponsiveItemsPerPage() {
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (typeof window === 'undefined') return 6
    if (window.innerWidth < 640) return 3
    if (window.innerWidth < 1024) return 4
    return 6
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setItemsPerPage(3)
      else if (width < 1024) setItemsPerPage(4)
      else setItemsPerPage(6)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return itemsPerPage
}
