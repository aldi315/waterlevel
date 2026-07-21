"use client";

import { useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
};

const TableUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Admin" | "User">("User");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentUserId(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("User");
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setIsEditing(true);
    setCurrentUserId(user.id);
    setName(user.name || "");
    setEmail(user.email || "");
    setPassword("");
    setRole(user.role as "Admin" | "User");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: any = { name, email, role };
    if (password) {
      payload.password = password;
    }

    try {
      if (isEditing && currentUserId) {
        await fetch(`/api/users/${currentUserId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error("Failed to save user", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card relative">
      <div className="flex justify-between items-center mb-5.5">
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
          Users Management
        </h4>
        <button
          onClick={openCreateModal}
          className="rounded bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90"
        >
          Add New User
        </button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[700px] flex flex-col">
          <div className="grid grid-cols-5 bg-gray-2 dark:bg-dark-2 px-2 py-3.5">
            <div className="col-span-1">
              <h5 className="text-sm font-medium uppercase xsm:text-base text-dark dark:text-white">
                Name
              </h5>
            </div>
            <div className="col-span-1 text-center">
              <h5 className="text-sm font-medium uppercase xsm:text-base text-dark dark:text-white">
                Email
              </h5>
            </div>
            <div className="col-span-1 text-center">
              <h5 className="text-sm font-medium uppercase xsm:text-base text-dark dark:text-white">
                Role
              </h5>
            </div>
            <div className="col-span-2 text-center">
              <h5 className="text-sm font-medium uppercase xsm:text-base text-dark dark:text-white">
                Actions
              </h5>
            </div>
          </div>

          {loading ? (
            <div className="py-4 text-center">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="py-4 text-center">No users found.</div>
          ) : (
            users.map((user, key) => (
              <div
                className={`grid grid-cols-5 items-center px-2 py-4 ${
                  key === users.length - 1 ? "" : "border-b border-stroke dark:border-dark-3"
                }`}
                key={user.id}
              >
                <div className="col-span-1">
                  <p className="font-medium text-dark dark:text-white">{user.name}</p>
                </div>

                <div className="col-span-1 text-center">
                  <p className="font-medium text-dark dark:text-white">{user.email}</p>
                </div>

                <div className="col-span-1 text-center">
                  <p
                    className={`inline-block rounded px-2.5 py-1 text-sm font-medium ${
                      user.role === "Admin"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {user.role}
                  </p>
                </div>

                <div className="col-span-2 flex items-center justify-center gap-4">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-default dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-bold text-dark dark:text-white">
              {isEditing ? "Edit User" : "Add New User"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Password {isEditing && "(Leave blank to keep current)"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  required={!isEditing}
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "Admin" | "User")}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded border border-stroke px-6 py-2 font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
                >
                  {isEditing ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableUsers;
