"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getUserSession } from "@/lib/auth"
import { Search } from "lucide-react"
import { FilterSidebar } from "@/components/filter-sidebar"

interface Persona {
  id: number
  nombre: string
  lider: string
  liderSubred: string
  completado: boolean
}

export default function ProcesoVisionPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [selectedEtapa, setSelectedEtapa] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [filterLiderSubred, setFilterLiderSubred] = useState<string>("all")
  const [filterLider, setFilterLider] = useState<string>("all")
  const [filterEstado, setFilterEstado] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const user = getUserSession()
    if (user) {
      setUserRole(user.role)
    }
  }, [])

  const etapas = [
    {
      nombre: "Retiro de Bienvenida",
      duracion: "1 día",
      aprobados: 45,
      pendientes: 12,
      progreso: 78,
    },
    {
      nombre: "Escuela de Miembros",
      duracion: "3 meses",
      aprobados: 38,
      pendientes: 8,
      progreso: 65,
    },
    {
      nombre: "Retiro de Miembros",
      duracion: "1 día",
      aprobados: 38,
      pendientes: 8,
      progreso: 65,
    },
    {
      nombre: "Escuela de Discipulos",
      duracion: "3 meses",
      aprobados: 32,
      pendientes: 10,
      progreso: 60,
    },
    {
      nombre: "Retiro de Discipulos",
      duracion: "1 día",
      aprobados: 30,
      pendientes: 5,
      progreso: 58,
    },
    {
      nombre: "Escuela de Líderes I",
      duracion: "3 meses",
      aprobados: 25,
      pendientes: 15,
      progreso: 52,
    },
    {
      nombre: "Escuela de Líderes II",
      duracion: "3 meses",
      aprobados: 22,
      pendientes: 8,
      progreso: 48,
    },
    {
      nombre: "Retiro de Líderes",
      duracion: "1 día",
      aprobados: 20,
      pendientes: 5,
      progreso: 42,
    },
  ]

  const personasPorEtapa: Record<string, Persona[]> = {
    "Retiro de Bienvenida": [
      { id: 1, nombre: "María López", lider: "Daniela Juarez", liderSubred: "Josué Santizo", completado: true },
      { id: 2, nombre: "Carlos Méndez", lider: "Alejandro Miranda", liderSubred: "Josué Santizo", completado: true },
      { id: 3, nombre: "Ana García", lider: "Samuel López", liderSubred: "Josué Santizo", completado: false },
      { id: 4, nombre: "Pedro Ramírez", lider: "Daniela Juarez", liderSubred: "Josué Santizo", completado: true },
      { id: 5, nombre: "Lucía Fernández", lider: "Alejandro Miranda", liderSubred: "Angel Orozco", completado: false },
    ],
  }

  const lideresSubred = [
    { value: "Josué Santizo", label: "Josué Santizo" },
    { value: "Angel Orozco", label: "Angel Orozco" },
  ]

  const lideres = [
    { value: "Daniela Juarez", label: "Daniela Juarez" },
    { value: "Alejandro Miranda", label: "Alejandro Miranda" },
    { value: "Samuel López", label: "Samuel López" },
  ]

  const handleVerDetalles = (etapa: string) => {
    setSelectedEtapa(etapa)
    setShowDetails(true)
  }

  const getFilteredPersonas = () => {
    if (!selectedEtapa) return []
    const personas = personasPorEtapa[selectedEtapa] || []

    return personas.filter((persona) => {
      const matchesLiderSubred = filterLiderSubred === "all" || persona.liderSubred === filterLiderSubred
      const matchesLider = filterLider === "all" || persona.lider === filterLider
      const matchesEstado =
        filterEstado === "all" ||
        (filterEstado === "completado" && persona.completado) ||
        (filterEstado === "pendiente" && !persona.completado)
      const matchesSearch = searchQuery === "" || persona.nombre.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesLiderSubred && matchesLider && matchesEstado && matchesSearch
    })
  }

  const clearFilters = () => {
    setFilterLiderSubred("all")
    setFilterLider("all")
    setFilterEstado("all")
    setSearchQuery("")
  }

  const activeFilterCount = [
    filterLiderSubred !== "all",
    filterLider !== "all",
    filterEstado !== "all",
    searchQuery !== "",
  ].filter(Boolean).length

  return (
    <div className="container mx-auto p-4 lg:p-6">
      {!showDetails ? (
        <>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Proceso de la Visión</h1>
            <p className="text-muted-foreground mt-2">Seguimiento del proceso de discipulado</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {etapas.map((etapa) => (
              <Card key={etapa.nombre} className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">{etapa.nombre}</CardTitle>
                  <CardDescription className="text-muted-foreground">Duración: {etapa.duracion}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {userRole === "Lider de Subred" ? "Aprobados (Subred)" : "Aprobados"}
                      </p>
                      <p className="text-2xl font-bold text-foreground">{etapa.aprobados}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pendientes</p>
                      <p className="text-2xl font-bold text-accent">{etapa.pendientes}</p>
                    </div>
                  </div>
                  {userRole !== "Lider de Subred" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="text-foreground font-medium">{etapa.progreso}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full transition-all"
                          style={{ width: `${etapa.progreso}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleVerDetalles(etapa.nombre)}
                  >
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 lg:flex-shrink-0">
            <FilterSidebar onClearFilters={clearFilters} filterCount={activeFilterCount}>
              {userRole === "Administración" && (
                <>
                  <div>
                    <Label>Líder de Subred</Label>
                    <Select value={filterLiderSubred} onValueChange={setFilterLiderSubred}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Josué Santizo">Josué Santizo</SelectItem>
                        <SelectItem value="María Rodríguez">María Rodríguez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Líder</Label>
                    <Select value={filterLider} onValueChange={setFilterLider}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Daniela Juarez">Daniela Juarez</SelectItem>
                        <SelectItem value="Marco Antonio López">Marco Antonio López</SelectItem>
                        <SelectItem value="Sofia García">Sofia García</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {userRole === "Lider de Subred" && (
                <div>
                  <Label>Líder</Label>
                  <Select value={filterLider} onValueChange={setFilterLider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Daniela Juarez">Daniela Juarez</SelectItem>
                      <SelectItem value="Marco Antonio López">Marco Antonio López</SelectItem>
                      <SelectItem value="Sofia García">Sofia García</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label>Estado</Label>
                <Select value={filterEstado} onValueChange={setFilterEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Búsqueda</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar personas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </FilterSidebar>
          </aside>

          <main className="flex-1 min-w-0">
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Detalles: {selectedEtapa}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-3 min-h-[400px]">
                    <h3 className="font-semibold text-foreground">Personas ({getFilteredPersonas().length})</h3>
                    {getFilteredPersonas().length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No se encontraron personas con los filtros seleccionados
                      </p>
                    ) : (
                      getFilteredPersonas().map((persona) => (
                        <div
                          key={persona.id}
                          className="p-4 rounded-lg border border-border flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-foreground">{persona.nombre}</p>
                            <p className="text-sm text-muted-foreground">
                              Líder: {persona.lider}
                              {userRole === "Administración" && ` | Líder de Subred: ${persona.liderSubred}`}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              persona.completado
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {persona.completado ? "Completado" : "Pendiente"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </main>
        </div>
      )}
    </div>
  )
}
