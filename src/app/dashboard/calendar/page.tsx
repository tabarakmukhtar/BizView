import type { Appointment } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

const appointments: Appointment[] = [
  { id: '1', time: '10:00 AM', title: 'Project Kickoff with Acme Inc.', description: 'Discussing the new marketing campaign strategy.' },
  { id: '2', time: '01:00 PM', title: 'Team Sync-up', description: 'Weekly check-in on project progress and blockers.' },
  { id: '3', time: '03:30 PM', title: 'Interview with Candidate', description: 'Senior Frontend Developer position.' },
];

export default function CalendarPage() {
  const today = new Date();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointment Calendar</h1>
          <p className="text-muted-foreground">Manage your schedule and appointments.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={today}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Appointments for {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
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
