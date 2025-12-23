import { AdminLoginForm } from './login-form';

export default function AdminPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <AdminLoginForm />
      </div>
    </div>
  );
}
