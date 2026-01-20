export type UserRole = "Super Admin" | "Administración" | "Lider de Subred" | "Lider de Servicio" | "Lider"

export interface User {
  username: string
  password: string
  role: UserRole
  name: string
  red?: "Adultos" | "Jóvenes" | "Adolescentes"
}

export const USERS: User[] = [
  {
    username: "superadmin",
    password: "prueba123",
    role: "Super Admin",
    name: "Superadmin",
  },
  {
    username: "alexander.lopez",
    password: "prueba123",
    role: "Administración",
    name: "Alexander López",
  },
  {
    username: "josue.santizo",
    password: "prueba123",
    role: "Lider de Subred",
    name: "Josué Santizo",
  },
  {
    username: "brenda.guillen",
    password: "prueba123",
    role: "Lider de Servicio",
    name: "Brenda Guillén",
  },
  {
    username: "daniela.juarez",
    password: "prueba123",
    role: "Lider",
    name: "Daniela Juarez",
    red: "Adultos",
  },
  {
    username: "angel.orozco",
    password: "prueba123",
    role: "Lider de Subred",
    name: "Angel Orozco",
  },
  {
    username: "alejandro.miranda",
    password: "prueba123",
    role: "Lider",
    name: "Alejandro Miranda",
    red: "Jóvenes",
  },
  {
    username: "samuel.lopez",
    password: "prueba123",
    role: "Lider",
    name: "Samuel López",
    red: "Adolescentes",
  },
  {
    username: "carlos.rivera",
    password: "prueba123",
    role: "Lider",
    name: "Carlos Rivera",
    red: "Adultos",
  },
]

export function authenticateUser(username: string, password: string): User | null {
  const user = USERS.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password)
  return user || null
}

export function saveUserSession(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
}

export function getUserSession(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("currentUser")
    if (userStr) {
      return JSON.parse(userStr)
    }
  }
  return null
}

export function clearUserSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}

export function getProfileImage(role: UserRole, red?: string): string {
  if (
    role === "Administración" ||
    role === "Lider de Subred" ||
    role === "Super Admin" ||
    role === "Lider de Servicio"
  ) {
    return "/images/erg.png"
  }

  if (role === "Lider") {
    switch (red) {
      case "Adultos":
        return "/images/cdp.png"
      case "Jóvenes":
        return "/images/avyth.svg"
      case "Adolescentes":
        return "/images/teens.png"
      default:
        return "/images/cdp.png"
    }
  }

  return "/images/erg.png"
}
