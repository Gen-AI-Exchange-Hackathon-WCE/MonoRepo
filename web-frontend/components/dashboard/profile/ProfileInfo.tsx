import { Badge } from "@/components/ui/badge";

interface User {
    id: number;
    name: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    userType?: string;
    category?: string;
}

interface ProfileInfoProps {
    user: User;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
    return (
        <div className="flex-1 mt-4 sm:mt-0 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold">
                        {user.name}
                    </h2>
                    {user.username && (
                        <p className="text-sm sm:text-base text-muted-foreground">
                            @{user.username}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {user.userType && (
                            <Badge variant="secondary" className="text-xs">
                                {user.userType}
                            </Badge>
                        )}
                        {user.category && (
                            <Badge variant="outline" className="text-xs">
                                {user.category}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}