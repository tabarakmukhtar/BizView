
'use client';

import type { Appointment } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, PlusCircle, Trash2, Edit, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useData } from "@/hooks/use-data";
import { useIsClient } from "@/hooks/use-is-client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CalendarPage() {
  const { appointments, setAppointments, loading, clients, addNotification } = useData();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const { role } = useUser();
  const isClient = useIsClient();

  useEffect(() => {
    if(isClient) {
      setSelectedDate(new Date());
    }
  }, [isClient]);

  // State for the new appointment form
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newClientId, setNewClientId] = useState('');

  // State for editing an appointment
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editClientId, setEditClientId] = useState<string | undefined>('');
  
  const canEdit = role === 'Admin' || role === 'Manager';

  const handleSaveAppointment = () => {
    if (!newTitle || !newTime) {
      toast({
        title: "Error",
        description: "Please fill out the title and time.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedClient = clients.find(c => c.id === newClientId);

    const newAppointment: Appointment = {
      id: `apt${Date.now()}`,
      title: newTitle,
      time: newTime,
      description: newDescription,
      clientId: newClientId || undefined,
      clientName: selectedClient?.name,
    };

    const updatedAppointments = [newAppointment, ...appointments].sort((a,b) => a.time.localeCompare(b.time));
    setAppointments(updatedAppointments);
    addNotification({
        title: 'New Appointment Created',
        description: `Scheduled "${newTitle}" at ${newTime}.`
    });
    
    setNewTitle('');
    setNewTime('');
    setNewDescription('');
    setNewClientId('');
    setIsAddDialogOpen(false);
    toast({
      title: "Appointment Saved",
      description: "Your new appointment has been added to the calendar.",
    });
  };

  const handleEditAppointment = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setEditTitle(apt.title);
    setEditTime(apt.time);
    setEditDescription(apt.description);
    setEditClientId(apt.clientId);
    setIsEditDialogOpen(true);
  };

  const handleUpdateAppointment = () => {
    if (!selectedAppointment) return;

    const selectedClient = clients.find(c => c.id === editClientId);
    
    setAppointments(appointments.map(apt => 
      apt.id === selectedAppointment.id 
      ? { ...apt, title: editTitle, time: editTime, description: editDescription, clientId: editClientId, clientName: selectedClient?.name } 
      : apt
    ).sort((a,b) => a.time.localeCompare(b.time)));

    setIsEditDialogOpen(false);
    setSelectedAppointment(null);
    toast({
      title: "Appointment Updated",
      description: "The appointment details have been saved.",
    });
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
    toast({
      title: "Appointment Deleted",
      description: "The appointment has been removed from your calendar.",
      variant: "destructive"
    });
  };

  if (loading || !isClient) {
    return (
       <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-72 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-44" />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <Skeleton className="h-[305px] md:col-span-1" />
          <Skeleton className="h-[305px] md:col-span-2" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Appointment Calendar</h1>
          <p className="text-muted-foreground">
            {canEdit ? 'Manage your schedule and appointments.' : 'View your schedule. Contact an Admin to make changes.'}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button disabled={!canEdit}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Appointment
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              {!canEdit && (
                <TooltipContent>
                  <p>Only Admins or Managers can add appointments. Please contact one for assistance.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Appointment</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new appointment to your calendar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" placeholder="e.g. Team Meeting" className="col-span-3" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input id="time" type="time" className="col-span-3" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client" className="text-right">
                  Client
                </Label>
                 <Select onValueChange={setNewClientId} value={newClientId}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Assign a client (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                     {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea id="description" placeholder="A brief description of the appointment." className="col-span-3" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveAppointment}>Save Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Appointments for {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'the selected date'}</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                      <div className="font-semibold text-primary">{apt.time}</div>
                      <div className="flex-1">
                        <p className="font-semibold">{apt.title}</p>
                         {apt.clientName && (
                            <div className="flex items-center gap-2 mt-1">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={`https://placehold.co/40x40.png?text=${apt.clientName.charAt(0)}`} alt={apt.clientName} data-ai-hint="person"/>
                                  <AvatarFallback>{apt.clientName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="text-xs text-muted-foreground">{apt.clientName}</p>
                            </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">{apt.description}</p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="flex-shrink-0" disabled={!canEdit}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditAppointment(apt)} disabled={!canEdit}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteAppointment(apt.id)} className="text-destructive focus:text-destructive" disabled={!canEdit}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TooltipTrigger>
                          {!canEdit && (
                            <TooltipContent>
                              <p>Only Admins or Managers can perform actions.</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-64 border-2 border-dashed rounded-lg">
                  <p className="text-lg font-semibold">No appointments today</p>
                  <p className="text-muted-foreground">Enjoy your day or schedule a new appointment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
       {/* Edit Appointment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>
              Update the details of your appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input id="edit-title" className="col-span-3" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-time" className="text-right">
                Time
              </Label>
              <Input id="edit-time" type="time" className="col-span-3" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-client" className="text-right">
                  Client
                </Label>
                 <Select onValueChange={(val) => setEditClientId(val)} value={editClientId}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Assign a client (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                     {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea id="edit-description" className="col-span-3" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateAppointment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
