import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Link2, Fingerprint, Zap, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Instant Link Shortening",
    description:
      "Paste any long URL and get a short, shareable link in seconds. No clutter, no friction.",
  },
  {
    icon: Fingerprint,
    title: "Custom Slugs",
    description:
      "Choose a memorable slug for your link (e.g. /go/my-campaign) instead of a random string.",
  },
  {
    icon: Zap,
    title: "Fast Redirects",
    description:
      "Every short link resolves server-side at the edge for near-instant redirects to your destination.",
  },
  {
    icon: LayoutDashboard,
    title: "Per-User Dashboard",
    description:
      "All your links in one place. View, manage, and delete your short links from a personal dashboard.",
  },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-8 px-6 py-28 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Shorten links.{" "}
            <span className="text-muted-foreground">Share smarter.</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Create short, branded links with custom slugs, track them in your
            personal dashboard, and redirect visitors instantly — all in one
            place.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <SignUpButton mode="modal">
            <Button size="lg">Get Started — It&apos;s Free</Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* Features */}
      <section className="flex flex-col items-center gap-12 px-6 py-20">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Everything you need
          </h2>
          <p className="max-w-md text-muted-foreground">
            A focused set of features that make link management simple and fast.
          </p>
        </div>
        <ul className="grid w-full max-w-4xl gap-6 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA Banner */}
      <section className="flex flex-col items-center gap-6 px-6 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Ready to get started?
        </h2>
        <p className="max-w-md text-muted-foreground">
          Sign up for free and start shortening links in under a minute.
        </p>
        <SignUpButton mode="modal">
          <Button size="lg">Create Your First Link</Button>
        </SignUpButton>
      </section>
    </main>
  );
}
