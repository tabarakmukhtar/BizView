
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SupportPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Support</CardTitle>
          <CardDescription>This is a placeholder page for help and support.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Help and support information will be available here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
