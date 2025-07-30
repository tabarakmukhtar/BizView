
'use client';

import type { Appointment } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const initialAppointments: Appointment[] = [
  { id: '1', time: '10:00 AM', title: 'Project Kickoff with Acme Inc.', description: 'Discussing the new marketing campaign strategy.' },
  { id: '2', time: '01:00 PM', title: 'Team Sync-up', description: 'Weekly check-in on project progress and blockers.' },
  { id: '3', time: '03:30 PM', title: 'Interview with Candidate', description: 'Senior Frontend Developer position.' },
];

export default function CalendarPage() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // State for the new appointment form
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // State for editing an appointment
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editDescription, setEditDescription] = useState('');
  

  const handleSaveAppointment = () => {
    if (!newTitle || !newTime) {
      toast({
        title: "Error",
        description: "Please fill out the title and time.",
        variant: "destructive",
      });
      return;
    }

    const newAppointment: Appointment = {
      id: `apt${appointments.length + 1}`,
      title: newTitle,
      time: newTime,
      description: newDescription,
    };

    setAppointments([newAppointment, ...appointments].sort((a,b) => a.time.localeCompare(b.time)));
    
    // Reset form and close dialog
    setNewTitle('');
    setNewTime('');
    setNewDescription('');
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
    setIsEditDialogOpen(true);
  };

  const handleUpdateAppointment = () => {
    if (!selectedAppointment) return;

    setAppointments(appointments.map(apt => 
      apt.id === selectedAppointment.id 
      ? { ...apt, title: editTitle, time: editTime, description: editDescription } 
      : apt
    ));

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
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointment Calendar</h1>
          <p className="text-muted-foreground">Manage your schedule and appointments.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </DialogTrigger>
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

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
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
        <div className="md:col-span-2">
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
                        <p className="text-sm text-muted-foreground">{apt.description}</p>
                      </div>
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="flex-shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditAppointment(apt)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteAppointment(apt.id)} className="text-destructive focus:text-destructive">
                             <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
