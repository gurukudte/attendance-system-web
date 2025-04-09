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
import { useState } from "react";
import { CustomEmployeeField } from "@/app/settings/types/organization";
import { useAppSelector } from "@/redux/hooks/useAppSelector";

interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddField: (field: Omit<CustomEmployeeField, "id">) => void;
}

export default function AddFieldDialog({
  open,
  onOpenChange,
  onAddField,
}: AddFieldDialogProps) {
  const { organization } = useAppSelector((state) => state.organization);
  const [newField, setNewField] = useState<Omit<CustomEmployeeField, "id">>({
    orgId: organization.id,
    name: "",
    type: "text",
    required: false,
  });

  const handleSubmit = () => {
    onAddField(newField);
    onOpenChange(false);
    setNewField({
      name: "",
      type: "text",
      required: false,
      orgId: organization.id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Employee Field</DialogTitle>
          <DialogDescription>
            Add a new custom field to employee records
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fieldName" className="text-right">
              Field Name
            </Label>
            <Input
              id="fieldName"
              value={newField.name}
              onChange={(e) =>
                setNewField({ ...newField, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fieldType" className="text-right">
              Field Type
            </Label>
            <Input
              id="fieldType"
              value={newField.type}
              onChange={(e) =>
                setNewField({ ...newField, type: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fieldRequired" className="text-right">
              Required
            </Label>
            <Switch
              id="fieldRequired"
              checked={newField.required}
              onCheckedChange={(checked) =>
                setNewField({ ...newField, required: checked })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Field</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
