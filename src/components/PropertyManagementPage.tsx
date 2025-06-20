import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Check,
  Trash2,
  Eye,
  Home,
  MapPin,
  Calendar,
  User,
  Filter,
  AlertTriangle,
  CheckCircle,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { usePropertiesStore } from "@/store/propertiesStore";
import { useTranslation } from "react-i18next";
import Skeleton from "./Skeleton";

interface ActionLoading {
  [key: string]: boolean;
}

export default function PropertyManagement() {
  const { t } = useTranslation();
  const { properties, loading, error, fetchAll, remove, verifyProperty } =
    usePropertiesStore();

  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<ActionLoading>({});

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleVerifyProperty = async (propertyId: any) => {
    setActionLoading((prev) => ({ ...prev, [`verify-${propertyId}`]: true }));

    try {
      await verifyProperty(propertyId);
      toast(t("success"), {
        description: t("propertyVerifiedSuccess"),
      });
    } catch (error) {
      toast(t("error"), {
        description: t("propertyVerifyFailed"),
      });
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [`verify-${propertyId}`]: false,
      }));
    }
  };

  const handleDeleteProperty = async (propertyId: any) => {
    setActionLoading((prev) => ({ ...prev, [`delete-${propertyId}`]: true }));

    try {
      await remove(propertyId);
      toast(t("success"), {
        description: t("propertyDeletedSuccess"),
      });
    } catch (error: any) {
      toast(t("error"), {
        description: error || t("propertyDeleteFailed"),
      });
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [`delete-${propertyId}`]: false,
      }));
    }
  };

  const handleViewDocument = (documentUrl: string, propertyTitle: string) => {
    if (!documentUrl) {
      toast(t("error"), {
        description: t("noDocumentAvailable"),
      });
      return;
    }

    window.open(documentUrl, "_blank");
    toast.info(t("openingDocument", { propertyTitle }));
  };

  const filteredProperties = properties.filter((property) => {
    if (filter === "verified") return property.isVerified;
    if (filter === "unverified") return !property.isVerified;
    return true;
  });

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: any, currency: any) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(Number(price));
  };

  useEffect(() => {
    if (error) {
      toast(t("error"), {
        description: t(error) || error || t("genericError"),
      });
    }
  }, [error]);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("propertyManagement")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("propertyManagementDescription")}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className="rounded-md"
            >
              {t("all")} ({properties.length})
            </Button>
            <Button
              variant={filter === "unverified" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("unverified")}
              className="rounded-md"
            >
              <AlertTriangle size={14} className="mr-1" />
              {t("unverified")} (
              {properties.filter((p) => !p.isVerified).length})
            </Button>
            <Button
              variant={filter === "verified" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("verified")}
              className="rounded-md"
            >
              <CheckCircle size={14} className="mr-1" />
              {t("verified")} ({properties.filter((p) => p.isVerified).length})
            </Button>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">
              {t("noPropertiesFound")}
            </h3>
            <p className="text-muted-foreground">
              {filter === "all"
                ? t("noPropertiesAvailable")
                : `No ${filter} properties found.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-card rounded-lg border hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative">
                  <img
                    src={
                      property.images?.[0]?.imageUrl ||
                      "https://via.placeholder.com/300x200"
                    }
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        property.isVerified
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {property.isVerified ? "Verified" : "Pending"}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full capitalize">
                      {property.transactionType}
                    </span>
                  </div>

                  {!property.isVerified && property.documentUrl && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 p-1 rounded-full">
                        <FileText size={12} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                      {property.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={14} />
                      <span className="line-clamp-1">{property.address}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Home size={14} />
                          <span>
                            {property.rooms} {t("rooms")}
                          </span>
                        </div>
                        <span>{property.size}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-lg">
                        {formatPrice(property.price, property.currency)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User size={14} />
                      <span>{property.owner?.username}</span>
                      <span>•</span>
                      <Calendar size={14} />
                      <span>{formatDate(property.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    {!property.isVerified && (
                      <>
                        {property.documentUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 cursor-pointer"
                            onClick={() =>
                              handleViewDocument(
                                property.documentUrl,
                                property.title,
                              )
                            }
                          >
                            <FileText size={14} />
                            {t("document")}
                          </Button>
                        )}

                        <Button
                          size="sm"
                          className="gap-1 cursor-pointer"
                          onClick={() => handleVerifyProperty(property.id)}
                          disabled={actionLoading[`verify-${property.id}`]}
                        >
                          <Check size={14} />
                          {actionLoading[`verify-${property.id}`]
                            ? t("verifying")
                            : t("verify")}
                        </Button>
                      </>
                    )}

                    <Link
                      to="/listing-page"
                      search={{ propertyId: property.id }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 cursor-pointer"
                      >
                        <Eye size={14} />
                        {t("view")}
                      </Button>
                    </Link>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1 cursor-pointer"
                        >
                          <Trash2 size={14} />
                          {actionLoading[`delete-${property.id}`]
                            ? t("deleting")
                            : t("delete")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t("deleteProperty")}</DialogTitle>
                          <DialogDescription>
                            {t("deletePropertyConfirmation1")} "{property.title}
                            "? {t("deletePropertyConfirmation2")}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            type="submit"
                            className="gap-2 cursor-pointer"
                            onClick={() => handleDeleteProperty(property.id)}
                            disabled={actionLoading[`delete-${property.id}`]}
                          >
                            {actionLoading[`delete-${property.id}`]
                              ? t("deleting")
                              : t("delete")}
                          </Button>
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              className="gap-2 cursor-pointer"
                            >
                              {t("cancel")}
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
