"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import { UserPlus, Eye, EyeOff, Users, Pencil, Trash2, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

interface Usuario {
  id: number
  usuario: string
  rol: string
  liderSubred?: string
  estado: "Activo" | "Inactivo"
  fechaCreacion: string
}

const Loading = () => null;

export default function GestionUsuariosPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams();
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)

  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, usuario: "admin", rol: "Administración", estado: "Activo", fechaCreacion: "2024-01-15" },
    {
      id: 2,
      usuario: "josue.santizo",
      rol: "Lider de Subred",
      estado: "Activo",
      fechaCreacion: "2024-02-10",
    },
    {
      id: 3,
      usuario: "daniela.juarez",
      rol: "Lider",
      liderSubred: "Josué Santizo",
      estado: "Activo",
      fechaCreacion: "2024-03-05",
    },
    {
      id: 4,
      usuario: "carlos.ramirez",
      rol: "Lider de Servicio",
      estado: "Activo",
      fechaCreacion: "2024-03-20",
    },
    {
      id: 5,
      usuario: "ana.martinez",
      rol: "Lider",
      liderSubred: "Josué Santizo",
      estado: "Inactivo",
      fechaCreacion: "2024-04-01",
    },
  ])

  const [newUser, setNewUser] = useState({
    usuario: "",
    password: "",
    confirmPassword: "",
    rol: "",
    liderSubred: "",
  })

  const [editUser, setEditUser] = useState({
    id: 0,
    usuario: "",
    password: "",
    rol: "",
    liderSubred: "",
    estado: "Activo" as "Activo" | "Inactivo",
  })

  const roles = [
    { value: "Administración", label: "Administración" },
    { value: "Lider de Subred", label: "Líder de Subred" },
    { value: "Lider de Servicio", label: "Líder de Servicio" },
    { value: "Lider", label: "Líder" },
  ]

  const lideresSubred = [
    { value: "Josué Santizo", label: "Josué Santizo" },
    { value: "María González", label: "María González" },
  ]

  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.usuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.rol.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }
    if (!newUser.usuario || !newUser.password || !newUser.rol) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const nuevoUsuario: Usuario = {
      id: Math.max(...usuarios.map((u) => u.id), 0) + 1,
      usuario: newUser.usuario,
      rol: newUser.rol,
      liderSubred: newUser.liderSubred || undefined,
      estado: "Activo",
      fechaCreacion: new Date().toISOString().split("T")[0],
    }

    setUsuarios([...usuarios, nuevoUsuario])
    setShowUserDialog(false)
    setNewUser({ usuario: "", password: "", confirmPassword: "", rol: "", liderSubred: "" })

    toast({
      title: "Usuario creado",
      description: `El usuario ${nuevoUsuario.usuario} ha sido creado exitosamente`,
    })
  }

  const handleEditUser = (usuario: Usuario) => {
    setSelectedUser(usuario)
    setEditUser({
      id: usuario.id,
      usuario: usuario.usuario,
      password: "",
      rol: usuario.rol,
      liderSubred: usuario.liderSubred || "",
      estado: usuario.estado,
    })
    setShowEditDialog(true)
  }

  const handleUpdateUser = () => {
    if (!editUser.usuario || !editUser.rol) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    setUsuarios(
      usuarios.map((u) =>
        u.id === editUser.id
          ? {
              ...u,
              usuario: editUser.usuario,
              rol: editUser.rol,
              liderSubred: editUser.liderSubred || undefined,
              estado: editUser.estado,
            }
          : u,
      ),
    )
    setShowEditDialog(false)

    toast({
      title: "Usuario actualizado",
      description: `El usuario ${editUser.usuario} ha sido actualizado exitosamente`,
    })
  }

  const handleDeleteUser = (usuario: Usuario) => {
    setSelectedUser(usuario)
    setShowDeleteDialog(true)
  }

  const confirmDeleteUser = () => {
    if (selectedUser) {
      // Eliminación lógica: cambiar estado a Inactivo
      setUsuarios(usuarios.map((u) => (u.id === selectedUser.id ? { ...u, estado: "Inactivo" as const } : u)))
      setShowDeleteDialog(false)

      toast({
        title: "Usuario desactivado",
        description: `El usuario ${selectedUser.usuario} ha sido desactivado`,
      })
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Gestión de Usuarios</h1>
        <p className="text-muted-foreground mt-2">Administra usuarios del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crear Usuario Card */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Crear Usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Crear nuevos usuarios para el sistema</p>
            <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
              <DialogTrigger asChild>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Crear Nuevo Usuario</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Nombre de Usuario</Label>
                    <Input
                      type="text"
                      value={newUser.usuario}
                      onChange={(e) => setNewUser({ ...newUser, usuario: e.target.value })}
                      className="bg-background border-border mt-1"
                      placeholder="juan.perez"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Contraseña</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="bg-background border-border mt-1 pr-10"
                        placeholder="********"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1 h-9 w-9"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                        className="bg-background border-border mt-1 pr-10"
                        placeholder="********"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1 h-9 w-9"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Rol</Label>
                    <Select value={newUser.rol} onValueChange={(value) => setNewUser({ ...newUser, rol: value })}>
                      <SelectTrigger className="bg-background border-border mt-1">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((rol) => (
                          <SelectItem key={rol.value} value={rol.value}>
                            {rol.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {newUser.rol === "Lider" && (
                    <div>
                      <Label className="text-muted-foreground">Líder de Subred</Label>
                      <Select
                        value={newUser.liderSubred}
                        onValueChange={(value) => setNewUser({ ...newUser, liderSubred: value })}
                      >
                        <SelectTrigger className="bg-background border-border mt-1">
                          <SelectValue placeholder="Selecciona un líder de subred" />
                        </SelectTrigger>
                        <SelectContent>
                          {lideresSubred.map((lider) => (
                            <SelectItem key={lider.value} value={lider.value}>
                              {lider.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Button onClick={handleCreateUser} className="w-full bg-accent text-accent-foreground">
                    Crear Usuario
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Modificar/Eliminar Usuario Card */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="h-5 w-5" />
              Modificar / Eliminar Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Buscar y gestionar usuarios existentes</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre o rol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredUsuarios.map((usuario) => (
                <div
                  key={usuario.id}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{usuario.usuario}</p>
                    <p className="text-sm text-muted-foreground">{usuario.rol}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        usuario.estado === "Activo"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {usuario.estado}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditUser(usuario)} title="Editar">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteUser(usuario)}
                      className="text-destructive hover:text-destructive"
                      title="Desactivar"
                      disabled={usuario.estado === "Inactivo"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredUsuarios.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No se encontraron usuarios</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Editar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Nombre de Usuario</Label>
              <Input
                type="text"
                value={editUser.usuario}
                onChange={(e) => setEditUser({ ...editUser, usuario: e.target.value })}
                className="bg-background border-border mt-1"
              />
            </div>
            <div>
              <Label className="text-muted-foreground">Nueva Contraseña (dejar vacío para no cambiar)</Label>
              <div className="relative">
                <Input
                  type={showEditPassword ? "text" : "password"}
                  value={editUser.password}
                  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                  className="bg-background border-border mt-1 pr-10"
                  placeholder="********"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1 h-9 w-9"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                >
                  {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Rol</Label>
              <Select value={editUser.rol} onValueChange={(value) => setEditUser({ ...editUser, rol: value })}>
                <SelectTrigger className="bg-background border-border mt-1">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((rol) => (
                    <SelectItem key={rol.value} value={rol.value}>
                      {rol.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {editUser.rol === "Lider" && (
              <div>
                <Label className="text-muted-foreground">Líder de Subred</Label>
                <Select
                  value={editUser.liderSubred}
                  onValueChange={(value) => setEditUser({ ...editUser, liderSubred: value })}
                >
                  <SelectTrigger className="bg-background border-border mt-1">
                    <SelectValue placeholder="Selecciona un líder de subred" />
                  </SelectTrigger>
                  <SelectContent>
                    {lideresSubred.map((lider) => (
                      <SelectItem key={lider.value} value={lider.value}>
                        {lider.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label className="text-muted-foreground">Estado</Label>
              <Select
                value={editUser.estado}
                onValueChange={(value: "Activo" | "Inactivo") => setEditUser({ ...editUser, estado: value })}
              >
                <SelectTrigger className="bg-background border-border mt-1">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateUser} className="flex-1 bg-accent text-accent-foreground">
                Guardar Cambios
              </Button>
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará al usuario <strong>{selectedUser?.usuario}</strong>. El usuario no podrá acceder
              al sistema, pero sus datos se conservarán.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground">
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export const SuspenseWrapper = () => (
  <Suspense fallback={<Loading />}>
    <GestionUsuariosPage />
  </Suspense>
)
