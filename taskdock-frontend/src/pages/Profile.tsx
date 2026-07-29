import { useEffect, useState } from "react";

// API
import { userApi } from "@/api/user.api";

// COMPONENTS
import { ChangePassword } from "./ChangePassword";
import { ProfileForm } from "@/components/profile/ProfileForm";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// LAYOUTS
import { AppLayout } from "@/components/layout/AppLayout";

// THIRD PARTY
import { Loader2 } from "lucide-react";

// TYPES
import { UpdateUserProfileRequest, UserProfileResponse } from "@/types";

export default function Profile() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);

  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  async function loadProfile() {
    try {
      setLoading(true);

      const response = await userApi.getProfile();

      setProfile(response);
    } catch (error) {
      toast({
        title: "Failed to load profile",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(request: UpdateUserProfileRequest) {
    try {
      await userApi.updateProfile(request);

      await loadProfile();

      toast({
        title: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  }

  const handleUploadProfileImage = async (file: File) => {
    try {
      await userApi.uploadProfileImage(file);

      await loadProfile();

      toast({
        title: "Profile photo updated",
        description: "Your profile photo has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to upload profile photo.",
        variant: "destructive",
      });

      throw error; // lets ProfileAvatar know the upload failed
    }
  };

  const handleDeleteProfileImage = async () => {
    try {
      await userApi.deleteProfileImage();

      await loadProfile();

      toast({
        title: "Profile photo removed",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to delete profile photo.",
        variant: "destructive",
      });

      throw error;
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="flex flex-1 items-center justify-center">
          Profile not found.
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile and passwords.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex rounded-2xl border bg-card p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("profile")}
              className={`min-w-[160px] rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === "profile"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              👤 Profile
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`min-w-[160px] rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === "security"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              🔒 Change Password
            </button>
          </div>
        </div>

        {activeTab === "profile" ? (
          <ProfileForm
            profile={profile}
            onSave={handleSave}
            onUploadProfileImage={handleUploadProfileImage}
            onDeleteProfileImage={handleDeleteProfileImage}
          />
        ) : (
          <ChangePassword />
        )}
      </div>
    </AppLayout>
  );
}
