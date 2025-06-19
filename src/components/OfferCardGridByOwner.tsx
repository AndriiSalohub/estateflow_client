import OfferCarByOwner from "@/components/OfferCardByOwner";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, PlusCircle, AlertTriangle } from "lucide-react";
import { usePropertiesStore } from "@/store/propertiesStore";
import { useEffect, useState, useMemo } from "react";
import type { UserInfo } from "@/lib/types";
import { ourListingsLimit } from "@/lib/types";
import { useWishlistStore } from "@/store/wishlistStore";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import Skeleton from "./Skeleton";

interface OfferCardGridByOwnerProps {
  user: UserInfo;
}

export default function OfferCardGridByOwner({
  user,
}: OfferCardGridByOwnerProps) {
  const { t } = useTranslation();

  const {
    properties,
    loading: propertiesLoading,
    fetchAll,
  } = usePropertiesStore();

  const {
    wishlist,
    loading: wishlistLoading,
    loadWishlist,
    removeProperty,
  } = useWishlistStore();

  const [statusFilter, setStatusFilter] = useState<
    ("active" | "inactive" | "sold" | "rented")[] | "all" | "unverified"
  >("all");

  useEffect(() => {
    if (
      user.role === "admin" ||
      user.role === "private_seller" ||
      user.role === "agency"
    ) {
      fetchAll();
    } else if (user.role === "renter_buyer") {
      loadWishlist();
    }
  }, [user.role]);

  const handleRefresh = () => {
    fetchAll();
  };

  const filteredProperties = useMemo(() => {
    if (user.role !== "private_seller" && user.role !== "agency") {
      return [];
    }

    const userProperties = properties.filter((p) => p.ownerId === user.userId);

    if (statusFilter === "all") return userProperties;
    if (statusFilter === "unverified")
      return userProperties.filter((p) => !p.isVerified);
    return userProperties.filter(
      (p) => Array.isArray(statusFilter) && statusFilter.includes(p.status),
    );
  }, [properties, user.userId, user.role, statusFilter]);

  if (propertiesLoading || wishlistLoading) {
    return <Skeleton />;
  }

  if (user.role === "renter_buyer") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {wishlist.map((property) => (
          <OfferCarByOwner
            ownerId={user.userId}
            key={property.id}
            role={user.role}
            propertyWishlist={property}
            onRemove={() => removeProperty(property.id)}
            onRefresh={handleRefresh}
          />
        ))}
      </div>
    );
  }

  if (
    user.role === "admin" ||
    user.role === "private_seller" ||
    user.role === "agency"
  ) {
    const canAddMore = user.listingLimit < ourListingsLimit;

    return (
      <>
        <div className="flex items-center gap-2 bg-muted rounded-lg p-2 mb-4">
          <Button
            variant={statusFilter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            {t("all")}
          </Button>
          <Button
            variant={
              Array.isArray(statusFilter) &&
              statusFilter.length === 1 &&
              statusFilter[0] === "active"
                ? "default"
                : "ghost"
            }
            size="sm"
            onClick={() => setStatusFilter(["active"])}
          >
            {t("active")}
          </Button>
          <Button
            variant={
              Array.isArray(statusFilter) &&
              statusFilter.length === 1 &&
              statusFilter[0] === "inactive"
                ? "default"
                : "ghost"
            }
            size="sm"
            onClick={() => setStatusFilter(["inactive"])}
          >
            {t("inactive")}
          </Button>
          <Button
            variant={
              Array.isArray(statusFilter) &&
              statusFilter.includes("sold") &&
              statusFilter.includes("rented")
                ? "default"
                : "ghost"
            }
            size="sm"
            onClick={() => setStatusFilter(["sold", "rented"])}
          >
            {t("sold_rented")}
          </Button>
          <Button
            variant={statusFilter === "unverified" ? "default" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("unverified")}
          >
            <AlertTriangle size={14} className="mr-1" />
            {t("unverified")}(
            {
              properties.filter(
                (p) => !p.isVerified && p.ownerId === user.userId,
              ).length
            }
            )
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProperties.map((property) => (
            <OfferCarByOwner
              key={property.id}
              ownerId={user.userId}
              role={user.role}
              property={property}
              onRefresh={handleRefresh}
            />
          ))}

          {(user.role === "private_seller" && canAddMore) ||
          user.role === "agency" ? (
            <Link
              to="/listing-form-to-add-page"
              search={{ userId: user.userId }}
              className="[&.active]:underline"
            >
              <Card className="overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition">
                <div className="relative p-2">
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md">
                    <PlusCircle className="w-10 h-10 text-muted-foreground" />
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex items-center justify-center text-center text-muted-foreground">
                  <p className="font-semibold">{t("addNewListing")}</p>
                </CardContent>
              </Card>
            </Link>
          ) : user.role === "private_seller" ? (
            <Card className="overflow-hidden flex flex-col">
              <div className="relative p-2">
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md">
                  <Building2 className="w-10 h-10 text-muted-foreground" />
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex items-center justify-center text-center text-muted-foreground">
                <p className="font-semibold">{t("forMoreExtendToAgency")}</p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </>
    );
  }

  return null;
}
