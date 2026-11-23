import { AppLink } from "../components/Link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-8xl font-semibold text-accent">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-primary">This page isn't on the menu</h1>
      <p className="mt-2 max-w-md text-muted-foreground">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <AppLink to="/" className="btn btn-primary">Return home</AppLink>
        <AppLink to="/menu" className="btn btn-outline">Browse the menu</AppLink>
      </div>
    </div>
  );
}
