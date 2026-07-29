import { ChangeEvent, useRef, useState } from "react";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// THIRD PARTY
import { Camera, Loader2, Pencil, Trash2, Upload } from "lucide-react";

// THIRD PARTY COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// TYPES
import { UserProfileResponse } from "@/types";

interface Props {
  profile: UserProfileResponse;

  onUploadProfileImage: (file: File) => Promise<void>;

  onDeleteProfileImage: () => Promise<void>;
}

export function ProfileAvatar({
  profile,
  onUploadProfileImage,
  onDeleteProfileImage,
}: Props) {
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const initials = profile.fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid Image",
        description: "Only PNG and JPEG images are allowed.",
        variant: "destructive",
      });

      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast({
        title: "Image Too Large",
        description: "Maximum allowed image size is 5 MB.",
        variant: "destructive",
      });

      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      await onUploadProfileImage(file);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleDelete() {
    if (!profile.profileImageUrl) {
      return;
    }

    try {
      setUploading(true);

      await onDeleteProfileImage();
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <div className="relative">
        <Avatar className="h-28 w-28 border shadow-sm">
          {profile.profileImageUrl && (
            <AvatarImage src={profile.profileImageUrl} alt={profile.fullName} />
          )}

          <AvatarFallback className="text-4xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              disabled={uploading}
              className="absolute -bottom-1 -right-1 h-10 w-10 rounded-full border shadow-md"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent align="center" className="w-60 p-2">
            <div className="mb-2 flex items-center gap-2 border-b pb-2">
              <Camera className="h-4 w-4 text-muted-foreground" />

              <span className="text-sm font-semibold">
                Change Profile Photo
              </span>
            </div>

            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload New Photo
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              disabled={uploading || !profile.profileImageUrl}
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Photo
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        onChange={handleFileSelected}
      />
    </>
  );
}
