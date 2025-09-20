"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    MapPin,
    Package,
    GraduationCap,
    Star,
    Eye,
    User,
} from "lucide-react";
import Link from "next/link";
import { profileAPI, ProfileInfo } from "@/lib/api/profile";
import {
    getProductsByArtistId,
    Product,
    ArtistProductsResponse,
} from "@/lib/api/product";
import { PublicProductSection } from "@/components/PublicProductSection";
import { CourseSection } from "@/components/dashboard/CourseSection";
import { ArtistProfileBanner } from "@/components/artist/ArtistProfileBanner";
import { coursesAPI, Course } from "@/lib/api/courses";

export default function ArtistProfilePage() {
    const params = useParams();
    const artistId = params.id as string;

    const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [productLoading, setProductLoading] = useState(false);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        if (!artistId) return;

        const fetchArtistData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch profile info
                const profileResponse = await profileAPI.getProfile(
                    parseInt(artistId)
                );
                setProfileInfo(profileResponse.data);

                // Fetch real products by artist
                setProductLoading(true);
                const productsResponse = await getProductsByArtistId(
                    parseInt(artistId)
                );

                if (productsResponse.success && productsResponse.data) {
                    // Flatten products from the nested structure
                    const allProducts: Product[] = [];
                    if (productsResponse.data.productCategories) {
                        productsResponse.data.productCategories.forEach(
                            (category) => {
                                if (category.products) {
                                    allProducts.push(...category.products);
                                }
                            }
                        );
                    }
                    setProducts(allProducts);
                } else {
                    console.error(
                        "Failed to fetch products:",
                        productsResponse.message
                    );
                    setProducts([]);
                }

                // Fetch real courses data
                setCoursesLoading(true);
                try {
                    const coursesResponse = await coursesAPI.getAllCourses();
                    // Filter courses by this artist
                    const artistCourses = coursesResponse.data.filter(course => 
                        course.artist?.user?.id === parseInt(artistId) || 
                        course.artist?.id === parseInt(artistId)
                    );
                    setCourses(artistCourses);
                } catch (coursesError) {
                    console.error("Failed to fetch courses:", coursesError);
                    setCourses([]);
                } finally {
                    setCoursesLoading(false);
                }
            } catch (error: any) {
                console.error("Failed to fetch artist data:", error);
                setError("Failed to load artist profile");
            } finally {
                setIsLoading(false);
                setProductLoading(false);
            }
        };

        fetchArtistData();
    }, [artistId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">
                        Loading artist profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !profileInfo) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
                        <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">
                        Artist Not Found
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        {error ||
                            "The artist profile you're looking for doesn't exist."}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button asChild variant="outline">
                            <Link href="/explore">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Explore
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/">Go Home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const activeDescription = profileInfo.descriptions.find((d) => d.isActive);

    return (
        <div className="min-h-screen bg-background">
            <ArtistProfileBanner profileInfo={profileInfo} />

            {/* Content Tabs */}
            <div className="container mx-auto px-4 pb-8">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="profile">
                            <User className="w-4 h-4 mr-2" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="products">
                            <Package className="w-4 h-4 mr-2" />
                            Products ({products.length})
                        </TabsTrigger>
                        <TabsTrigger value="courses">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Courses ({courses.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-6">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <Package className="w-8 h-8 text-blue-600 mb-2" />
                                    <div className="text-2xl font-bold">
                                        {products.length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Products
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <GraduationCap className="w-8 h-8 text-green-600 mb-2" />
                                    <div className="text-2xl font-bold">
                                        {courses.length}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Courses
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <Star className="w-8 h-8 text-yellow-600 mb-2" />
                                    <div className="text-2xl font-bold">
                                        4.8
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Rating
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <Eye className="w-8 h-8 text-purple-600 mb-2" />
                                    <div className="text-2xl font-bold">
                                        1.2k
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Views
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* About Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About</CardTitle>
                                <CardDescription>
                                    Learn more about this artist
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-sm leading-relaxed">
                                        {activeDescription?.descriptionText
                                            .replace("```", "")
                                            .replace("```", "")
                                            .replace("markdown", "")
                                            .trim()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills & Expertise */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Skills & Expertise</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium mb-3 flex items-center gap-2">
                                            <Package className="w-4 h-4" />
                                            Profession
                                        </h4>
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                {profileInfo.profession
                                                    .iconUrl && (
                                                    <img
                                                        src={
                                                            profileInfo
                                                                .profession
                                                                .iconUrl
                                                        }
                                                        alt={
                                                            profileInfo
                                                                .profession.name
                                                        }
                                                        className="w-6 h-6"
                                                    />
                                                )}
                                                <span className="font-medium">
                                                    {
                                                        profileInfo.profession
                                                            .name
                                                    }
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {
                                                    profileInfo.profession
                                                        .description
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-3 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Location
                                        </h4>
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <p className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                <span>
                                                    {profileInfo.businessLocation ||
                                                        "Location not specified"}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Background & Experience */}
                        {activeDescription?.backgroundInfo && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Background & Experience
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm leading-relaxed">
                                        {activeDescription.backgroundInfo}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="products" className="space-y-6">
                        {productLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-muted-foreground">
                                    Loading products...
                                </p>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <Card
                                        key={product.id}
                                        className="overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="aspect-square relative bg-muted">
                                            {product.productMedia &&
                                            product.productMedia[0] ? (
                                                <img
                                                    src={
                                                        product.productMedia[0]
                                                            .genereatedUrl ||
                                                        product.productMedia[0]
                                                            .imageUrl
                                                    }
                                                    alt={
                                                        product.productMedia[0]
                                                            .altText ||
                                                        product.productName
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-12 h-12 text-muted-foreground" />
                                                </div>
                                            )}
                                            {product.isDescriptionAccepted && (
                                                <Badge className="absolute top-2 right-2 bg-purple-600">
                                                    AI Enhanced
                                                </Badge>
                                            )}
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                                                {product.productName}
                                            </h3>
                                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                                {product.productDescription ||
                                                    "No description available"}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold">
                                                    ₹
                                                    {product.basePrice.toLocaleString()}
                                                </span>
                                                <Button asChild size="sm">
                                                    <Link
                                                        href={`/product/${product.id}`}
                                                    >
                                                        View Details
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No Products Yet
                                </h3>
                                <p className="text-muted-foreground">
                                    This artist hasn't published any products
                                    yet.
                                </p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="courses" className="space-y-6">
                        {coursesLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-muted-foreground">
                                    Loading courses...
                                </p>
                            </div>
                        ) : courses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map((course) => (
                                    <Card
                                        key={course.id}
                                        className="overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="aspect-video relative bg-muted">
                                            <img
                                                src="/pottery-course-thumbnail.jpg"
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <Badge variant="secondary" className="bg-black/70 text-white">
                                                    {course.videos?.length || 0} videos
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                                                {course.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                                {course.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold text-green-600">
                                                    Free Course
                                                </span>
                                                <Button asChild size="sm">
                                                    <Link
                                                        href={`/courses/${course.id}`}
                                                    >
                                                        View Course
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No Courses Yet
                                </h3>
                                <p className="text-muted-foreground">
                                    This artist hasn't published any courses yet.
                                </p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
