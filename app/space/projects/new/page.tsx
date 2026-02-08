import { redirect } from "next/navigation";
import { OrganizationsService } from "@/services/Organizations";
import { CreateProjectForm } from "@/components/features/projects/create-project-form";
import { getUserSession } from "@/actions/session-helper.action";

export default async function NewProjectPage() {
  const session = await getUserSession();

  if (!session?.user) {
    redirect("/login");
  }

  // Get user's owned organization
  const ownedOrg = await OrganizationsService.getOwnedOrganization(
    session.user.id,
  );

  if (!ownedOrg) {
    redirect("/onboarding");
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="mt-2 text-muted-foreground">
          Set up a new feedback project for your organization
        </p>
      </div>

      <CreateProjectForm organizationId={ownedOrg.organization.id} />
    </div>
  );
}
