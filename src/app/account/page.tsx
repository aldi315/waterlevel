"use client";
import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function AccountPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "Administrator");
      setEmail(session.user.email || "admin@example.com");
    }
  }, [session]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Account updated successfully! (Dummy action)");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }
    alert("Password changed successfully! (Dummy action)");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <div className="mb-6">
          <h2 className="text-title-md2 font-bold text-dark dark:text-white">
            Account Settings
          </h2>
        </div>

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
              <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
                <h3 className="font-medium text-dark dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSave}>
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                      Role
                    </label>
                    <input
                      type="text"
                      value={(session?.user as any)?.role || "Admin"}
                      disabled
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="submit"
                      className="flex justify-center rounded-[7px] bg-primary px-6 py-[13px] font-medium text-white hover:bg-opacity-90"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
              <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
                <h3 className="font-medium text-dark dark:text-white">
                  Profile Photo
                </h3>
              </div>
              <div className="p-7 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="relative h-24 w-24 rounded-full border-4 border-white shadow-1 dark:border-dark-3">
                    <Image
                      src="/images/user/user-03.png"
                      alt="User"
                      width={96}
                      height={96}
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-sm font-medium text-dark-5">
                    This feature is currently in dummy mode.
                  </span>
                </div>
              </div>
            </div>

            {/* Change Password Form */}
            <div className="mt-8 rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
              <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
                <h3 className="font-medium text-dark dark:text-white">
                  Change Password
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="submit"
                      className="flex justify-center rounded-[7px] bg-primary px-6 py-[13px] font-medium text-white hover:bg-opacity-90"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* End Change Password Form */}
          </div>

        </div>
      </div>
    </DefaultLayout>
  );
}
