import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2 } from "lucide-react";

interface GenerateDescriptionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (data: {
        background_text?: string;
        experience_text?: string;
        custom_req_text?: string;
    }) => Promise<void>;
    isGenerating: boolean;
    generatedDescription?: string;
}

export function GenerateDescriptionDialog({
    isOpen,
    onClose,
    onGenerate,
    isGenerating,
    generatedDescription,
}: GenerateDescriptionDialogProps) {
    const [formData, setFormData] = useState({
        background_text: "",
        experience_text: "",
        custom_req_text: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onGenerate(formData);
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
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Generate Professional Description
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="background">
                                Background Information
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
                                placeholder="Tell us about your background, education, and how you got started..."
                                rows={3}
                                className="resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience">
                                Experience & Skills
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
                                placeholder="Describe your experience, key skills, and notable achievements..."
                                rows={3}
                                className="resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="custom">
                                Special Requirements
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
                                placeholder="Any specific tone, style, or information you'd like included..."
                                rows={2}
                                className="resize-none"
                            />
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
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Generate Description
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* Generated Description Preview */}
                    {generatedDescription && (
                        <div className="space-y-3 border-t pt-4">
                            <Label>Generated Description</Label>
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {generatedDescription}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This description has been added to your profile. You can edit it anytime.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}