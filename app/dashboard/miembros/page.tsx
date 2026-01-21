"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { getUserSession } from "@/lib/auth"
import { Search, ArrowUpDown } from "lucide-react"
import { normalizeText } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { FilterSidebar } from "@/components/filter-sidebar"

const MINISTERIOS_LISTA = [
  "Anfitrión",
  "Evangelismo",
  "Fotografía",
  "Iluminación",
  "Pantallas y Produción",
  "Parqueo",
  "Servidores",
  "Sonido",
  "Televisión",
  "Adulto Mayor",
  "Alabanza",
  "Cocina",
  "Danza",
  "Escudero",
  "Maestro de niños",
  "Oración",
  "Protocolo",
  "Sublider",
  "Transporte",
  "Anciano",
  "Diácono",
  "Equipo Pastoral",
  "Liberación",
  "Liderzgo",
  "Maestro de Escuela",
]

interface ProcesoVision {
  bautizo: "Completado" | "Pendiente"
  retiroBienvenida: "Completado" | "Pendiente"
  escuelaMiembros: "Completado" | "Pendiente"
  retiroMiembros: "Completado" | "Pendiente"
  escuelaDiscipulos: "Completado" | "Pendiente"
  retiroDiscipulos: "Completado" | "Pendiente"
  escuelaLideresI: "Completado" | "Pendiente"
  escuelaLideresII: "Completado" | "Pendiente"
  retiroLideres: "Completado" | "Pendiente"
}

interface Miembro {
  id: number
  nombre: string
  telefono: string
  direccion: string
  referencia: string
  fechaNacimiento: string
  edad: number
  sexo: "Masculino" | "Femenino"
  fechaBoda?: string
  fechaConversion: string
  // Added fechaBautizo field
  fechaBautizo?: string
  ministerios: string[]
  procesoVision: ProcesoVision
  lider?: string
  // Added liderSubred and estado fields
  liderSubred?: string
  estado?: "Activo" | "Inactivo"
  // Added casaDePaz field
  casaDePaz?: string
}

// Casas de Paz mock data
const CASAS_DE_PAZ = [
  { id: 1, nombre: "Casa de Paz Zona 10", lider: "Daniela Juarez" },
  { id: 2, nombre: "Casa de Paz Zona 15", lider: "Daniela Juarez" },
  { id: 3, nombre: "Casa de Paz Zona 1", lider: "Alejandro Miranda" },
  { id: 4, nombre: "Casa de Paz Zona 5", lider: "Alejandro Miranda" },
  { id: 5, nombre: "Casa de Paz Zona 12", lider: "Samuel López" },
]

// Líderes de Subred
const LIDERES_SUBRED = ["Josué Santizo", "Carlos Ramírez", "Ana Martínez"]

// Mapping of Líderes de Subred to their Líderes
const LIDERES_POR_SUBRED: Record<string, string[]> = {
  "Josué Santizo": ["Daniela Juarez", "Alejandro Miranda", "Samuel López"],
  "Carlos Ramírez": ["Marco Antonio López", "Sofia García"],
  "Ana Martínez": ["Laura Pérez", "Miguel Torres"],
}

// Placeholder function to simulate getting user session data
// async function getUserSession() {
//   // In a real app, this would fetch user session from an API or context
//   return { role: "Lider de Subred", name: "Admin User" };
// }

export default function MiembrosPage() {
  const [miembros, setMiembros] = useState<Miembro[]>([
    {
      id: 1,
      nombre: "María López",
      fechaNacimiento: "1990-03-15",
      telefono: "5555-1234",
      direccion: "Zona 10, Ciudad",
      referencia: "Cerca del centro comercial",
      edad: 34,
      sexo: "Femenino",
      lider: "Daniela Juarez",
      liderSubred: "Josué Santizo",
      ministerios: ["Alabanza", "Servidores"],
      fechaConversion: "2020-05-10",
      fechaBautizo: "2020-06-15",
      estado: "Activo",
      casaDePaz: "Casa de Paz Zona 10",
      procesoVision: {
        bautizo: "Completado",
        retiroBienvenida: "Completado",
        escuelaMiembros: "Completado",
        retiroMiembros: "Completado",
        escuelaDiscipulos: "Pendiente",
        retiroDiscipulos: "Pendiente",
        escuelaLideresI: "Pendiente",
        escuelaLideresII: "Pendiente",
        retiroLideres: "Pendiente",
      },
    },
    {
      id: 2,
      nombre: "Carlos Méndez",
      fechaNacimiento: "1985-07-22",
      telefono: "5555-5678",
      direccion: "Zona 15, Ciudad",
      referencia: "Edificio azul",
      edad: 39,
      sexo: "Masculino",
      lider: "Daniela Juarez",
      liderSubred: "Josué Santizo",
      ministerios: ["Oración", "Liderazgo"],
      fechaConversion: "2019-03-20",
      fechaBautizo: "2019-04-25",
      estado: "Activo",
      casaDePaz: "Casa de Paz Zona 15",
      procesoVision: {
        bautizo: "Completado",
        retiroBienvenida: "Completado",
        escuelaMiembros: "Completado",
        retiroMiembros: "Completado",
        escuelaDiscipulos: "Completado",
        retiroDiscipulos: "Completado",
        escuelaLideresI: "Completado",
        escuelaLideresII: "Pendiente",
        retiroLideres: "Pendiente",
      },
    },
    {
      id: 3,
      nombre: "Ana García",
      fechaNacimiento: "1992-11-08",
      telefono: "5555-9012",
      direccion: "Zona 1, Ciudad",
      referencia: "Casa verde",
      edad: 32,
      sexo: "Femenino",
      lider: "Alejandro Miranda",
      liderSubred: "Josué Santizo",
      ministerios: ["Televisión"],
      fechaConversion: "2021-01-15",
      fechaBautizo: "2021-02-20",
      estado: "Activo",
      casaDePaz: "Casa de Paz Zona 1",
      procesoVision: {
        bautizo: "Completado",
        retiroBienvenida: "Completado",
        escuelaMiembros: "Completado",
        retiroMiembros: "Completado",
        escuelaDiscipulos: "Completado",
        retiroDiscipulos: "Completado",
        escuelaLideresI: "Completado",
        escuelaLideresII: "Pendiente",
        retiroLideres: "Pendiente",
      },
    },
    {
      id: 4,
      nombre: "Pedro Ramírez",
      fechaNacimiento: "1988-01-30",
      telefono: "5555-3456",
      direccion: "Zona 5, Ciudad",
      referencia: "Frente al parque",
      edad: 36,
      sexo: "Masculino",
      lider: "Alejandro Miranda",
      liderSubred: "Josué Santizo",
      ministerios: ["Maestro de niños", "Alabanza"],
      fechaConversion: "2018-08-10",
      fechaBautizo: "2018-09-15",
      estado: "Inactivo",
      casaDePaz: "Casa de Paz Zona 5",
      procesoVision: {
        bautizo: "Completado",
        retiroBienvenida: "Completado",
        escuelaMiembros: "Completado",
        retiroMiembros: "Completado",
        escuelaDiscipulos: "Completado",
        retiroDiscipulos: "Completado",
        escuelaLideresI: "Completado",
        escuelaLideresII: "Pendiente",
        retiroLideres: "Pendiente",
      },
    },
    {
      id: 5,
      nombre: "Lucía Fernández",
      fechaNacimiento: "1995-05-12",
      telefono: "5555-7890",
      direccion: "Zona 12, Ciudad",
      referencia: "Atrás de la gasolinera",
      edad: 29,
      sexo: "Femenino",
      lider: "Samuel López",
      liderSubred: "Josué Santizo",
      ministerios: ["Anfitrión", "Liderazgo"],
      fechaConversion: "2022-03-05",
      fechaBautizo: "2022-04-10",
      estado: "Activo",
      casaDePaz: "Casa de Paz Zona 12",
      procesoVision: {
        bautizo: "Completado",
        retiroBienvenida: "Completado",
        escuelaMiembros: "Completado",
        retiroMiembros: "Completado",
        escuelaDiscipulos: "Completado",
        retiroDiscipulos: "Completado",
        escuelaLideresI: "Completado",
        escuelaLideresII: "Pendiente",
        retiroLideres: "Pendiente",
      },
    },
  ])

  const [selectedMember, setSelectedMember] = useState<Miembro | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const [editNombre, setEditNombre] = useState("")
  const [editTelefono, setEditTelefono] = useState("")
  const [editDireccion, setEditDireccion] = useState("")
  const [editReferencia, setEditReferencia] = useState("")
  const [editFechaNacimiento, setEditFechaNacimiento] = useState("")
  const [editSexo, setEditSexo] = useState<"Masculino" | "Femenino">("Masculino")
  const [editFechaConversion, setEditFechaConversion] = useState("")
  const [editFechaBautizo, setEditFechaBautizo] = useState("")
  const [editFechaBoda, setEditFechaBoda] = useState("")
  const [editLider, setEditLider] = useState("")
  const [editLiderSubred, setEditLiderSubred] = useState("")
  const [editEstado, setEditEstado] = useState<"Activo" | "Inactivo">("Activo")

  const [editProcesoVision, setEditProcesoVision] = useState<ProcesoVision | null>(null)

  const [editMinisterios, setEditMinisterios] = useState<string[]>([])

  const [newMember, setNewMember] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    referencia: "",
    fechaNacimiento: "",
    sexo: "Masculino" as "Masculino" | "Femenino",
    fechaBoda: "",
    fechaConversion: "",
    // Added fechaBautizo field
    fechaBautizo: "",
    liderSubred: "",
    lider: "",
    ministerios: [] as string[],
    casaDePaz: "",
  })

  const [userRole, setUserRole] = useState<string | null>(null)
  // Added userName state
  const [userName, setUserName] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [filterLider, setFilterLider] = useState<string>("all")
  const [filterLiderSubred, setFilterLiderSubred] = useState<string>("all")
  const [filterSexo, setFilterSexo] = useState<string>("all")
  const [filterEdad, setFilterEdad] = useState<string>("all")
  // Changed filterMes to filterMonth
  const [filterMonth, setFilterMonth] = useState<string>("all")
  const [filterMinisterio, setFilterMinisterio] = useState<string>("all")
  const [filterEstado, setFilterEstado] = useState<string>("all")
  const [filterAsistencia, setFilterAsistencia] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<"nombre" | "fechaNacimiento">("nombre")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const itemsPerPage = 10

  const { toast } = useToast()

  useEffect(() => {
    const user = getUserSession()
    if (user) {
      setUserRole(user.role)
      // Set userName from session
      setUserName(user.name)
    }
  }, [])

  const calculateAge = (fechaNacimiento: string): number => {
    const today = new Date()
    const birthDate = new Date(fechaNacimiento)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const matchesAgeCategory = (edad: number, category: string): boolean => {
    switch (category) {
      case "ninos":
        return edad >= 0 && edad <= 12
      case "adolescentes":
        return edad >= 13 && edad <= 17
      case "jovenes":
        return edad >= 18 && edad <= 25
      case "tercera_edad":
        return edad > 60
      case "all":
      default:
        return true
    }
  }

  const sortedMiembros = [...miembros].sort((a, b) => {
    if (sortColumn === "nombre") {
      const comparison = a.nombre.localeCompare(b.nombre)
      return sortDirection === "asc" ? comparison : -comparison
    } else {
      const dateA = new Date(a.fechaNacimiento)
      const dateB = new Date(b.fechaNacimiento)
      const monthA = dateA.getMonth()
      const monthB = dateB.getMonth()
      const dayA = dateA.getDate()
      const dayB = dateB.getDate()

      // Compare months first
      if (monthA !== monthB) {
        return sortDirection === "desc" ? monthB - monthA : monthA - monthB
      }
      // If same month, compare days
      return sortDirection === "desc" ? dayB - dayA : dayA - dayB
    }
  })

  // Updated lideres list to match sample data names
  const lideres = [
    { value: "Daniela Juarez", label: "Daniela Juarez" },
    { value: "Alejandro Miranda", label: "Alejandro Miranda" },
    { value: "Samuel López", label: "Samuel López" },
  ]

  // Added lideresSubred list
  const lideresSubred = [{ value: "Josué Santizo", label: "Josué Santizo" }]

  const meses = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ]

  let filteredMiembros = sortedMiembros

  if (searchQuery) {
    filteredMiembros = filteredMiembros.filter((miembro) =>
      normalizeText(miembro.nombre).includes(normalizeText(searchQuery)),
    )
  }

  if (userRole === "Lider") {
    filteredMiembros = filteredMiembros.filter((miembro) => {
      const fechaNac = new Date(miembro.fechaNacimiento)
      const mes = (fechaNac.getMonth() + 1).toString()
      const edad = calculateAge(miembro.fechaNacimiento)

      const matchesSexo = filterSexo === "all" || miembro.sexo === filterSexo
      const matchesMes = filterMonth === "all" || mes === filterMonth
      const matchesMinisterio = filterMinisterio === "all" || miembro.ministerios.includes(filterMinisterio)
      const matchesEdad = matchesAgeCategory(edad, filterEdad)

      return matchesSexo && matchesMes && matchesMinisterio && matchesEdad
    })
  } else if (userRole === "Lider de Subred") {
    filteredMiembros = filteredMiembros.filter((miembro) => {
      const fechaNac = new Date(miembro.fechaNacimiento)
      const mes = (fechaNac.getMonth() + 1).toString()
      const edad = calculateAge(miembro.fechaNacimiento)

      const matchesLider = filterLider === "all" || miembro.lider === filterLider
      const matchesSexo = filterSexo === "all" || miembro.sexo === filterSexo
      const matchesMes = filterMonth === "all" || mes === filterMonth
      const matchesMinisterio = filterMinisterio === "all" || miembro.ministerios.includes(filterMinisterio)
      const matchesEdad = matchesAgeCategory(edad, filterEdad)

      return matchesLider && matchesSexo && matchesMes && matchesMinisterio && matchesEdad
    })
  } else if (userRole === "Administración") {
    filteredMiembros = filteredMiembros.filter((miembro) => {
      const fechaNac = new Date(miembro.fechaNacimiento)
      const mes = (fechaNac.getMonth() + 1).toString()
      const edad = calculateAge(miembro.fechaNacimiento)

      const matchesLiderSubred = filterLiderSubred === "all" || miembro.liderSubred === filterLiderSubred
      const matchesLider = filterLider === "all" || miembro.lider === filterLider
      const matchesSexo = filterSexo === "all" || miembro.sexo === filterSexo
      const matchesMes = filterMonth === "all" || mes === filterMonth
      const matchesMinisterio = filterMinisterio === "all" || miembro.ministerios.includes(filterMinisterio)
      const matchesEstado = filterEstado === "all" || miembro.estado === filterEstado
      const matchesEdad = matchesAgeCategory(edad, filterEdad)
      const matchesAsistencia =
        filterAsistencia === "all" ||
        (filterAsistencia === "asiste" && miembro.casaDePaz) ||
        (filterAsistencia === "no_asiste" && !miembro.casaDePaz)

      return (
        matchesLiderSubred &&
        matchesLider &&
        matchesSexo &&
        matchesMes &&
        matchesMinisterio &&
        matchesEstado &&
        matchesEdad &&
        matchesAsistencia
      )
    })
  }
  // For Lider role, no specific filters are applied here, but search query might be relevant (though not implemented in this snippet for Lider role)

  const totalPages = Math.ceil(filteredMiembros.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMiembros =
    userRole === "Lider" || userRole === "Lider de Subred"
      ? filteredMiembros.slice(startIndex, startIndex + itemsPerPage)
      : userRole === "Administración"
        ? filteredMiembros.slice(startIndex, startIndex + 20)
        : filteredMiembros

  const handleViewDetails = (miembro: Miembro) => {
    setSelectedMember(miembro)
    setEditNombre(miembro.nombre)
    setEditTelefono(miembro.telefono)
    setEditDireccion(miembro.direccion)
    setEditReferencia(miembro.referencia)
    setEditFechaNacimiento(miembro.fechaNacimiento)
    setEditSexo(miembro.sexo)
    setEditFechaConversion(miembro.fechaConversion)
    setEditFechaBautizo(miembro.fechaBautizo || "")
    setEditFechaBoda(miembro.fechaBoda || "")
    setEditLider(miembro.lider || "")
    setEditLiderSubred(miembro.liderSubred || "")
    setEditEstado(miembro.estado || "Activo")
    setEditProcesoVision(miembro.procesoVision)
    setEditMinisterios(miembro.ministerios)
    setEditMode(false)
    setDetailsOpen(true)
  }

  const handleUpdate = () => {
    if (selectedMember) {
      try {
        if (userRole === "Administración" && editProcesoVision) {
          const edad = new Date().getFullYear() - new Date(editFechaNacimiento).getFullYear()
          setMiembros(
            miembros.map((m) =>
              m.id === selectedMember.id
                ? {
                    ...m,
                    nombre: editNombre,
                    telefono: editTelefono,
                    direccion: editDireccion,
                    referencia: editReferencia,
                    fechaNacimiento: editFechaNacimiento,
                    edad: edad,
                    sexo: editSexo,
                    fechaConversion: editFechaConversion,
                    fechaBautizo: editFechaBautizo || undefined,
                    fechaBoda: editFechaBoda || undefined,
                    lider: editLider,
                    liderSubred: editLiderSubred,
                    estado: editEstado,
                    procesoVision: editProcesoVision,
                    ministerios: editMinisterios,
                  }
                : m,
            ),
          )
        } else if (userRole === "Lider de Subred") {
          const edad = new Date().getFullYear() - new Date(editFechaNacimiento).getFullYear()
          setMiembros(
            miembros.map((m) =>
              m.id === selectedMember.id
                ? {
                    ...m,
                    nombre: editNombre,
                    telefono: editTelefono,
                    direccion: editDireccion,
                    referencia: editReferencia,
                    fechaNacimiento: editFechaNacimiento,
                    edad: edad,
                    sexo: editSexo,
                    fechaConversion: editFechaConversion,
                    fechaBautizo: editFechaBautizo || undefined,
                    fechaBoda: editFechaBoda || undefined,
                  }
                : m,
            ),
          )
        } else {
          setMiembros(
            miembros.map((m) =>
              m.id === selectedMember.id
                ? { ...m, telefono: editTelefono, direccion: editDireccion, referencia: editReferencia }
                : m,
            ),
          )
        }
        setEditMode(false)
        setDetailsOpen(false)

        toast({
          title: "¡Éxito!",
          description: `Los datos de ${selectedMember.nombre} han sido actualizados correctamente`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Ocurrió un error al actualizar el miembro. Por favor intenta de nuevo.",
          variant: "destructive",
        })
      }
    }
  }

  const handleDelete = (id: number) => {
    setMemberToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (memberToDelete) {
      const memberName = miembros.find((m) => m.id === memberToDelete)?.nombre || "El miembro"
      try {
        setMiembros(miembros.filter((m) => m.id !== memberToDelete))
        setDeleteDialogOpen(false)
        setDetailsOpen(false)
        setMemberToDelete(null)

        toast({
          title: "Miembro eliminado",
          description: `${memberName} ha sido eliminado correctamente`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Ocurrió un error al eliminar el miembro. Por favor intenta de nuevo.",
          variant: "destructive",
        })
      }
    }
  }

  const handleCreateMember = () => {
    try {
      // Validation
      if (!newMember.nombre || !newMember.telefono || !newMember.fechaNacimiento || !newMember.fechaConversion) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos obligatorios",
          variant: "destructive",
        })
        return
      }

      const edad = new Date().getFullYear() - new Date(newMember.fechaNacimiento).getFullYear()
      const nuevoMiembro: Miembro = {
        id: Math.max(...miembros.map((m) => m.id), 0) + 1,
        nombre: newMember.nombre,
        telefono: newMember.telefono,
        direccion: newMember.direccion,
        referencia: newMember.referencia,
        fechaNacimiento: newMember.fechaNacimiento,
        edad,
        sexo: newMember.sexo,
        fechaBoda: newMember.fechaBoda || undefined,
        fechaConversion: newMember.fechaConversion,
        // Added fechaBautizo
        fechaBautizo: newMember.fechaBautizo || undefined,
        ministerios: newMember.ministerios,
        // Removed lider selector, now auto-assigned for Lider role. Also, ensure leader is set for other roles if provided.
        lider: userRole === "Lider" ? userName || "" : newMember.lider,
        // Set liderSubred for Admin role
        liderSubred: userRole === "Administración" ? newMember.liderSubred || undefined : undefined,
        // Set estado to "Activo" by default
        estado: "Activo",
        // Set casaDePaz from form
        casaDePaz: newMember.casaDePaz || undefined,
        procesoVision: {
          bautizo: "Pendiente",
          retiroBienvenida: "Pendiente",
          escuelaMiembros: "Pendiente",
          retiroMiembros: "Pendiente",
          escuelaDiscipulos: "Pendiente",
          retiroDiscipulos: "Pendiente",
          escuelaLideresI: "Pendiente",
          escuelaLideresII: "Pendiente",
          retiroLideres: "Pendiente",
        },
        // liderSubred field is not set here, assuming it's managed elsewhere or for Admins
      }
      setMiembros([...miembros, nuevoMiembro])
      // Use setShowAddDialog instead of setCreateDialogOpen
      setShowAddDialog(false)
      setNewMember({
        nombre: "",
        telefono: "",
        direccion: "",
        referencia: "",
        fechaNacimiento: "",
        sexo: "Masculino",
        fechaBoda: "",
        fechaConversion: "",
        // Reset fechaBautizo
        fechaBautizo: "",
        liderSubred: "",
        lider: "",
        ministerios: [],
        casaDePaz: "",
      })

      // Show success notification
      toast({
        title: "¡Éxito!",
        description: `El miembro ${nuevoMiembro.nombre} ha sido creado correctamente`,
      })
    } catch (error) {
      // Show error notification
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el miembro. Por favor intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  // Added toggle function for checkbox handling
  const toggleMinisterio = (ministerio: string) => {
    setNewMember((prev) => ({
      ...prev,
      ministerios: prev.ministerios.includes(ministerio)
        ? prev.ministerios.filter((m) => m !== ministerio)
        : [...prev.ministerios, ministerio],
    }))
  }

  const toggleEditMinisterio = (ministerio: string) => {
    setEditMinisterios((prev) =>
      prev.includes(ministerio) ? prev.filter((m) => m !== ministerio) : [...prev, ministerio],
    )
  }

  const clearFilters = () => {
    setFilterMonth("all")
    setFilterMinisterio("all")
    setFilterSexo("all")
    setFilterLider("all")
    setFilterEstado("all")
    setSearchQuery("")
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setFilterLider("all")
    setFilterLiderSubred("all")
    setFilterSexo("all")
    setFilterMonth("all")
    setFilterMinisterio("all")
    setFilterEstado("all")
    setFilterEdad("all")
    setFilterAsistencia("all")
    setCurrentPage(1)
  }

  const activeFilterCount = [
    filterMonth !== "all",
    filterMinisterio !== "all",
    filterSexo !== "all",
    filterLider !== "all",
    filterLiderSubred !== "all",
    filterEstado !== "all",
    filterEdad !== "all",
    filterAsistencia !== "all",
    searchQuery !== "",
  ].filter(Boolean).length

  const toggleSort = (column: "nombre" | "fechaNacimiento") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection(column === "nombre" ? "asc" : "desc")
    }
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <div className="space-y-6">
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Miembros</h1>
              <p className="text-muted-foreground mt-2">Información de los miembros de tu Casa de Paz</p>
            </div>
            <div className="flex items-center gap-3">
              <FilterSidebar onClearFilters={clearAllFilters} filterCount={activeFilterCount}>
                {/* Líder de Subred filter for Administración only */}
                {userRole === "Administración" && (
                  <div className="space-y-2">
                    <Label>Líder de Subred</Label>
                    <Select value={filterLiderSubred} onValueChange={setFilterLiderSubred}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los líderes de subred" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los líderes de subred</SelectItem>
                        <SelectItem value="Josué Santizo">Josué Santizo</SelectItem>
                        <SelectItem value="Carlos Ramírez">Carlos Ramírez</SelectItem>
                        <SelectItem value="Ana Martínez">Ana Martínez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Líder filter for Líder de Subred and Administración */}
                {(userRole === "Lider de Subred" || userRole === "Administración") && (
                  <div className="space-y-2">
                    <Label>Líder</Label>
                    <Select value={filterLider} onValueChange={setFilterLider}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los líderes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los líderes</SelectItem>
                        <SelectItem value="Daniela Juarez">Daniela Juarez</SelectItem>
                        <SelectItem value="Marco Antonio López">Marco Antonio López</SelectItem>
                        <SelectItem value="Sofia García">Sofia García</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Month filter for all roles */}
                <div className="space-y-2">
                  <Label>Mes de Nacimiento</Label>
                  <Select value={filterMonth} onValueChange={setFilterMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los meses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los meses</SelectItem>
                      <SelectItem value="1">Enero</SelectItem>
                      <SelectItem value="2">Febrero</SelectItem>
                      <SelectItem value="3">Marzo</SelectItem>
                      <SelectItem value="4">Abril</SelectItem>
                      <SelectItem value="5">Mayo</SelectItem>
                      <SelectItem value="6">Junio</SelectItem>
                      <SelectItem value="7">Julio</SelectItem>
                      <SelectItem value="8">Agosto</SelectItem>
                      <SelectItem value="9">Septiembre</SelectItem>
                      <SelectItem value="10">Octubre</SelectItem>
                      <SelectItem value="11">Noviembre</SelectItem>
                      <SelectItem value="12">Diciembre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ministerio filter for all roles */}
                <div className="space-y-2">
                  <Label>Ministerio</Label>
                  <Select value={filterMinisterio} onValueChange={setFilterMinisterio}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los ministerios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los ministerios</SelectItem>
                      {MINISTERIOS_LISTA.map((ministerio) => (
                        <SelectItem key={ministerio} value={ministerio}>
                          {ministerio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Edad</Label>
                  <Select value={filterEdad} onValueChange={setFilterEdad}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las edades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las edades</SelectItem>
                      <SelectItem value="ninos">Niños (0-12 años)</SelectItem>
                      <SelectItem value="adolescentes">Adolescentes (13-17 años)</SelectItem>
                      <SelectItem value="jovenes">Jóvenes (18-25 años)</SelectItem>
                      <SelectItem value="tercera_edad">Tercera Edad (60+ años)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sexo filter for all roles */}
                <div className="space-y-2">
                  <Label>Sexo</Label>
                  <Select value={filterSexo} onValueChange={setFilterSexo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Estado filter for Administración only */}
                {userRole === "Administración" && (
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={filterEstado} onValueChange={setFilterEstado}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Asistencia filter for Administración only */}
                {userRole === "Administración" && (
                  <div className="space-y-2">
                    <Label>Asistencia a Casa de Paz</Label>
                    <Select value={filterAsistencia} onValueChange={setFilterAsistencia}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="asiste">Asiste</SelectItem>
                        <SelectItem value="no_asiste">No asiste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </FilterSidebar>
              {(userRole === "Lider" || userRole === "Administración") && (
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 w-full md:w-auto"
                >
                  Crear Miembro
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar miembros..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Card className="border-border mt-6">
            <CardHeader>
              <CardTitle className="text-foreground">Lista de Miembros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[600px]">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    {filteredMiembros.length} {filteredMiembros.length === 1 ? "miembro" : "miembros"}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-foreground font-semibold">
                          <button
                            onClick={() => toggleSort("nombre")}
                            className="flex items-center gap-1 hover:text-accent transition-colors"
                          >
                            Nombre
                            <ArrowUpDown
                              className={`h-4 w-4 ${sortColumn === "nombre" ? "text-accent" : "text-muted-foreground"}`}
                            />
                          </button>
                        </th>
                        <th className="text-left py-3 px-4 text-foreground font-semibold">
                          <button
                            onClick={() => toggleSort("fechaNacimiento")}
                            className="flex items-center gap-1 hover:text-accent transition-colors"
                          >
                            Fecha de Nacimiento
                            <ArrowUpDown
                              className={`h-4 w-4 ${sortColumn === "fechaNacimiento" ? "text-accent" : "text-muted-foreground"}`}
                            />
                          </button>
                        </th>
                        <th className="text-left py-3 px-4 text-foreground font-semibold">Detalles</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Corrected table rendering based on userRole */}
                      {(userRole === "Lider de Subred" ? paginatedMiembros : filteredMiembros).map((miembro) => (
                        <tr key={miembro.id} className="border-b border-border last:border-0">
                          <td className="py-3 px-4 text-foreground">{miembro.nombre}</td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(miembro.fechaNacimiento).toLocaleDateString("es-GT")}
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(miembro)}
                              className="text-accent hover:bg-accent/10"
                            >
                              Ver Detalles
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {(userRole === "Lider" || userRole === "Lider de Subred" || userRole === "Administración") &&
                  totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                      </Button>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Details Dialog */}
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="bg-card border-border max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground">Detalles del Miembro</DialogTitle>
              </DialogHeader>
              {selectedMember && (
                <div className="space-y-6">
                  {/* Datos Generales */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Datos Generales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground text-sm">Nombre Completo</Label>
                          {editMode && (userRole === "Administración" || userRole === "Lider de Subred") ? (
                            <Input
                              value={editNombre}
                              onChange={(e) => setEditNombre(e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="font-medium">{selectedMember.nombre}</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Teléfono</Label>
                          {editMode ? (
                            <Input
                              value={editTelefono}
                              onChange={(e) => setEditTelefono(e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="font-medium">{selectedMember.telefono}</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Dirección</Label>
                          {editMode ? (
                            <Input
                              value={editDireccion}
                              onChange={(e) => setEditDireccion(e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="font-medium">{selectedMember.direccion}</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Referencia</Label>
                          {editMode ? (
                            <Input
                              value={editReferencia}
                              onChange={(e) => setEditReferencia(e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="font-medium">{selectedMember.referencia}</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Fecha de Nacimiento</Label>
                          {editMode && (userRole === "Administración" || userRole === "Lider de Subred") ? (
                            <Input
                              type="date"
                              value={editFechaNacimiento}
                              onChange={(e) => setEditFechaNacimiento(e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="font-medium">
                              {new Date(selectedMember.fechaNacimiento).toLocaleDateString("es-GT")}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Edad</Label>
                          <p className="font-medium">{selectedMember.edad} años</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Sexo</Label>
                          {editMode && (userRole === "Administración" || userRole === "Lider de Subred") ? (
                            <Select
                              value={editSexo}
                              onValueChange={(value: "Masculino" | "Femenino") => setEditSexo(value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Masculino">Masculino</SelectItem>
                                <SelectItem value="Femenino">Femenino</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="font-medium">{selectedMember.sexo}</p>
                          )}
                        </div>
                        {userRole === "Administración" && (
                          <div>
                            <Label className="text-muted-foreground text-sm">Estado</Label>
                            {editMode ? (
                              <Select
                                value={editEstado}
                                onValueChange={(value: "Activo" | "Inactivo") => setEditEstado(value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Activo">Activo</SelectItem>
                                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <p className="font-medium">{selectedMember.estado}</p>
                            )}
                          </div>
                        )}
                        {userRole === "Administración" && (
                          <>
                            <div>
                              <Label className="text-muted-foreground text-sm">Líder de Subred</Label>
                              {editMode ? (
                                <Select value={editLiderSubred} onValueChange={setEditLiderSubred}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Seleccionar..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {lideresSubred.map((ls) => (
                                      <SelectItem key={ls.value} value={ls.value}>
                                        {ls.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <p className="font-medium">{selectedMember.liderSubred || "No asignado"}</p>
                              )}
                            </div>
                            <div>
                              <Label className="text-muted-foreground text-sm">Líder</Label>
                              {editMode ? (
                                <Select value={editLider} onValueChange={setEditLider}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Seleccionar..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {lideres.map((lider) => (
                                      <SelectItem key={lider.value} value={lider.value}>
                                        {lider.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <p className="font-medium">{selectedMember.lider || "No asignado"}</p>
                              )}
                            </div>
                          </>
                        )}
                        <div>
                          <Label className="text-muted-foreground text-sm">Fecha de Conversión</Label>
                          {editMode && (userRole === "Administración" || userRole === "Lider de Subred") ? (
                            <Input
                              type="date"
                              value={editFechaConversion}
                              onChange={(e) => setEditFechaConversion(e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="font-medium">
                              {new Date(selectedMember.fechaConversion).toLocaleDateString("es-GT")}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Fecha de Bautizo</Label>
                          {editMode && (userRole === "Administración" || userRole === "Lider de Subred") ? (
                            <Input
                              type="date"
                              value={editFechaBautizo}
                              onChange={(e) => setEditFechaBautizo(e.target.value)}
                              className="mt-1"
                            />
                          ) : selectedMember.fechaBautizo ? (
                            <p className="font-medium">
                              {new Date(selectedMember.fechaBautizo).toLocaleDateString("es-GT")}
                            </p>
                          ) : (
                            <p className="font-medium text-muted-foreground">No registrado</p>
                          )}
                        </div>
                        {(selectedMember.fechaBoda ||
                          (editMode && (userRole === "Administración" || userRole === "Lider de Subred"))) && (
                          <div>
                            <Label className="text-muted-foreground text-sm">Fecha de Boda</Label>
                            {editMode && (userRole === "Administración" || userRole === "Lider de Subred") ? (
                              <Input
                                type="date"
                                value={editFechaBoda}
                                onChange={(e) => setEditFechaBoda(e.target.value)}
                                className="mt-1"
                              />
                            ) : selectedMember.fechaBoda ? (
                              <p className="font-medium">
                                {new Date(selectedMember.fechaBoda).toLocaleDateString("es-GT")}
                              </p>
                            ) : (
                              <p className="font-medium text-muted-foreground">No registrado</p>
                            )}
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <Label className="text-muted-foreground text-sm">Ministerios</Label>
                          {editMode && userRole === "Administración" ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                              {MINISTERIOS_LISTA.map((ministerio) => (
                                <div key={ministerio} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`edit-ministerio-${ministerio}`}
                                    checked={editMinisterios.includes(ministerio)}
                                    onCheckedChange={() => toggleEditMinisterio(ministerio)}
                                  />
                                  <label
                                    htmlFor={`edit-ministerio-${ministerio}`}
                                    className="text-sm text-foreground cursor-pointer"
                                  >
                                    {ministerio}
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedMember.ministerios.map((ministerio, idx) => (
                                <span
                                  key={idx}
                                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                                >
                                  {ministerio}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Proceso de la Visión */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Proceso de la Visión</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {editMode && userRole === "Administración" && editProcesoVision ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(editProcesoVision).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                              <Label className="text-foreground capitalize">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())
                                  .trim()}
                              </Label>
                              <Select
                                value={value}
                                onValueChange={(newValue: "Completado" | "Pendiente") =>
                                  setEditProcesoVision({ ...editProcesoVision, [key]: newValue })
                                }
                              >
                                <SelectTrigger className="w-[140px] bg-background">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Completado">Completado</SelectItem>
                                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(selectedMember.procesoVision).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                              <span className="text-foreground capitalize">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())
                                  .trim()}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  value === "Completado"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                }`}
                              >
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row gap-3">
                    {editMode ? (
                      <>
                        <Button onClick={handleUpdate} className="flex-1 bg-accent text-accent-foreground">
                          Guardar Cambios
                        </Button>
                        <Button onClick={() => setEditMode(false)} variant="outline" className="flex-1">
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => setEditMode(true)} className="flex-1 bg-accent text-accent-foreground">
                          Actualizar
                        </Button>
                        {userRole !== "Lider" && (
                          <Button variant="destructive" onClick={() => handleDelete(selectedMember.id)}>
                            Eliminar
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. El miembro será eliminado permanentemente del sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Create Member Dialog - Only for Lider role */}
          {userRole === "Lider" && (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Miembro</DialogTitle>
                  <DialogDescription>Ingresa los datos del nuevo miembro</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-nombre">Nombre Completo</Label>
                    <Input
                      id="new-nombre"
                      value={newMember.nombre}
                      onChange={(e) => setNewMember({ ...newMember, nombre: e.target.value })}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-telefono">Teléfono</Label>
                    <Input
                      id="new-telefono"
                      value={newMember.telefono}
                      onChange={(e) => setNewMember({ ...newMember, telefono: e.target.value })}
                      placeholder="1234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-direccion">Dirección</Label>
                    <Input
                      id="new-direccion"
                      value={newMember.direccion}
                      onChange={(e) => setNewMember({ ...newMember, direccion: e.target.value })}
                      placeholder="Dirección completa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-referencia">Referencia</Label>
                    <Input
                      id="new-referencia"
                      value={newMember.referencia}
                      onChange={(e) => setNewMember({ ...newMember, referencia: e.target.value })}
                      placeholder="Punto de referencia"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-fechaNacimiento">Fecha de Nacimiento</Label>
                      <Input
                        id="new-fechaNacimiento"
                        type="date"
                        value={newMember.fechaNacimiento}
                        onChange={(e) => setNewMember({ ...newMember, fechaNacimiento: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-sexo">Sexo</Label>
                      {/* Use Select component forSexo */}
                      <Select
                        value={newMember.sexo}
                        onValueChange={(value: "Masculino" | "Femenino") => setNewMember({ ...newMember, sexo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Femenino">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-fechaConversion">Fecha de Conversión</Label>
                      <Input
                        id="new-fechaConversion"
                        type="date"
                        value={newMember.fechaConversion}
                        onChange={(e) => setNewMember({ ...newMember, fechaConversion: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-fechaBautizo">Fecha de Bautizo</Label>
                      <Input
                        id="new-fechaBautizo"
                        type="date"
                        value={newMember.fechaBautizo}
                        onChange={(e) => setNewMember({ ...newMember, fechaBautizo: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-fechaBoda">Fecha de Boda (Opcional)</Label>
                    <Input
                      id="new-fechaBoda"
                      type="date"
                      value={newMember.fechaBoda}
                      onChange={(e) => setNewMember({ ...newMember, fechaBoda: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ministerios</Label>
                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-border rounded-lg p-4">
                      {MINISTERIOS_LISTA.map((ministerio) => (
                        <div key={ministerio} className="flex items-center space-x-2">
                          <Checkbox
                            id={`ministerio-${ministerio}`}
                            checked={newMember.ministerios.includes(ministerio)}
                            onCheckedChange={() => toggleMinisterio(ministerio)}
                          />
                          <label
                            htmlFor={`ministerio-${ministerio}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {ministerio}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleCreateMember} className="w-full bg-accent text-accent-foreground">
                    Guardar Miembro
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Create Member Dialog - For Administración role */}
          {userRole === "Administración" && (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Miembro</DialogTitle>
                  <DialogDescription>Ingresa los datos del nuevo miembro</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-nombre">Nombre Completo</Label>
                    <Input
                      id="admin-new-nombre"
                      value={newMember.nombre}
                      onChange={(e) => setNewMember({ ...newMember, nombre: e.target.value })}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-telefono">Teléfono</Label>
                    <Input
                      id="admin-new-telefono"
                      value={newMember.telefono}
                      onChange={(e) => setNewMember({ ...newMember, telefono: e.target.value })}
                      placeholder="1234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-direccion">Dirección</Label>
                    <Input
                      id="admin-new-direccion"
                      value={newMember.direccion}
                      onChange={(e) => setNewMember({ ...newMember, direccion: e.target.value })}
                      placeholder="Dirección completa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-referencia">Referencia</Label>
                    <Input
                      id="admin-new-referencia"
                      value={newMember.referencia}
                      onChange={(e) => setNewMember({ ...newMember, referencia: e.target.value })}
                      placeholder="Punto de referencia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-fechaNacimiento">Fecha de Nacimiento</Label>
                    <Input
                      id="admin-new-fechaNacimiento"
                      type="date"
                      value={newMember.fechaNacimiento}
                      onChange={(e) => setNewMember({ ...newMember, fechaNacimiento: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-sexo">Sexo</Label>
                    <Select
                      value={newMember.sexo}
                      onValueChange={(value: "Masculino" | "Femenino") =>
                        setNewMember({ ...newMember, sexo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Femenino">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-fechaConversion">Fecha de Conversión</Label>
                    <Input
                      id="admin-new-fechaConversion"
                      type="date"
                      value={newMember.fechaConversion}
                      onChange={(e) => setNewMember({ ...newMember, fechaConversion: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-fechaBautizo">Fecha de Bautizo</Label>
                    <Input
                      id="admin-new-fechaBautizo"
                      type="date"
                      value={newMember.fechaBautizo}
                      onChange={(e) => setNewMember({ ...newMember, fechaBautizo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-fechaBoda">Fecha de Boda (opcional)</Label>
                    <Input
                      id="admin-new-fechaBoda"
                      type="date"
                      value={newMember.fechaBoda}
                      onChange={(e) => setNewMember({ ...newMember, fechaBoda: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-liderSubred">Líder de Subred</Label>
                    <Select
                      value={newMember.liderSubred || "none"}
                      onValueChange={(value) => setNewMember({ 
                        ...newMember, 
                        liderSubred: value === "none" ? "" : value,
                        lider: "" // Reset lider when liderSubred changes
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Líder de Subred" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin asignar</SelectItem>
                        {LIDERES_SUBRED.map((lider) => (
                          <SelectItem key={lider} value={lider}>
                            {lider}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-new-lider">Líder</Label>
                    <Select
                      value={newMember.lider || "none"}
                      onValueChange={(value) => setNewMember({ ...newMember, lider: value === "none" ? "" : value })}
                      disabled={!newMember.liderSubred}
                    >
                      <SelectTrigger className={!newMember.liderSubred ? "opacity-50" : ""}>
                        <SelectValue placeholder={newMember.liderSubred ? "Seleccionar Líder" : "Primero selecciona un Líder de Subred"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin asignar</SelectItem>
                        {newMember.liderSubred && 
                          LIDERES_POR_SUBRED[newMember.liderSubred]?.map((lider) => (
                            <SelectItem key={lider} value={lider}>
                              {lider}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ministerios</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                      {MINISTERIOS_LISTA.map((ministerio) => (
                        <div key={ministerio} className="flex items-center space-x-2">
                          <Checkbox
                            id={`admin-ministerio-${ministerio}`}
                            checked={newMember.ministerios.includes(ministerio)}
                            onCheckedChange={() => toggleMinisterio(ministerio)}
                          />
                          <label htmlFor={`admin-ministerio-${ministerio}`} className="text-sm cursor-pointer">
                            {ministerio}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleCreateMember} className="w-full bg-accent text-accent-foreground">
                    Guardar Miembro
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  )
}
