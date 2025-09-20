import { ProfileInfo } from "@/lib/api/profile";

interface ProfileSummaryProps {
    profileInfo: ProfileInfo | null;
}

export function ProfileSummary({ profileInfo }: ProfileSummaryProps) {
    if (!profileInfo) return null;

    const activeDescription = profileInfo.descriptions.find(
        (desc) => desc.isActive
    );

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Business Information */}
            <div className="space-y-3">
                <h4 className="text-base sm:text-lg font-semibold">
                    Business Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium text-muted-foreground">
                            Business Name:
                        </span>
                        <p className="mt-1">
                            {profileInfo.businessName || "Not specified"}
                        </p>
                    </div>
                    <div>
                        <span className="font-medium text-muted-foreground">
                            Location:
                        </span>
                        <p className="mt-1">
                            {profileInfo.businessLocation || "Not specified"}
                        </p>
                    </div>
                    <div className="sm:col-span-2">
                        <span className="font-medium text-muted-foreground">
                            Profession:
                        </span>
                        <p className="mt-1 flex items-center">
                            {profileInfo.profession?.iconUrl && (
                                <img
                                    src={profileInfo.profession.iconUrl}
                                    alt=""
                                    className="w-4 h-4 mr-2"
                                />
                            )}
                            {profileInfo.profession?.name || "Not specified"}
                        </p>
                        {profileInfo.profession?.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {profileInfo.profession.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Professional Summary */}
            {activeDescription && (
                <div className="space-y-3">
                    <h4 className="text-base sm:text-lg font-semibold">
                        Professional Summary
                    </h4>
                    <div className="prose prose-sm max-w-none">
                        <p className="text-sm leading-relaxed">
                            {activeDescription.descriptionText
                                .replace("```", "")
                                .replace("```", "")
                                .replace("markdown", "")
                                .trim()}
                        </p>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-4 border-t">
                        {activeDescription.location && (
                            <div>
                                <span className="font-medium text-muted-foreground">
                                    Based in:
                                </span>
                                <p className="mt-1">
                                    {activeDescription.location}
                                </p>
                            </div>
                        )}
                        {activeDescription.experience && (
                            <div>
                                <span className="font-medium text-muted-foreground">
                                    Experience:
                                </span>
                                <p className="mt-1">
                                    {activeDescription.experience}
                                </p>
                            </div>
                        )}
                        {activeDescription.backgroundInfo && (
                            <div className="sm:col-span-2">
                                <span className="font-medium text-muted-foreground">
                                    Background:
                                </span>
                                <p className="mt-1">
                                    {activeDescription.backgroundInfo}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
