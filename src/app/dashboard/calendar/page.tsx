
'use client';

import type { Appointment } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const initialAppointments: Appointment[] = [
  { id: '1', time: '10:00 AM', title: 'Project Kickoff with Acme Inc.', description: 'Discussing the new marketing campaign strategy.' },
  { id: '2', time: '01:00 PM', title: 'Team Sync-up', description: 'Weekly check-in on project progress and blockers.' },
  { id: '3', time: '03:30 PM', title: 'Interview with Candidate', description: 'Senior Frontend Developer position.' },
];

export default function CalendarPage() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State for the new appointment form
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleSaveAppointment = () => {
    if (!newTitle || !newTime) {
      alert('Please fill out the title and time.');
      return;
    }

    const newAppointment: Appointment = {
      id: `apt${appointments.length + 1}`,
      title: newTitle,
      time: newTime,
      description: newDescription,
    };

    setAppointments([newAppointment, ...appointments]);
    
    // Reset form and close dialog
    setNewTitle('');
    setNewTime('');
    setNewDescription('');
    setIsDialogOpen(false);
  };
  
  const today = new Date();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointment Calendar</h1>
          <p className="text-muted-foreground">Manage your schedule and appointments.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                      <Button variant="ghost" size="sm">Edit</Button>
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
    </div>
  );
}
