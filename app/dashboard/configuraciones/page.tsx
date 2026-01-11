"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { getTheme, setTheme, type Theme } from "@/lib/theme"
import { getUserSession } from "@/lib/auth"

export default function ConfiguracionesPage() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>("dark")
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    const theme = getTheme()
    setSelectedTheme(theme)
    const user = getUserSession()
    if (user) {
      setUserName(user.name)
      setUserRole(user.role)
    }
  }, [])

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme)
    setTheme(theme)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden")
      return
    }

    if (newPassword.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setMessage("Contraseña actualizada exitosamente")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Configuraciones</h1>
        <p className="text-muted-foreground mt-2">Personaliza tu experiencia</p>
      </div>

      {userName && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Información del Usuario</CardTitle>
            <CardDescription className="text-muted-foreground">Tu información personal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-accent-foreground">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{userName}</p>
                <p className="text-sm text-muted-foreground">{userRole}</p>
                <p className="text-sm text-muted-foreground">Usuario activo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Tema de la Aplicación</CardTitle>
          <CardDescription className="text-muted-foreground">
            Selecciona el tema que prefieres para la interfaz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleThemeChange("dark")}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                selectedTheme === "dark" ? "border-accent" : "border-border"
              }`}
            >
              <div className="w-full h-24 bg-gray-900 rounded mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-medium">Oscuro</span>
              </div>
              <p className="text-sm font-medium text-foreground text-center">Tema Oscuro</p>
            </button>

            <button
              onClick={() => handleThemeChange("light")}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                selectedTheme === "light" ? "border-accent" : "border-border"
              }`}
            >
              <div className="w-full h-24 bg-white rounded mb-3 flex items-center justify-center border border-gray-200">
                <span className="text-gray-900 text-sm font-medium">Claro</span>
              </div>
              <p className="text-sm font-medium text-foreground text-center">Tema Claro</p>
            </button>

            <button
              onClick={() => handleThemeChange("blue")}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                selectedTheme === "blue" ? "border-accent" : "border-border"
              }`}
            >
              <div className="w-full h-24 bg-blue-900 rounded mb-3 flex items-center justify-center">
                <span className="text-blue-100 text-sm font-medium">Azul</span>
              </div>
              <p className="text-sm font-medium text-foreground text-center">Tema Azul</p>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Cambiar Contraseña</CardTitle>
          <CardDescription className="text-muted-foreground">Actualiza tu contraseña de acceso</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {message && (
              <div
                className={`px-4 py-2 rounded-lg text-sm ${
                  message.includes("exitosamente")
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-foreground">
                Contraseña Actual
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="bg-secondary border-border text-foreground pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-foreground">
                Nueva Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="bg-secondary border-border text-foreground pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirmar Nueva Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-secondary border-border text-foreground pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Actualizar Contraseña
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
