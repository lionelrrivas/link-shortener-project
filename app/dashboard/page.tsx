import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getLinksByUserId } from "@/data/links"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateLinkDialog } from "./create-link-dialog"

export default async function DashboardPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    const links = await getLinksByUserId(userId);

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">My Links</h1>
                <CreateLinkDialog />
            </div>
            {links.length === 0 ? (
                <p className="text-muted-foreground">You have no links yet.</p>
            ) : (
                <ul className="space-y-4">
                    {links.map((link) => (
                        <li key={link.id}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-medium">
                                        /go/{link.slug}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {link.url}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Created {new Date(link.createdAt).toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}

