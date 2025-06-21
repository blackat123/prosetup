"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

import DashboardUser from "../components/DashboardUser";
import DashboardAdmin from "../components/DashboardAdmin";

interface Profile {
  username: string;
  role: string;
}

export default function Dashboard() {
  const [, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session Error:", sessionError.message);
        router.push("/signin");
        return;
      }

      if (!session) {
        router.push("/signin");
        return;
      }

      setSession(session);
      const user = session.user;

      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("username, role")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile(profileData);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching profile:", error.message);
        } else {
          console.error("Error fetching profile:", error);
        }
        await supabase.auth.signOut();
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    getSessionAndProfile();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Gagal memuat profil. Silakan coba lagi.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600 hidden sm:block">
                Welcome, <span className="font-semibold">{profile.username}</span> ({profile.role})
              </p>
              <button
                onClick={handleSignOut}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {profile.role === "admin" ? <DashboardAdmin /> : <DashboardUser />}
        </div>
      </main>
    </div>
  );
}
