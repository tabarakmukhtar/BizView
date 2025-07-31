
'use client';

import type { Client } from "@/lib/definitions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileDown, MoreHorizontal, PlusCircle, Trash2, Edit, Eye, UserX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useData } from "@/hooks/use-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsClient } from "@/hooks/use-is-client";


export default function ClientsPage() {
  const { clients, setClients, loading, addNotification } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { role } = useUser();
  const isClient = useIsClient();

  // Add Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newStatus, setNewStatus] = useState<'active' | 'inactive' | ''>('');

  // Edit Form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive' | ''>('');

  const canEdit = role === 'Admin';

  const handleSaveClient = () => {
    if (!newName || !newEmail || !newCompany || !newStatus) {
      toast({
        title: "Error",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }

    const newClient: Client = {
      id: `client${Date.now()}`,
      name: newName,
      email: newEmail,
      company: newCompany,
      status: newStatus as 'active' | 'inactive',
      lastContact: new Date().toISOString().split('T')[0], // Today's date
    };

    setClients([newClient, ...clients]);
    addNotification({
        title: "New Client Added",
        description: `${newName} from ${newCompany} is now a client.`
    });

    setNewName('');
    setNewEmail('');
    setNewCompany('');
    setNewStatus('');
    setIsAddDialogOpen(false);
    
    toast({
      title: "Client Added",
      description: `${newName} has been successfully added to your client list.`,
    });
  };

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setEditName(client.name);
    setEditEmail(client.email);
    setEditCompany(client.company);
    setEditStatus(client.status);
    setIsEditDialogOpen(true);
  };
  
  const handleViewClick = (client: Client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  const handleUpdateClient = () => {
    if (!selectedClient) return;

    const updatedClients = clients.map(c => 
      c.id === selectedClient.id 
      ? { ...c, name: editName, email: editEmail, company: editCompany, status: editStatus as 'active' | 'inactive' } 
      : c
    );
    setClients(updatedClients);
    setIsEditDialogOpen(false);
    setSelectedClient(null);

     toast({
      title: "Client Updated",
      description: "Client details have been successfully updated.",
    });
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(c => c.id !== clientId));
    toast({
        title: "Client Deleted",
        description: "The client has been removed from your list.",
        variant: "destructive"
    });
  };

  const handleExportData = () => {
    const headers = ['ID', 'Name', 'Email', 'Company', 'Status', 'Last Contact'];
    const csvRows = [
      headers.join(','),
      ...clients.map(row => 
        [row.id, `"${row.name}"`, row.email, `"${row.company}"`, row.status, row.lastContact].join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'clients_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
     toast({
        title: "Export Successful",
        description: "Your client data has been exported as a CSV file.",
    });
  };

  if (loading || !isClient) {
    return (
       <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
             <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b">
                   <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-40" />
                      </div>
                   </div>
                   <Skeleton className="h-4 w-24" />
                   <Skeleton className="h-6 w-20" />
                   <Skeleton className="h-4 w-24" />
                   <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Management</h1>
          <p className="text-muted-foreground">
            {canEdit ? 'View, add, and manage your client list.' : 'View your client list. Contact an Admin to make changes.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData} disabled={clients.length === 0}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Clients
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                   <DialogTrigger asChild>
                      <Button disabled={!canEdit}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Client
                      </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                 {!canEdit && (
                  <TooltipContent>
                    <p>Only Admins can add new clients. Please contact an Admin for assistance.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Enter the details for the new client.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" placeholder="e.g. John Doe" className="col-span-3" value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="col-span-3" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">Company</Label>
                  <Input id="company" placeholder="e.g. Acme Inc." className="col-span-3" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                   <Select onValueChange={(value) => setNewStatus(value as 'active' | 'inactive')} value={newStatus}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveClient}>Save Client</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          {clients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`https://placehold.co/40x40.png?text=${client.name.charAt(0)}`} alt={client.name} data-ai-hint="person"/>
                          <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{client.company}</TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(client.lastContact).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                       <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" size="icon" disabled={!canEdit}>
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Client actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewClick(client)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditClick(client)} disabled={!canEdit}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive" disabled={!canEdit}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the client from your records.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteClient(client.id)}>
                                        Continue
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                           </TooltipTrigger>
                           {!canEdit && (
                            <TooltipContent>
                               <p>Only Admins can perform actions.</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-64 border-2 border-dashed rounded-lg">
                <UserX className="w-12 h-12 text-muted-foreground" />
                <p className="text-lg font-semibold mt-4">No clients found</p>
                <p className="text-muted-foreground text-sm">Add a new client to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update client details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">Name</Label>
                  <Input id="edit-name" className="col-span-3" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">Email</Label>
                  <Input id="edit-email" type="email" className="col-span-3" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-company" className="text-right">Company</Label>
                  <Input id="edit-company" className="col-span-3" value={editCompany} onChange={(e) => setEditCompany(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">Status</Label>
                  <Select onValueChange={(value) => setEditStatus(value as 'active' | 'inactive')} value={editStatus}>
                  <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                  </Select>
              </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateClient}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Client Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{selectedClient?.name}</DialogTitle>
                <DialogDescription>
                    Contact details and information.
                </DialogDescription>
            </DialogHeader>
            {selectedClient && (
                <div className="space-y-4 py-4">
                    <p><strong>Email:</strong> {selectedClient.email}</p>
                    <p><strong>Company:</strong> {selectedClient.company}</p>
                    <p><strong>Status:</strong> <Badge variant={selectedClient.status === 'active' ? 'default' : 'secondary'} className="capitalize">{selectedClient.status}</Badge></p>
                    <p><strong>Last Contact:</strong> {new Date(selectedClient.lastContact).toLocaleDateString()}</p>
                </div>
            )}
            <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
