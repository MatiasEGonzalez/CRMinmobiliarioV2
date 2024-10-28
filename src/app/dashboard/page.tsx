"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, ChevronDown, Moon, Sun, X, MessageSquare, Send, PlusCircle, Trash2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Notificacion = {
  id: number
  de: string
  para: string[]
  asunto: string
  mensaje: string
  fecha: Date
}

type Usuario = {
  id: number
  nombre: string
  rol: "agente" | "director"
}

type Comentario = {
  id: number
  usuarioId: number
  nombreUsuario: string
  texto: string
  fecha: Date
}

type Lead = {
  id: number
  nombre: string
  zona: string
  estado: string
  origen: string
  email: string
  telefono: string
  comentarios: Comentario[]
  esNuevo: boolean
}

const coloresEstado = {
  "Indefinido": "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  "Interesado": "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200",
  "Contactado": "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200",
  "En negociación": "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200",
  "No interesado": "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200",
}

// Clave para eliminar leads
const CLAVE_ELIMINAR = "CRM2024X"

interface NuevaNotificacion {
  asunto: string;
  mensaje: string;
  para: string[];
}

export default function Dashboard() {
  const [esModoOscuro, setEsModoOscuro] = useState(false)
  const [barraLateralAbierta, setBarraLateralAbierta] = useState(true)
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [nuevaNotificacion, setNuevaNotificacion] = useState<NuevaNotificacion>({ asunto: "", mensaje: "", para: [] })
  const [leads, setLeads] = useState<Lead[]>([
    { id: 1, nombre: "Juan Pérez", zona: "Centro", estado: "Interesado", origen: "Web", email: "juan@ejemplo.com", telefono: "+1234567890", comentarios: [], esNuevo: false },
    { id: 2, nombre: "María González", zona: "Norte", estado: "Contactado", origen: "Referido", email: "maria@ejemplo.com", telefono: "+0987654321", comentarios: [], esNuevo: false },
    { id: 3, nombre: "Carlos Rodríguez", zona: "Sur", estado: "En negociación", origen: "Llamada", email: "carlos@ejemplo.com", telefono: "+1122334455", comentarios: [], esNuevo: false },
    { id: 4, nombre: "Ana Martínez", zona: "Este", estado: "Interesado", origen: "Web", email: "ana@ejemplo.com", telefono: "+5566778899", comentarios: [], esNuevo: false },
    { id: 5, nombre: "Luis Sánchez", zona: "Oeste", estado: "No interesado", origen: "Feria", email: "luis@ejemplo.com", telefono: "+9988776655", comentarios: [], esNuevo: false },
    { id: 6, nombre: "Elena López", zona: "Centro", estado: "Indefinido", origen: "Landing Page", email: "elena@ejemplo.com", telefono: "+1231231234", comentarios: [], esNuevo: true },
    { id: 7, nombre: "Pedro Gómez", zona: "Norte", estado: "Indefinido", origen: "Landing Page", email: "pedro@ejemplo.com", telefono: "+3213214321", comentarios: [], esNuevo: true },
  ])
  const [nuevoLead, setNuevoLead] = useState<Omit<Lead, "id" | "esNuevo" | "comentarios">>({
    nombre: "",
    zona: "",
    estado: "Indefinido",
    origen: "",
    email: "",
    telefono: "",
  })
  const [dialogoNuevoLeadAbierto, setDialogoNuevoLeadAbierto] = useState(false)
  const [idLeadEliminar, setIdLeadEliminar] = useState<number | null>(null)
  const [claveEliminar, setClaveEliminar] = useState("")
  const [dialogoEliminarAbierto, setDialogoEliminarAbierto] = useState(false)
  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [filtroZona, setFiltroZona] = useState<string | null>(null)
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null)

  const { toast } = useToast()

  const usuarioActual: Usuario = { id: 1, nombre: "Director", rol: "director" }

  const agentes: Usuario[] = [
    { id: 2, nombre: "Agente 1", rol: "agente" },
    { id: 3, nombre: "Agente 2", rol: "agente" },
    { id: 4, nombre: "Agente 3", rol: "agente" },
  ]

  const alternarModoOscuro = () => {
    setEsModoOscuro(!esModoOscuro)
    document.documentElement.classList.toggle("dark")
  }

  const enviarNotificacion = () => {
    const nuevaNotificacionObj: Notificacion = {
      id: notificaciones.length + 1,
      de: usuarioActual.nombre,
      para: nuevaNotificacion.para,
      asunto: nuevaNotificacion.asunto,
      mensaje: nuevaNotificacion.mensaje,
      fecha: new Date(),
    }
    setNotificaciones([...notificaciones, nuevaNotificacionObj])
    setNuevaNotificacion({ asunto: "", mensaje: "", para: [] })
  }

  const eliminarNotificacion = (id: number) => {
    setNotificaciones(notificaciones.filter(notificacion => notificacion.id !== id))
  }

  const actualizarEstadoLead = (id: number, nuevoEstado: string) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, estado: nuevoEstado, esNuevo: false } : lead
    ))
  }

  const agregarComentarioALead = (leadId: number, comentario: string) => {
    if (comentario.trim() === "") return

    const nuevoComentario: Comentario = {
      id: Math.max(...leads.find(l => l.id === leadId)!.comentarios.map(c => c.id), 0) + 1,
      usuarioId: usuarioActual.id,
      nombreUsuario: usuarioActual.nombre,
      texto: comentario,
      fecha: new Date(),
    }

    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, comentarios: [...lead.comentarios, nuevoComentario] } : lead
    ))
  }

  const agregarNuevoLead = () => {
    const nuevoLeadConId: Lead = {
      ...nuevoLead,
      id: Math.max(...leads.map(l => l.id), 0) + 1,
      comentarios: [],
      esNuevo: true,
    }
    setLeads([...leads, nuevoLeadConId])
    setNuevoLead({
      nombre: "",
      zona: "",
      estado: "Indefinido",
      origen: "",
      email: "",
      telefono: "",
    })
    setDialogoNuevoLeadAbierto(false)
  }

  const eliminarLead = (id: number) => {
    setIdLeadEliminar(id)
    setDialogoEliminarAbierto(true)
  }

  const confirmarEliminarLead = () => {
    if (claveEliminar !== CLAVE_ELIMINAR) {
      toast({
        title: "Error",
        description: "Clave de autorización incorrecta. No se puede borrar el lead.",
        variant: "destructive",
      })
      return
    }

    setLeads(leads.filter(lead => lead.id !== idLeadEliminar))
    setIdLeadEliminar(null)
    setClaveEliminar("")
    setDialogoEliminarAbierto(false)

    toast({
      title: "Lead eliminado",
      description: "El lead ha sido eliminado permanentemente.",
    })
  }

  const leadsFiltrados = leads.filter(lead => 
    (lead.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    lead.email.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    lead.telefono.toLowerCase().includes(terminoBusqueda.toLowerCase())) &&
    (!filtroZona || lead.zona === filtroZona) &&
    (!filtroEstado || lead.estado === filtroEstado)
  )

  const zonasUnicas = Array.from(new Set(leads.map(lead => lead.zona)))
  const estadosUnicos = Array.from(new Set(leads.map(lead => lead.estado)))

  const ComponenteChat = ({ lead }: { lead: Lead }) => {
    const [nuevoComentario, setNuevoComentario] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    const manejarEnvioComentario = () => {
      if (nuevoComentario.trim() !== "") {
        agregarComentarioALead(lead.id, nuevoComentario)
        setNuevoComentario("")
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }
    }

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, [])

    return (
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-grow p-4">
          {lead.comentarios.map((comentario, index) => (
            <div key={comentario.id} className={`flex ${comentario.usuarioId === usuarioActual.id ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`max-w-[70%] ${comentario.usuarioId === usuarioActual.id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'} rounded-lg p-3`}>
                <p className="text-sm font-semibold">{comentario.nombreUsuario}</p>
                <p>{comentario.texto}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{comentario.fecha.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex">
          <Input
            ref={inputRef}
            placeholder="Escribe un comentario..."
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                manejarEnvioComentario()
              }
            }}
            className="flex-grow mr-2 dark:bg-gray-800 dark:text-white"
          />
          <Button onClick={manejarEnvioComentario}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 ${esModoOscuro ? "dark" : ""}`}>
      <Sheet open={barraLateralAbierta} onOpenChange={setBarraLateralAbierta}>
        <SheetContent side="left" className="w-64 p-0 bg-white dark:bg-gray-800">
          <SheetHeader className="p-4 bg-gray-800 text-white">
            <SheetTitle>CRM Inmobiliario</SheetTitle>
          </SheetHeader>
          <nav className="space-y-2 p-4">
            <Button variant="ghost" className="w-full justify-start text-gray-800 dark:text-white">
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-800 dark:text-white">
              Clientes
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-800 dark:text-white">
              Zonas
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-800 dark:text-white">
              Estados
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-800 dark:text-white">
              Configuración
            </Button>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
          <Button variant="ghost" size="icon" onClick={() => setBarraLateralAbierta(!barraLateralAbierta)}>
            <ChevronDown className="h-4 w-4 text-gray-800 dark:text-white" />
          </Button>
          <div className="flex  items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4 text-gray-800 dark:text-white" />
                  {notificaciones.filter(n => n.para.includes(usuarioActual.nombre)).length > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <ScrollArea className="h-[300px]">
                  {notificaciones
                    .filter(n => n.para.includes(usuarioActual.nombre))
                    .map(notificacion => (
                      <DropdownMenuItem key={notificacion.id} className="flex flex-col items-start p-2">
                        <div className="flex justify-between w-full">
                          <strong>{notificacion.asunto}</strong>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => eliminarNotificacion(notificacion.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm  text-gray-500 dark:text-gray-400">{notificacion.mensaje}</p>
                        <small className="text-xs text-gray-400 dark:text-gray-500">
                          {notificacion.fecha.toLocaleString()}
                        </small>
                      </DropdownMenuItem>
                    ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Nueva Notificación</Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-white">Enviar Nueva Notificación</DialogTitle>
                  <DialogDescription className="text-gray-500 dark:text-gray-400">
                    Crea una nueva notificación para enviar a los agentes.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="asunto" className="text-right text-gray-700 dark:text-gray-300">
                      Asunto
                    </Label>
                    <Input
                      id="asunto"
                      value={nuevaNotificacion.asunto}
                      onChange={(e) => setNuevaNotificacion({...nuevaNotificacion, asunto: e.target.value})}
                      className="col-span-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="mensaje" className="text-right text-gray-700 dark:text-gray-300">
                      Mensaje
                    </Label>
                    <Textarea
                      id="mensaje"
                      value={nuevaNotificacion.mensaje}
                      onChange={(e) => setNuevaNotificacion({...nuevaNotificacion, mensaje: e.target.value})}
                      className="col-span-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-gray-700 dark:text-gray-300">Destinatarios</Label>
                    <div className="col-span-3">
                      {agentes.map(agente => (
                        <label key={agente.id} className="flex items-center text-gray-700 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={nuevaNotificacion.para.includes(agente.nombre)}
                            onChange={(e) => {
                              const destinatariosActualizados = e.target.checked
                                ? [...nuevaNotificacion.para, agente.nombre]
                                : nuevaNotificacion.para.filter(nombre => nombre !== agente.nombre)
                              setNuevaNotificacion({...nuevaNotificacion, para: destinatariosActualizados})
                            }}
                            className="mr-2"
                          />
                          {agente.nombre}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <Button onClick={enviarNotificacion}>Enviar Notificación</Button>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" onClick={alternarModoOscuro}>
              {esModoOscuro ? <Sun className="h-4 w-4 text-white" /> : <Moon className="h-4 w-4 text-gray-800" />}
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
              <Dialog open={dialogoNuevoLeadAbierto} onOpenChange={setDialogoNuevoLeadAbierto}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Nuevo Lead
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Agregar Nuevo Lead</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400">
                      Ingresa la información del nuevo lead. Todos los campos son obligatorios.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nombre" className="text-right text-gray-700 dark:text-gray-300">
                        Nombre
                      </Label>
                      <Input
                        id="nombre"
                        value={nuevoLead.nombre}
                        onChange={(e) => setNuevoLead({...nuevoLead, nombre: e.target.value})}
                        className="col-span-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="zona" className="text-right text-gray-700 dark:text-gray-300">
                        Zona
                      </Label>
                      <Input
                        id="zona"
                        value={nuevoLead.zona}
                        onChange={(e) => setNuevoLead({...nuevoLead, zona: e.target.value})}
                        className="col-span-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="origen" className="text-right text-gray-700 dark:text-gray-300">
                        Origen
                      </Label>
                      <Input
                        id="origen"
                        value={nuevoLead.origen}
                        onChange={(e) => setNuevoLead({...nuevoLead, origen: e.target.value})}
                        className="col-span-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right text-gray-700 dark:text-gray-300">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={nuevoLead.email}
                        onChange={(e) => setNuevoLead({...nuevoLead, email: e.target.value})}
                        className="col-span-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="telefono" className="text-right text-gray-700 dark:text-gray-300">
                        Teléfono
                      </Label>
                      <Input
                        id="telefono"
                        value={nuevoLead.telefono}
                        onChange={(e) => setNuevoLead({...nuevoLead, telefono: e.target.value})}
                        className="col-span-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={agregarNuevoLead}>Agregar Lead</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-grow">
                <Label htmlFor="buscar" className="sr-only">Buscar leads</Label>
                <Input
                  id="buscar"
                  placeholder="Buscar leads por nombre o contacto..."
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Zona</h4>
                      <Select
                        value={filtroZona || "all"}
                        onValueChange={(value) => setFiltroZona(value === "all" ? null : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar zona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las zonas</SelectItem>
                          {zonasUnicas.map((zona) => (
                            <SelectItem key={zona} value={zona}>
                              {zona}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Estado</h4>
                      <Select
                        value={filtroEstado || "all"}
                        onValueChange={(value) => setFiltroEstado(value === "all" ? null : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los estados</SelectItem>
                          {estadosUnicos.map((estado) => (
                            <SelectItem key={estado} value={estado}>
                              {estado}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={() => { setFiltroZona(null); setFiltroEstado(null); }}>
                      Limpiar filtros
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Nuevos Leads</h2>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-300">Nombre</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Zona</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Estado</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Origen del lead</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Contacto</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leadsFiltrados.filter(lead => lead.esNuevo).map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="text-gray-900 dark:text-white">{lead.nombre}</TableCell>
                      <TableCell className="text-gray-900 dark:text-white">{lead.zona}</TableCell>
                      <TableCell>
                        <Select onValueChange={(value) => actualizarEstadoLead(lead.id, value)}>
                          <SelectTrigger className={`w-[180px] ${coloresEstado[lead.estado as keyof typeof coloresEstado]}`}>
                            <SelectValue placeholder={lead.estado} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Indefinido" className={coloresEstado["Indefinido"]}>Indefinido</SelectItem>
                            <SelectItem value="Interesado" className={coloresEstado["Interesado"]}>Interesado</SelectItem>
                            <SelectItem value="Contactado" className={coloresEstado["Contactado"]}>Contactado</SelectItem>
                            <SelectItem value="En negociación" className={coloresEstado["En negociación"]}>En negociación</SelectItem>
                            <SelectItem value="No interesado" className={coloresEstado["No interesado"]}>No interesado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">{lead.origen}</TableCell>
                      <TableCell>
                        <div className="text-gray-900 dark:text-white">{lead.email}</div>
                        <div className="text-gray-900 dark:text-white">{lead.telefono}</div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Comentarios
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
                            <DialogHeader>
                              <DialogTitle className="text-gray-900 dark:text-white">Comentarios del Lead</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4" style={{ height: '400px' }}>
                              <ComponenteChat lead={lead} />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" className="ml-2" onClick={() => eliminarLead(lead.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Todos los Leads</h2>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-300">Nombre</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Zona</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Estado</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Origen del lead</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Contacto</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leadsFiltrados.filter(lead => !lead.esNuevo).map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="text-gray-900 dark:text-white">{lead.nombre}</TableCell>
                      <TableCell className="text-gray-900 dark:text-white">{lead.zona}</TableCell>
                      <TableCell>
                        <Select onValueChange={(value) => actualizarEstadoLead(lead.id, value)}>
                          <SelectTrigger className={`w-[180px] ${coloresEstado[lead.estado as keyof typeof coloresEstado]}`}>
                            <SelectValue placeholder={lead.estado} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Interesado" className={coloresEstado["Interesado"]}>Interesado</SelectItem>
                            <SelectItem value="Contactado" className={coloresEstado["Contactado"]}>Contactado</SelectItem>
                            <SelectItem value="En negociación" className={coloresEstado["En negociación"]}>En negociación</SelectItem>
                            <SelectItem value="No interesado" className={coloresEstado["No interesado"]}>No interesado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">{lead.origen}</TableCell>
                      <TableCell>
                        <div className="text-gray-900 dark:text-white">{lead.email}</div>
                        <div className="text-gray-900 dark:text-white">{lead.telefono}</div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Comentarios
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
                            <DialogHeader>
                              <DialogTitle className="text-gray-900 dark:text-white">Comentarios del Lead</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4" style={{ height: '400px' }}>
                              <ComponenteChat lead={lead} />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" className="ml-2" onClick={() => eliminarLead(lead.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={dialogoEliminarAbierto} onOpenChange={setDialogoEliminarAbierto}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Confirmar eliminación</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              ¿Estás seguro de que deseas eliminar este lead de manera permanente?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="claveEliminar" className="text-right text-gray-700 dark:text-gray-300">
                Clave de autorización
              </Label>
              <Input
                id="claveEliminar"
                type="password"
                value={claveEliminar}
                onChange={(e) => setClaveEliminar(e.target.value)}
                className="col-span-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoEliminarAbierto(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmarEliminarLead}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}