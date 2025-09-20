import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ArtistProfileLoading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Banner Loading */}
            <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />

            {/* Profile Header Loading */}
            <div className="container mx-auto px-4 -mt-16 relative z-10">
                <Card className="p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                        <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
                        
                        <div className="flex-1 space-y-4">
                            <div>
                                <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-2" />
                                <div className="flex gap-2 mb-3">
                                    <div className="h-6 w-20 bg-gray-200 animate-pulse rounded" />
                                    <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                                    <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <div className="h-10 w-20 bg-gray-200 animate-pulse rounded" />
                            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Content Loading */}
            <div className="container mx-auto px-4 pb-8">
                <div className="space-y-6">
                    {/* Tabs Loading */}
                    <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
                        <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
                        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                    </div>

                    {/* Content Cards Loading */}
                    <Card>
                        <CardHeader>
                            <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
                            <div className="h-4 w-48 bg-gray-200 animate-pulse rounded" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
                                    <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
                                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}