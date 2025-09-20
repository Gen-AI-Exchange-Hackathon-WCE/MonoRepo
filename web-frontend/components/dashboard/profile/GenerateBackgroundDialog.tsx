import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Loader2 } from "lucide-react";

interface GenerateBackgroundDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (data: {
        background_text?: string;
        experience_text?: string;
        custom_req_text?: string;
    }) => Promise<void>;
    isGenerating: boolean;
}

export function GenerateBackgroundDialog({
    isOpen,
    onClose,
    onGenerate,
    isGenerating,
}: GenerateBackgroundDialogProps) {
    const [formData, setFormData] = useState({
        background_text: "",
        experience_text: "",
        custom_req_text: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onGenerate(formData);
        onClose();
    };

    const handleClose = () => {
        setFormData({
            background_text: "",
            experience_text: "",
            custom_req_text: "",
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <ImageIcon className="w-5 h-5 mr-2" />
                        Generate Profile Background
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    <div className="text-sm text-muted-foreground">
                        <p>
                            Create a personalized background image that reflects your profession and style.
                            The more details you provide, the better we can tailor the image to you.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="background">
                                Professional Background
                            </Label>
                            <Textarea
                                id="background"
                                value={formData.background_text}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        background_text: e.target.value,
                                    }))
                                }
                                placeholder="Describe your profession, work environment, or artistic style..."
                                rows={3}
                                className="resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience">
                                Experience & Specialty
                            </Label>
                            <Textarea
                                id="experience"
                                value={formData.experience_text}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        experience_text: e.target.value,
                                    }))
                                }
                                placeholder="What are you known for? What makes your work unique?"
                                rows={3}
                                className="resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="custom">
                                Visual Preferences
                            </Label>
                            <Textarea
                                id="custom"
                                value={formData.custom_req_text}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        custom_req_text: e.target.value,
                                    }))
                                }
                                placeholder="Colors, themes, mood, or specific elements you'd like in the background..."
                                rows={2}
                                className="resize-none"
                            />
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> Background generation may take a few minutes. 
                                You'll see a progress indicator on your profile banner during generation.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="flex-1"
                                disabled={isGenerating}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isGenerating}
                                className="flex-1"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="w-4 h-4 mr-2" />
                                        Generate Background
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}