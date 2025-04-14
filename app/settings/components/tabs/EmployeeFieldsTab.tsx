import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useOrganizations } from "../../hooks/useOrganizations";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { updateOrganizationData } from "../../slice/organizationSlice";
import { Switch } from "@/components/ui/switch";
import { OrganizationUpdateInput } from "@/lib/validators/organization";

interface EmployeeField {
  activeTab: string;
  setPendingAction: Dispatch<
    SetStateAction<{
      type: string;
      id?: string;
      data?: any;
    } | null>
  >;
  setIsConfirmDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EmployeeFieldsTab({
  activeTab,
  setPendingAction,
  setIsConfirmDialogOpen,
}: EmployeeField) {
  const {
    organization,
    updateOrganization,
    setPendingChanges,
    loading,
    error,
  } = useOrganizations();
  const dispatch = useDispatch();
  const [isAddFieldDialogOpen, setIsAddFieldDialogOpen] = useState(false);
  const [isEditFieldDialogOpen, setIsEditFieldDialogOpen] = useState(false);
  const [newField, setNewField] = useState({
    name: "",
    type: "text",
    required: false,
  });
  const [editingField, setEditingField] = useState({
    id: "",
    name: "",
    type: "text",
    required: false,
  });
  const handleAddField = () => {
    dispatch(
      updateOrganizationData({
        ...organization,
        customEmployeeFields: [
          ...organization.customEmployeeFields,
          { id: "", ...newField },
        ],
      })
    );
    const { id, name, timezone, dateFormat, customEmployeeFields } =
      organization;
    const apiData: OrganizationUpdateInput = {
      name,
      timezone,
      dateFormat,
      customEmployeeFields: customEmployeeFields.map((customFields) => {
        return {
          name: customFields.name,
          type: customFields.type,
          required: customFields.required,
        };
      }),
    };
    setNewField({ name: "", type: "text", required: false });
    setIsAddFieldDialogOpen(false);
    setPendingChanges(true);
    // updateOrganization(organization.id, apiData);

    if (!loading && !error) {
    }
  };

  const handleEditField = () => {
    dispatch(
      updateOrganizationData({
        ...organization,
        customEmployeeFields: organization.customEmployeeFields.map((field) =>
          field.id === editingField.id ? editingField : field
        ),
      })
    );
    setIsEditFieldDialogOpen(false);
    setPendingChanges(true);
  };

  const handleDeleteField = () => {
    dispatch(
      updateOrganizationData({
        ...organization,
        customEmployeeFields: organization.customEmployeeFields.filter(
          (field) => field.id !== editingField.id
        ),
      })
    );
    setIsEditFieldDialogOpen(false);
    setPendingChanges(true);
  };

  const handleAdminAction = (action: string, id: string, data?: any) => {
    setPendingAction({ type: action, id, data });
    if (action === "delete") {
      setIsConfirmDialogOpen(true);
    } else if (action === "edit") {
      if (activeTab === "employee") {
        const field = organization.customEmployeeFields.find(
          (f) => f.id === id
        );
        if (field) {
          setEditingField(field);
          setIsEditFieldDialogOpen(true);
        }
      }
    }
  };
  return (
    <>
      <TabsContent value="employee" className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Employee Settings
            </h3>
            <Button onClick={() => setIsAddFieldDialogOpen(true)}>
              Add Custom Field
            </Button>
          </div>

          {organization.customEmployeeFields.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Custom Employee Fields
              </h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organization.customEmployeeFields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell>{field.name}</TableCell>
                      <TableCell>{field.type}</TableCell>
                      <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleAdminAction("edit", field.id, field)
                          }
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPendingAction({
                              type: "deleteField",
                              id: field.id,
                            });
                            setIsConfirmDialogOpen(true);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </TabsContent>
      {/* Add Custom Field Dialog */}
      <Dialog
        open={isAddFieldDialogOpen}
        onOpenChange={setIsAddFieldDialogOpen}
      >
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
            <Button
              variant="outline"
              onClick={() => setIsAddFieldDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddField}>Add Field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Custom Field Dialog */}
      <Dialog
        open={isEditFieldDialogOpen}
        onOpenChange={setIsEditFieldDialogOpen}
      >
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
                value={editingField.name}
                onChange={(e) =>
                  setEditingField({ ...editingField, name: e.target.value })
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
                value={editingField.type}
                onChange={(e) =>
                  setEditingField({ ...editingField, type: e.target.value })
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
                checked={editingField.required}
                onCheckedChange={(checked) =>
                  setEditingField({ ...editingField, required: checked })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditFieldDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditField}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
