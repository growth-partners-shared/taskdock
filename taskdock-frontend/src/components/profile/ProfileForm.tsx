import { useEffect, useState } from "react";

// THIRD PARTY
import { Calendar, Mail, Phone } from "lucide-react";

// THIRD PARTY COMPONENTS
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileAvatar } from "./ProfileAvatar";

// TYPES
import { UpdateUserProfileRequest, UserProfileResponse } from "@/types";

interface Props {
  profile: UserProfileResponse;

  onSave: (request: UpdateUserProfileRequest) => Promise<void>;

  onUploadProfileImage: (file: File) => Promise<void>;

  onDeleteProfileImage: () => Promise<void>;
}

export function ProfileForm({
  profile,
  onSave,
  onUploadProfileImage,
  onDeleteProfileImage,
}: Props) {
  const [fullName, setFullName] = useState("");

  const [age, setAge] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(profile.fullName);
    setAge(profile.age?.toString() ?? "");
  }, [profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    try {
      await onSave({
        fullName,
        age: age ? Number(age) : undefined,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 lg:flex-row">
      <Card className="w-full lg:w-[430px] shrink-0">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <ProfileAvatar
            profile={profile}
            onUploadProfileImage={onUploadProfileImage}
            onDeleteProfileImage={onDeleteProfileImage}
          />
          <p className="text-muted-foreground">Welcome back 👋</p>

          <h2 className="text-2xl font-bold">{profile.fullName}</h2>

          <div className="w-full space-y-3 pt-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

              <span className="min-w-0 break-all text-sm">{profile.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />

              <span>{profile.phoneNumber}</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />

              <span>
                Joined {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Full Name</Label>

            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Age</Label>

            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Changes"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Last Updated @ {new Date(profile.updatedAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
