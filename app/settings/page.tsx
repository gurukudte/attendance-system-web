"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useOrganizations } from "@/app/settings/hooks/useOrganizations";
import SaveDialog from "./components/dialogs/SaveDialog";
import useSettingsForm from "./hooks/useSettingsForm";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/useAppSelector";
import OrganizationTab from "./components/tabs/OrganizationTab";
import EmployeeFieldsTab from "./components/tabs/EmployeeFieldsTab";
import { updateOrganizationData } from "./slice/organizationSlice";

function SettingsView() {
  const { organization } = useAppSelector((state) => state.organization);
  const dispatch = useAppDispatch();
  const { loading, error, updateOrganization } = useOrganizations();
  const {
    formData,
    setFormData,
    handleChange,
    pendingChanges,
    setPendingChanges,
  } = useSettingsForm();
  const [activeTab, setActiveTab] = useState("organization");
  const [isAddFieldDialogOpen, setIsAddFieldDialogOpen] = useState(false);
  const [isEditFieldDialogOpen, setIsEditFieldDialogOpen] = useState(false);
  const [isAddApiKeyDialogOpen, setIsAddApiKeyDialogOpen] = useState(false);
  const [isEditApiKeyDialogOpen, setIsEditApiKeyDialogOpen] = useState(false);
  const [isEditAdminDialogOpen, setIsEditAdminDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: string;
    id?: string;
    data?: any;
  } | null>(null);

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
  const [newApiKey, setNewApiKey] = useState({
    name: "",
    key: "",
  });
  const [editingApiKey, setEditingApiKey] = useState({
    id: "",
    name: "",
    key: "",
  });
  const [editingAdmin, setEditingAdmin] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
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
    setNewField({ name: "", type: "text", required: false });
    setIsAddFieldDialogOpen(false);
    setPendingChanges(true);
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
    // setFormData((prev) => ({
    //   ...prev,
    //   customEmployeeFields: prev.customEmployeeFields.map((field) =>
    //     field.id === editingField.id ? editingField : field
    //   ),
    // }));
    setIsEditFieldDialogOpen(false);
    setPendingChanges(true);
  };

  const handleAddApiKey = () => {
    setFormData((prev) => ({
      ...prev,
      apiKeys: [...prev.apiKeys, { id: Date.now().toString(), ...newApiKey }],
    }));
    setNewApiKey({ name: "", key: "" });
    setIsAddApiKeyDialogOpen(false);
    setPendingChanges(true);
  };

  const handleEditApiKey = () => {
    setFormData((prev) => ({
      ...prev,
      apiKeys: prev.apiKeys.map((key) =>
        key.id === editingApiKey.id ? editingApiKey : key
      ),
    }));
    setIsEditApiKeyDialogOpen(false);
    setPendingChanges(true);
  };

  const handleEditAdmin = () => {
    setFormData((prev) => ({
      ...prev,
      adminUsers: prev.adminUsers.map((user) =>
        user.id === editingAdmin.id ? editingAdmin : user
      ),
    }));
    setIsEditAdminDialogOpen(false);
    setPendingChanges(true);
  };

  const handleAdminAction = (action: string, id: string, data?: any) => {
    setPendingAction({ type: action, id, data });
    if (action === "delete") {
      setIsConfirmDialogOpen(true);
    } else if (action === "edit") {
      if (activeTab === "employee") {
        const field = formData.customEmployeeFields.find((f) => f.id === id);
        if (field) {
          setEditingField(field);
          setIsEditFieldDialogOpen(true);
        }
      } else if (activeTab === "access") {
        const admin = formData.adminUsers.find((u) => u.id === id);
        if (admin) {
          setEditingAdmin(admin);
          setIsEditAdminDialogOpen(true);
        }
      } else if (activeTab === "integrations") {
        const apiKey = formData.apiKeys.find((k) => k.id === id);
        if (apiKey) {
          setEditingApiKey(apiKey);
          setIsEditApiKeyDialogOpen(true);
        }
      }
    }
  };

  const confirmAction = () => {
    if (!pendingAction) return;

    if (pendingAction.type === "deleteField") {
      setFormData((prev) => ({
        ...prev,
        customEmployeeFields: prev.customEmployeeFields.filter(
          (field) => field.id !== pendingAction.id
        ),
      }));
    } else if (pendingAction.type === "deleteApiKey") {
      setFormData((prev) => ({
        ...prev,
        apiKeys: prev.apiKeys.filter((key) => key.id !== pendingAction.id),
      }));
    } else if (pendingAction.type === "deleteAdmin") {
      setFormData((prev) => ({
        ...prev,
        adminUsers: prev.adminUsers.filter(
          (user) => user.id !== pendingAction.id
        ),
      }));
    }

    setPendingChanges(true);
    setIsConfirmDialogOpen(false);
    setPendingAction(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-[calc(100vh-6rem)] flex flex-col">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        Organization Settings
      </h2>
      <Tabs
        defaultValue={activeTab}
        className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden"
      >
        <TabsList className="flex flex-col justify-start h-auto p-2 bg-gray-100 dark:bg-gray-700 rounded-lg w-full md:w-64">
          <TabsTrigger
            value="organization"
            className="w-full justify-start py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
            onClick={() => setActiveTab("organization")}
          >
            Organization
          </TabsTrigger>
          <TabsTrigger
            value="employee"
            className="w-full justify-start py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
            onClick={() => setActiveTab("employee")}
          >
            Employee Fields
          </TabsTrigger>
          <TabsTrigger
            value="access"
            className="w-full justify-start py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
            onClick={() => setActiveTab("access")}
          >
            Access Control
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="w-full justify-start py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
            onClick={() => setActiveTab("integrations")}
          >
            API Integrations
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <OrganizationTab />
          <EmployeeFieldsTab
            activeTab={activeTab}
            setPendingAction={setPendingAction}
            setIsConfirmDialogOpen={setIsConfirmDialogOpen}
          />
          <TabsContent value="access" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Access Control
              </h3>
              <div className="space-y-4">
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Admin Users
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.adminUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleAdminAction("edit", user.id, user)
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
                                  type: "deleteAdmin",
                                  id: user.id,
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
              </div>
            </div>
          </TabsContent>
          <TabsContent value="integrations" className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  API Integrations
                </h3>
                <Button onClick={() => setIsAddApiKeyDialogOpen(true)}>
                  Add API Key
                </Button>
              </div>
              {formData.apiKeys.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    API Keys
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Key</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.apiKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell>{key.name}</TableCell>
                          <TableCell>••••••••••••</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleAdminAction("edit", key.id, key)
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
                                  type: "deleteApiKey",
                                  id: key.id,
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
        </div>
      </Tabs>

      {/* Add API Key Dialog */}
      <Dialog
        open={isAddApiKeyDialogOpen}
        onOpenChange={setIsAddApiKeyDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add API Key</DialogTitle>
            <DialogDescription>
              Add a new API key for integrations
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiName" className="text-right">
                API Name
              </Label>
              <Input
                id="apiName"
                value={newApiKey.name}
                onChange={(e) =>
                  setNewApiKey({ ...newApiKey, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apiKey" className="text-right">
                API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={newApiKey.key}
                onChange={(e) =>
                  setNewApiKey({ ...newApiKey, key: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddApiKeyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddApiKey}>Add API Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit API Key Dialog */}
      <Dialog
        open={isEditApiKeyDialogOpen}
        onOpenChange={setIsEditApiKeyDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit API Key</DialogTitle>
            <DialogDescription>Modify the selected API key</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editApiName" className="text-right">
                API Name
              </Label>
              <Input
                id="editApiName"
                value={editingApiKey.name}
                onChange={(e) =>
                  setEditingApiKey({ ...editingApiKey, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editApiKey" className="text-right">
                API Key
              </Label>
              <Input
                id="editApiKey"
                type="password"
                value={editingApiKey.key}
                onChange={(e) =>
                  setEditingApiKey({ ...editingApiKey, key: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditApiKeyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditApiKey}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Admin User Dialog */}
      <Dialog
        open={isEditAdminDialogOpen}
        onOpenChange={setIsEditAdminDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
            <DialogDescription>
              Modify the selected admin user's details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editAdminName" className="text-right">
                Name
              </Label>
              <Input
                id="editAdminName"
                value={editingAdmin.name}
                onChange={(e) =>
                  setEditingAdmin({ ...editingAdmin, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editAdminEmail" className="text-right">
                Email
              </Label>
              <Input
                id="editAdminEmail"
                type="email"
                value={editingAdmin.email}
                onChange={(e) =>
                  setEditingAdmin({ ...editingAdmin, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editAdminRole" className="text-right">
                Role
              </Label>
              <Input
                id="editAdminRole"
                value={editingAdmin.role}
                onChange={(e) =>
                  setEditingAdmin({ ...editingAdmin, role: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditAdminDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditAdmin}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Confirm Action Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to perform this action? This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SettingsView;
