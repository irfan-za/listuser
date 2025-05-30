"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserForm } from "@/components/UserForm";
import { UserInput } from "@/lib/validations/user";
import { api } from "@/lib/api";
import { IPaginationInfo, IUser } from "@/types";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

interface DashboardClientProps {
  initialUsers: IUser[];
  initialPagination: IPaginationInfo;
}

export function DashboardClient({
  initialUsers,
  initialPagination,
}: DashboardClientProps) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const [firstname, setFirstname] = useState(
    searchParams.get("firstname") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [pagination, setPagination] =
    useState<IPaginationInfo>(initialPagination);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

  const fetchUsers = async (page: number, firstname: string) => {
    setLoading(true);
    try {
      const data = await api.users.getUsers(page, firstname);
      setUsers(data.users);
      setPagination(data.pagination);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data: UserInput) => {
    try {
      await api.users.createUser(data);
      fetchUsers(currentPage, firstname);
      setIsFormOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error creating user");
    }
  };

  const handleUpdateUser = async (data: UserInput) => {
    if (!editingUser) return;

    try {
      await api.users.updateUser(editingUser.id, data);
      fetchUsers(currentPage, firstname);
      setEditingUser(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error updating user");
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await api.users.deleteUser(id);
      fetchUsers(currentPage, firstname);
      setUserToDelete(null);
      toast.success("User deleted successfully");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  const openDeleteDialog = (id: number) => {
    setUserToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID");
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstname(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, value);
      if (value) {
        params.set("firstname", value);
      } else {
        params.delete("firstname");
      }
      window.history.replaceState(
        {},
        "",
        params.toString() ? `?${params.toString()}` : window.location.pathname
      );
    }, 400);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    if (currentPage > 1) {
      params.set("page", String(currentPage - 1));
    } else {
      params.delete("page");
    }
    window.history.replaceState(
      {},
      "",
      params.toString() ? `?${params.toString()}` : window.location.pathname
    );
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
    params.set("page", String(currentPage + 1));
    window.history.replaceState(
      {},
      "",
      params.toString() ? `?${params.toString()}` : window.location.pathname
    );
  };
  useEffect(() => {
    fetchUsers(currentPage, firstname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div className="container mx-auto py-5 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by first name..."
            value={firstname}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center space-y-4 flex-col">
          <Skeleton className="h-10 w-full bg-border" />
          <Skeleton className="h-8 w-full bg-border" />
          <Skeleton className="h-8 w-full bg-border" />
          <Skeleton className="h-8 w-full bg-border" />
          <Skeleton className="h-8 w-full bg-border" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table className="w-full">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </TableHead>
                  <TableHead className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Birth Date
                  </TableHead>
                  <TableHead className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </TableHead>
                  <TableHead className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-6 py-2 whitespace-nowrap font-medium text-gray-900">
                      {user.firstname} {user.lastname}
                    </TableCell>
                    <TableCell className="px-6 py-2 whitespace-nowrap text-gray-900">
                      {formatDate(user.birthdate)}
                    </TableCell>
                    <TableCell className="px-6 py-2 text-gray-900">
                      {user.address ? (
                        <>
                          {user.address.street}, {user.address.city}
                          <br />
                          {user.address.province} {user.address.postal_code}
                        </>
                      ) : (
                        "No address"
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {users.length} of {pagination.total} users
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateUser}
      />

      {editingUser && (
        <UserForm
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleUpdateUser}
          initialData={{
            firstname: editingUser.firstname,
            lastname: editingUser.lastname,
            birthdate: editingUser.birthdate,
            street: editingUser.address?.street || "",
            city: editingUser.address?.city || "",
            province: editingUser.address?.province || "",
            postal_code: editingUser.address?.postal_code || "",
          }}
          isEditing
        />
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
