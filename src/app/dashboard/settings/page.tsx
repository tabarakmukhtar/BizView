
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>This is a placeholder page for application settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Application settings will be configured here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
