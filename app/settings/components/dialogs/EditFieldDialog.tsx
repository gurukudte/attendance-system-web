import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { CustomEmployeeField } from "@/app/settings/types/organization";

interface EditFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: CustomEmployeeField | null;
  onSave: (field: CustomEmployeeField) => void;
}

export default function EditFieldDialog({
  open,
  onOpenChange,
  field,
  onSave,
}: EditFieldDialogProps) {
  const [editedField, setEditedField] = useState<CustomEmployeeField | null>(
    null
  );

  useEffect(() => {
    if (field) {
      setEditedField(field);
    }
  }, [field]);

  const handleSubmit = () => {
    if (editedField) {
      onSave(editedField);
      onOpenChange(false);
    }
  };

  if (!editedField) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Custom Employee Field</DialogTitle>
          <DialogDescription>
            Modify the selected custom field
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editFieldName" className="text-right">
              Field Name
            </Label>
            <Input
              id="editFieldName"
              value={editedField.name}
              onChange={(e) =>
                setEditedField({ ...editedField, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editFieldType" className="text-right">
              Field Type
            </Label>
            <Input
              id="editFieldType"
              value={editedField.type}
              onChange={(e) =>
                setEditedField({ ...editedField, type: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editFieldRequired" className="text-right">
              Required
            </Label>
            <Switch
              id="editFieldRequired"
              checked={editedField.required}
              onCheckedChange={(checked) =>
                setEditedField({ ...editedField, required: checked })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
