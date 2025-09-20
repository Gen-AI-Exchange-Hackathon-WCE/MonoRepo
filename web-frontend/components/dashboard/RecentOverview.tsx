import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
    id: number;
    title: string;
    lastUpdated: string;
    status: "draft" | "published";
    images: string[];
}

interface Course {
    id: number;
    title: string;
    enrollments: number;
    status: "draft" | "published";
    thumbnail: string;
}

interface RecentOverviewProps {
    products: Product[];
    courses: Course[];
}

export function RecentOverview({ products, courses }: RecentOverviewProps) {
    return (
        <div className="grid md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Products</CardTitle>
                    <CardDescription>Your latest product updates</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {products.slice(0, 3).map((product) => (
                            <div key={product.id} className="flex items-center space-x-4">
                                <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium">{product.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Last updated {product.lastUpdated}
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        product.status === "published" ? "default" : "secondary"
                                    }
                                >
                                    {product.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Courses</CardTitle>
                    <CardDescription>Your latest course updates</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {courses.slice(0, 3).map((course) => (
                            <div key={course.id} className="flex items-center space-x-4">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium">{course.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {course.enrollments} enrollments
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        course.status === "published" ? "default" : "secondary"
                                    }
                                >
                                    {course.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}