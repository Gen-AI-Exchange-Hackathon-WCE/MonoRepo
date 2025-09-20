import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save } from "lucide-react";
import { ProfileInfo } from "@/lib/api/profile";

interface ProfileEditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    profileInfo: ProfileInfo | null;
    onSave: (data: { businessLocation: string; professionName: string }) => Promise<void>;
    isSaving: boolean;
}

export function ProfileEditDialog({
    isOpen,
    onClose,
    profileInfo,
    onSave,
    isSaving,
}: ProfileEditDialogProps) {
    const [formData, setFormData] = useState({
        businessLocation: "",
        professionName: "",
    });

    useEffect(() => {
        if (profileInfo) {
            setFormData({
                businessLocation: profileInfo.businessLocation || "",
                professionName: profileInfo.profession?.name || "",
            });
        }
    }, [profileInfo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
        onClose();
    };

    const handleClose = () => {
        // Reset form to original values when closing
        if (profileInfo) {
            setFormData({
                businessLocation: profileInfo.businessLocation || "",
                professionName: profileInfo.profession?.name || "",
            });
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Edit className="w-5 h-5 mr-2" />
                        Edit Profile
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="businessLocation">Business Location</Label>
                        <Input
                            id="businessLocation"
                            value={formData.businessLocation}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    businessLocation: e.target.value,
                                }))
                            }
                            placeholder="Enter your business location"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="professionName">Profession</Label>
                        <Input
                            id="professionName"
                            value={formData.professionName}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    professionName: e.target.value,
                                }))
                            }
                            placeholder="Enter your profession"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1"
                        >
                            {isSaving ? (
                                <>
                                    <Save className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}