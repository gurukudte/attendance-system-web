import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useOrganizations } from "../../hooks/useOrganizations";
import useSettingsForm from "../../hooks/useSettingsForm";

interface SaveDialogProps {
  disabled: boolean;
  // open: boolean;
  // onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export default function SaveDialog({
  disabled,

  onSave,
}: SaveDialogProps) {
  const { organization, loading, error, updateOrganization } =
    useOrganizations();
  const { formData } = useSettingsForm();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const handleSave = () => {
    updateOrganization(organization.id, {
      name: formData.name,
      timezone: formData.timezone,
      dateFormat: formData.dateFormat,
    });
    if (!loading && !error) {
      onSave(); // Call the onSave function passed as a prop
      setIsSaveDialogOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsSaveDialogOpen(true)} disabled={disabled}>
        Save Changes
      </Button>
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Settings Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes? This will update your
              organization's settings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSaveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Confirm & Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
