import { useEffect, useMemo, useState } from "react";
import { usePropertiesStore } from "@/store/propertiesStore";
import { useFilterStore } from "@/store/filterStore";
import ListingCard from "./ListingCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTranslation } from "react-i18next";
import Skeleton from "./Skeleton";

export default function ListingsList() {
  const { t } = useTranslation();
  const { properties, loading, error, fetchAll } = usePropertiesStore();
  const { price, area, rooms, types, propertyTypes, searchQuery, sortBy } =
    useFilterStore();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    if (properties.length === 0) {
      fetchAll("active");
    }
  }, [properties.length, fetchAll]);

  useEffect(() => {
    setCurrentPage(1);
  }, [price, area, rooms, types, propertyTypes, searchQuery, sortBy]);

  const filteredProperties = useMemo(() => {
    let result = properties;

    result = result.filter((property) => {
      if (price[0] > 0 && Number(property.price) < price[0]) return false;
      if (price[1] > 0 && Number(property.price) > price[1]) return false;
      if (area[0] > 0 && Number(property.size) < area[0]) return false;
      if (area[1] > 0 && Number(property.size) > area[1]) return false;
      if (rooms.length > 0 && !rooms.includes(Number(property.rooms)))
        return false;
      if (
        types.length > 0 &&
        !types.includes(property.transactionType.toLowerCase())
      )
        return false;
      if (
        propertyTypes.length > 0 &&
        !propertyTypes.includes(property.propertyType?.toLowerCase() || "")
      )
        return false;

      if (
        searchQuery.trim() &&
        !property.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });

    if (sortBy === "newest") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortBy === "expensive") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "cheap") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    }

    return result;
  }, [
    properties,
    price,
    area,
    rooms,
    types,
    propertyTypes,
    searchQuery,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  const goToPage = (page: any) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const getVisiblePages = () => {
    const delta = 1;
    const pages = [];

    if (totalPages > 0) {
      pages.push(1);
    }

    if (currentPage > delta + 2) {
      pages.push("ellipsis-start");
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - delta - 1) {
      pages.push("ellipsis-end");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (loading) {
    return <Skeleton />;
  }
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {filteredProperties.length > 0 && (
        <div className="px-4 text-sm text-muted-foreground">
          {t("showing")} {startIndex + 1}-
          {Math.min(endIndex, filteredProperties.length)} {t("of")}{" "}
          {filteredProperties.length} {t("properties")}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
        {currentProperties.map((property) => (
          <ListingCard key={property.id} property={property} />
        ))}

        {filteredProperties.length === 0 && properties.length > 0 && (
          <div className="col-span-full text-center p-8 text-muted-foreground">
            {t("noListings")}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center py-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={goToPrevious}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {getVisiblePages().map((page, index) => (
                <PaginationItem key={`${page}-${index}`}>
                  {page === "ellipsis-start" || page === "ellipsis-end" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => goToPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={goToNext}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
