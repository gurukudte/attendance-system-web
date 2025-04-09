import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrganizations } from "../../hooks/useOrganizations";
import { TabsContent } from "@/components/ui/tabs";
import SaveDialog from "../dialogs/SaveDialog";

export default function OrganizationTab() {
  const { organization, handleChanges, pendingChanges, setPendingChanges } =
    useOrganizations();
  return (
    <TabsContent value="organization" className="relative space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Organization Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="name"
              name="name"
              value={organization.name}
              onChange={handleChanges}
            />
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              name="timezone"
              value={organization.timezone}
              onChange={handleChanges}
            />
          </div>
          <div>
            <Label htmlFor="dateFormat">Date Format</Label>
            <Input
              id="dateFormat"
              name="dateFormat"
              value={organization.dateFormat}
              onChange={handleChanges}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <SaveDialog
          onSave={() => setPendingChanges(false)}
          disabled={!pendingChanges}
        />
      </div>
    </TabsContent>
  );
}
