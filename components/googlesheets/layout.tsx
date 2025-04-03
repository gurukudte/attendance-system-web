import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Props = {
  children: React.ReactNode
}

const GoogleSheetLayout = ({ children }: Props) => {
  const formulas = [
    {
      name: 'IMPORTRANGE',
      path: '/googlesheets'
    },
    // Add more formulas here as needed
  ]

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Google Sheets Formulas</h2>
          <nav className="space-y-2">
            {formulas.map((formula) => (
              <Link key={formula.path} href={formula.path}>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-bold"
                >
                  {formula.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Top navigation bar */}
        <nav className="h-14 border-b px-4 flex items-center bg-card">
          <h1 className="text-xl font-semibold">Google Sheets Formula Generator</h1>
        </nav>

        {/* Page content */}
        <main className="h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}

export default GoogleSheetLayout