"use client";
import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export default function SettingsPage() {
  const [appName, setAppName] = useState("Waterlevel Dashboard");
  const [appLogo, setAppLogo] = useState("");

  useEffect(() => {
    // Read current settings from API
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.appName) setAppName(data.appName);
        if (data.appLogo) setAppLogo(data.appLogo);
      })
      .catch((err) => console.error("Error loading settings:", err));
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName,
          appLogo,
        }),
      });

      if (res.ok) {
        alert("Settings saved! Page will reload to apply changes.");
        window.location.reload();
      } else {
        alert("Failed to save settings.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving settings.");
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAppLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
            <h3 className="font-medium text-dark dark:text-white">
              Application Settings
            </h3>
          </div>
          <div className="p-7">
            <div className="mb-5.5">
              <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                Application Name
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="Waterlevel Dashboard"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                Application Logo
              </label>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {appLogo ? (
                  <img src={appLogo} alt="Logo Preview" className="h-16 w-auto object-contain bg-gray-2 p-2 rounded" />
                ) : (
                  <div className="flex h-16 w-32 items-center justify-center rounded bg-gray-2 text-sm text-gray-5 dark:bg-dark-3">
                    No Logo
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
