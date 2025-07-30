
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, LifeBuoy } from 'lucide-react';

const faqs = [
  {
    question: 'How do I add a new client?',
    answer: 'Navigate to the "Clients" page from the sidebar. Click the "Add Client" button in the top right corner, fill in the required details in the dialog, and click "Save Client".'
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
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Can't find the answer? Reach out to us.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:support@bizview.com" className="text-sm text-primary hover:underline">
                    support@bizview.com
                  </a>
                  <p className="text-xs text-muted-foreground">Best for non-urgent inquiries.</p>
                </div>
              </div>
               <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <a href="tel:+1-800-555-0199" className="text-sm text-primary hover:underline">
                    +1 (800) 555-0199
                  </a>
                   <p className="text-xs text-muted-foreground">Mon-Fri, 9am - 5pm EST.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
