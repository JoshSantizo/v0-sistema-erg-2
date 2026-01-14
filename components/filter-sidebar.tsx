"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, X } from "lucide-react"
import { useState } from "react"
import type { ReactNode } from "react"

interface FilterSidebarProps {
  children: ReactNode
  onClearFilters: () => void
  filterCount?: number
}

export function FilterSidebar({ children, onClearFilters, filterCount = 0 }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar - Overlay from left */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="hidden lg:flex gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filtros
            {filterCount > 0 && (
              <span className="ml-1 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                {filterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[320px] overflow-y-auto px-6">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">{children}</div>
          <div className="mt-8">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                onClearFilters()
                setIsOpen(false)
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Sidebar - Right side */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="lg:hidden fixed bottom-4 right-4 z-50 rounded-full h-14 w-14 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Filter className="h-5 w-5" />
            {filterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full h-6 w-6 text-xs flex items-center justify-center font-semibold">
                {filterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[350px] overflow-y-auto px-6">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">{children}</div>
          <div className="mt-8">
            <Button variant="outline" className="w-full bg-transparent" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
