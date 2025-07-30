
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This is a placeholder page for the user profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>User profile details will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
