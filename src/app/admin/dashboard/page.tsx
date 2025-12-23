import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { logout } from '../actions';

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p>Welcome, admin!</p>
          <p className="text-sm text-muted-foreground">You are now logged in.</p>
          <form action={logout}>
            <Button type="submit" variant="destructive">
              Logout
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
