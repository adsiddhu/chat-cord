import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    src?: string | null;
    name?: string;
    className?: string;
}

export const UserAvatar = ({
    src,
    name,
    className
}: UserAvatarProps) => {
    return (
        <Avatar
            className={cn(
                "h-7 w-7 md:h-10 md:w-10",
                className
            )}
        >
            <AvatarImage
                src={src || ""}
                alt={name || "User avatar"}
            />
            <AvatarFallback className="text-xs font-semibold">
                {name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
        </Avatar>
    );
};
