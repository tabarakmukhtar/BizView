
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, LifeBuoy, Edit, Save } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const faqs = [
  {
    question: 'How do I add a new client?',
    answer: 'Navigate to the "Clients" page from the sidebar. Click the "Add Client" button in the top right corner, fill in the required details in the dialog, and click "Save Client". This action is restricted to Admins only.'
  },
  {
    question: 'Can I export my financial data?',
    answer: 'Yes. Go to the "Financials" page. You will find an "Export Data" button above the table. Clicking this will download your financial records as a CSV file.'
  },
  {
    question: 'How does the AI forecasting work?',
    answer: 'The AI forecasting tool on the "Forecasting" page uses the historical financial data you provide to identify trends and project your revenue, expenses, and profit for the next year.'
  },
  {
    question: 'How do I change my password?',
    answer: 'You can change your password on the "Settings" page, which is accessible from the user dropdown menu in the header. Under the "Account" section, click the "Change" button next to "Change Password".'
  }
];

export default function SupportPage() {
  const { role } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('support@bizview.com');
  const [phone, setPhone] = useState('+1 (800) 555-0199');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const savedEmail = localStorage.getItem('support-email');
    const savedPhone = localStorage.getItem('support-phone');
    if (savedEmail) setEmail(savedEmail);
    if (savedPhone) setPhone(savedPhone);
  }, []);

  const handleSave = () => {
    localStorage.setItem('support-email', email);
    localStorage.setItem('support-phone', phone);
    setIsEditing(false);
    toast({
      title: 'Contact Info Saved',
      description: 'The support contact details have been updated.',
    });
  }

  const canEdit = isClient && role === 'Admin';

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><LifeBuoy className="w-8 h-8 text-primary" /> Help & Support</h1>
        <p className="text-muted-foreground">Find answers to common questions and get in touch with our team.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Here are some of the most common questions we get.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader className='flex-row items-center justify-between'>
              <div>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>
                  {canEdit ? 'Edit the contact details below.' : "Can't find the answer? Reach out."}
                </CardDescription>
              </div>
               <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-block">
                       {isEditing ? (
                        <Button onClick={handleSave} size="sm" disabled={!canEdit}>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      ) : (
                        <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" disabled={!canEdit}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </TooltipTrigger>
                  {!canEdit && (
                    <TooltipContent>
                      <p>Only Admins can edit contact info.</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 mt-1 text-muted-foreground" />
                <div className="w-full">
                  <Label htmlFor="email-contact" className="font-semibold">Email</Label>
                  {isEditing ? (
                    <Input id="email-contact" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" disabled={!canEdit}/>
                  ) : (
                     <>
                      <a href={`mailto:${email}`} className="block text-sm text-primary hover:underline">
                        {email}
                      </a>
                      <p className="text-xs text-muted-foreground">Best for non-urgent inquiries.</p>
                    </>
                  )}
                </div>
              </div>
               <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 mt-1 text-muted-foreground" />
                <div className="w-full">
                  <Label htmlFor="phone-contact" className="font-semibold">Phone</Label>
                   {isEditing ? (
                    <Input id="phone-contact" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" disabled={!canEdit}/>
                  ) : (
                    <>
                      <a href={`tel:${phone}`} className="block text-sm text-primary hover:underline">
                        {phone}
                      </a>
                      <p className="text-xs text-muted-foreground">Mon-Fri, 9am - 5pm EST.</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
