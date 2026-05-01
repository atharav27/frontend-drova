"use client";

import CarListingCard from "~/components/CarListingCard";
import FilterSideBar from "~/components/FilterSidebar";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
import { X, Search, CirclePlus, Filter } from 'lucide-react';
import { useEffect, useState, useMemo } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer"
import { useVehiclePosts, type VehiclePost } from "~/hooks/query/useVehiclePosts";
import { AuthDialog } from "@repo/ui/components/common/AuthDialog";
import { useLazyAuthAction } from "~/hooks/useAuthAction";
import { PageLoader } from "@repo/ui/components/common/UnifiedLoader";
import { useRoleBasedNavigation } from "~/hooks/useRoleBasedNavigation";

type Filters = {
  price: number[];
  location: string[];
  fuelType: string[];
  condition: string[];
  sellerType: string[];
};

const ITEMS_PER_PAGE = 10;
const MAX_PRICE = 2_000_000;

export default function Page() {
  const [open, setOpen] = useState(false);
  const { showAuthDialog, handleSignIn, handleRegister, closeDialog, setShowAuthDialog } = useLazyAuthAction();

  // Memoize the auth dialog handlers to prevent unnecessary re-renders
  const authDialogHandlers = useMemo(() => ({
    showAuthDialog,
    setShowAuthDialog
  }), [showAuthDialog, setShowAuthDialog]);

  const { navigateToSellerRoute, renderRoleAccessDialog } = useRoleBasedNavigation(authDialogHandlers);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filters, setFilters] = useState<Filters>({
    price: [0, MAX_PRICE],
    location: [],
    fuelType: [],
    condition: [],
    sellerType: [],
  });

  const { data, isLoading, isError, error } = useVehiclePosts(currentPage, ITEMS_PER_PAGE);

  const filteredItems = useMemo(() => {
    const items: VehiclePost[] = data?.items ?? [];
    const minPrice = filters.price[0] ?? 0;
    const maxPrice = filters.price[1] ?? MAX_PRICE;

    const isAny = (arr: string[]) => arr.length === 0 || arr.includes("Any");

    return items.filter((car) => {
      if (car.price < minPrice || car.price > maxPrice) return false;

      if (!isAny(filters.location)) {
        const matched = filters.location.some(
          (loc) => loc.toLowerCase() === (car.location ?? "").toLowerCase()
        );
        if (!matched) return false;
      }

      if (!isAny(filters.fuelType)) {
        const matched = filters.fuelType.some(
          (f) => f.toLowerCase() === (car.fuelType ?? "").toLowerCase()
        );
        if (!matched) return false;
      }

      if (!isAny(filters.sellerType)) {
        const wantsVerified = filters.sellerType.includes("Verified Sellers");
        if (wantsVerified && !car.postedBy?.isVerified) return false;
      }

      return true;
    });
  }, [data?.items, filters]);

  useEffect(() => {
    if (data) {
      // We don't need to store this in state since we use data.items directly
    }
  }, [currentPage]);


  const handleChange = <T extends keyof Filters>(key: T, value: Filters[T]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      price: [0, MAX_PRICE],
      location: [],
      fuelType: [],
      condition: [],
      sellerType: [],
    });
  };

  const removeFilter = (key: keyof Filters) => {
    if (key === "price") {
      setFilters((prev) => ({ ...prev, [key]: [0, MAX_PRICE] }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: [] }));
    }
  };

  const removeSpecificFilterValue = (key: keyof Filters, value: string) => {
    if (key === "price") return;

    const currentValues = filters[key] as string[];
    const newValues = currentValues.filter(item => item !== value);
    setFilters((prev) => ({ ...prev, [key]: newValues }));
  };

  const handleApplyFilters = () => {
    setOpen(false);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery, "in category:", selectedCategory);
  };

  // Enhanced sell vehicle handler with role checking
  const handleSellVehicle = async () => {
    await navigateToSellerRoute("/posts/create");
  };


  if (isLoading) {
    return <PageLoader message="Loading vehicles..." />;
  }
  if (isError) {
    return <p>Error loading vehicles: {error?.message}</p>;
  }

  return (
    <div className="container py-4 sm:py-6 lg:py-10 pb-20 md:pb-6">
      {/* Header Section */}
      <div className="">
        {/* Desktop Header */}
        <div className="hidden md:flex mb-6 justify-between items-start">
          <div>
            <h1 className="text-3xl font-semibold text-textdark">Buy & Sell Marketplace</h1>
            <p className="text-textdark/70 text-xl">Connect with buyers and sellers across India</p>
          </div>
            <Button
              className="bg-textdark text-lg hover:bg-textdark/90 text-white px-6 py-3 flex items-center gap-2"
              onClick={handleSellVehicle}
            >
              <CirclePlus className="w-5 h-5" />
              Sell Your Vehicle
            </Button>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden space-y-4 mb-6">
          <div className="text-left">
            <h1 className="text-2xl font-semibold text-textdark">Buy & Sell Marketplace</h1>
            <p className="text-textdark/70 text-base">Connect with buyers and sellers across India</p>
          </div>
                    <Button
            className="bg-textdark text-white hover:bg-textdark/90 text-base w-full flex items-center gap-2 py-3"
            onClick={handleSellVehicle}
          >
            <CirclePlus className="w-5 h-5" />
            Sell Your Vehicle
          </Button>
        </div>

        {/* Desktop Search Section */}
        <div className="hidden md:flex gap-4 items-center w-full bg-white p-6 shadow-sm rounded-lg">
          {/* Search Input - 50% width */}
          <div className="w-1/2 relative border-primary/30 border rounded-lg">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-textdark/60 w-5 h-5" />
            <Input
              placeholder="Search Listings....."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 h-12 text-lg outline-none w-full px-3 py-2 shadow-sm placeholder:text-textdark/70 placeholder:text-lg border-none"
            />
          </div>

          {/* Select and Button - 50% width */}
          <div className="w-1/2 flex gap-10 items-center">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="flex-1 border-primary/30 px-3 py-6 text-lg text-textdark/70 shadow-sm">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cars">Cars</SelectItem>
                <SelectItem value="bikes">Bikes</SelectItem>
                <SelectItem value="commercial">Commercial Vehicles</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} variant="outline" className="h-12 px-12 bg-white text-lg hover:bg-white border border-primary shadow-sm text-primary hover:text-primary whitespace-nowrap">
              Search
            </Button>
          </div>
        </div>

        {/* Mobile Search Section */}
        <div className="md:hidden space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textdark/60" />
              <Input
                placeholder="Search Listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full h-12 text-base border-primary/30"
              />
            </div>
            {/* Mobile Filter Drawer */}
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon" className="h-12 w-12 border-primary/30">
                  <Filter className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[85vh] overflow-hidden">
                <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-textdark">Filter Vehicles</h2>
                      <DrawerClose asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-5 w-5" />
                        </Button>
                      </DrawerClose>
                    </div>

                    {/* Mobile Filter Content */}
                    <FilterSideBar
                      handleChange={handleChange}
                      clearFilters={clearFilters}
                      removeFilter={removeFilter}
                      filters={filters}
                      onApply={handleApplyFilters}
                    />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 space-y-4 sm:space-y-0">
            {/* Mobile Category Select */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-1/2 flex-1 border-primary/30 px-3 py-2 sm:py-5 text-lg text-textdark/70 shadow-sm">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cars">Cars</SelectItem>
                <SelectItem value="bikes">Bikes</SelectItem>
                <SelectItem value="commercial">Commercial Vehicles</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Search Button */}
            <Button onClick={handleSearch} className="w-full sm:w-1/2  bg-white text-lg hover:bg-white border border-primary shadow-sm text-primary hover:text-primary whitespace-nowrap">
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" py-8">
        <div className="flex gap-4 lg:gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="w-64 md:w-72 lg:w-80 hidden lg:block">
            <FilterSideBar
              handleChange={handleChange}
              clearFilters={clearFilters}
              removeFilter={removeFilter}
              filters={filters}
              onApply={handleApplyFilters}
            />
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {/* Filter Badges */}
            <div className="flex gap-3 mb-6 flex-wrap border-b border-textdark/20 pb-4">
              {/* Mobile/Tablet Filter Button */}
              <div className="hidden md:block lg:hidden">
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger asChild>
                    <Button variant="outline" className="h-full border-primary/30 px-4 py-2 text-base">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="max-h-[85vh] overflow-hidden">
                    <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-semibold text-textdark">Filter Vehicles</h2>
                          <DrawerClose asChild>
                            <Button variant="ghost" size="icon">
                              <X className="h-5 w-5" />
                            </Button>
                          </DrawerClose>
                        </div>

                        {/* Mobile Filter Content */}
                        <FilterSideBar
                          handleChange={handleChange}
                          clearFilters={clearFilters}
                          removeFilter={removeFilter}
                          filters={filters}
                          onApply={handleApplyFilters}
                        />
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>

              {/* Price Range Badge */}
              {(filters.price[0] !== 0 || filters.price[1] !== MAX_PRICE) && (
                <Badge className="flex items-center gap-2 bg-[#F0F0F0] text-textdark px-3 py-1 text-sm md:text-base">
                  ₹{filters.price[0]} - ₹{filters.price[1]}
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-[#F0F0F0]">
                    <X className="w-4 h-4 cursor-pointer text-textdark hover:text-textdark/80" onClick={() => removeFilter("price")} />
                  </Button>
                </Badge>
              )}

              {/* Other filter badges */}
              {filters.location.map((location) => (
                <Badge key={`location-${location}`} className="flex items-center gap-2 bg-[#F0F0F0] text-textdark px-3 py-1 text-sm md:text-base">
                  {location}
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-[#F0F0F0]">
                    <X className="w-4 h-4 cursor-pointer text-textdark hover:text-textdark/80" onClick={() => removeSpecificFilterValue("location", location)} />
                  </Button>
                </Badge>
              ))}

              {filters.fuelType.map((fuelType) => (
                <Badge key={`fuel-${fuelType}`} className="flex items-center gap-2 bg-[#F0F0F0] text-textdark px-3 py-1 text-sm md:text-base">
                  {fuelType}
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-[#F0F0F0]">
                    <X className="w-4 h-4 cursor-pointer text-textdark hover:text-textdark/80" onClick={() => removeSpecificFilterValue("fuelType", fuelType)} />
                  </Button>
                </Badge>
              ))}

              {filters.condition.map((condition) => (
                <Badge key={`condition-${condition}`} className="flex items-center gap-2 bg-[#F0F0F0] text-textdark px-3 py-1 text-sm md:text-base">
                  {condition}
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-[#F0F0F0]">
                    <X className="w-4 h-4 cursor-pointer text-textdark hover:text-textdark/80" onClick={() => removeSpecificFilterValue("condition", condition)} />
                  </Button>
                </Badge>
              ))}

              {filters.sellerType.map((sellerType) => (
                <Badge key={`seller-${sellerType}`} className="flex items-center gap-2 bg-[#F0F0F0] text-textdark px-3 py-1 text-sm md:text-base">
                  {sellerType}
                  <Button variant="ghost" size="sm" className="p-0 hover:bg-[#F0F0F0]">
                    <X className="w-4 h-4 cursor-pointer text-textdark hover:text-textdark/80" onClick={() => removeSpecificFilterValue("sellerType", sellerType)} />
                  </Button>
                </Badge>
              ))}
            </div>

                                    {/* Car Listings Grid */}
            <div className="mb-8">
              {/* Default variant for mobile and desktop */}
              <div className="block sm:hidden md:block">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  {filteredItems.map((car) => (
                    <CarListingCard
                      key={car.id}
                      {...car}
                      userProfile={undefined}
                      variant="default"
                    />
                  ))}
                </div>
              </div>

              {/* Compact variant for tablet (sm to md) */}
              <div className="hidden sm:block md:hidden">
                <div className="space-y-4">
                  {filteredItems.map((car) => (
                    <CarListingCard
                      key={car.id}
                      {...car}
                      userProfile={undefined}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            </div>

            {(data?.items?.length ?? 0) > 0 && filteredItems.length === 0 && (
              <div className="py-16 text-center text-textdark/70">
                No vehicles match your filters.{" "}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-primary underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Load More Button */}
            <div className="text-center mb-8">
              <Button
                variant="outline"
                className="text-primary border border-primary hover:bg-primary/10 hover:text-primary px-8 py-6 text-lg"
              >
                Load More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={closeDialog}
        onSignIn={handleSignIn}
        onRegister={handleRegister}
      />


      {/* Role Access Dialog */}
      {renderRoleAccessDialog()}
    </div>
  );
}
