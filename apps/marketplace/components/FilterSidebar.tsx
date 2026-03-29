"use client";

import { Slider } from "@repo/ui/components/ui/slider";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

type Filters = {
  price: number[];
  location: string[];
  fuelType: string[];
  condition: string[];
  sellerType: string[];
};

type FilterSidebarProps = {
  handleChange: <T extends keyof Filters>(key: T, value: Filters[T]) => void;
  clearFilters: () => void;
  removeFilter: (key: keyof Filters) => void;
  filters: Filters;
  onApply?: () => void;
};

const locations = ["Bangalore", "Mumbai", "Hyderabad", "Pune", "Delhi"];
const fuelTypes = ["Any", "CNG", "Electric", "Diesel", "Petrol"];
const conditions = ["Any", "Brand New", "Like New", "Good"];
const sellerTypes = ["Any", "Individual", "Dealer", "Verified Sellers"];

const FilterComponent = ({
  handleChange,
  clearFilters,
  removeFilter,
  filters,
  onApply,
}: FilterSidebarProps) => {

  const handleCheckboxChange = (
    filterKey: keyof Filters,
    value: string,
    checked: boolean
  ) => {
    const currentValues = filters[filterKey] as string[];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(item => item !== value);
    }

    handleChange(filterKey, newValues);
  };

  return (
    <div className="p-4 md:p-5 lg:p-6 md:border md:rounded-lg w-full  bg-white">
      <div className="flex justify-between mb-4 md:mb-5 lg:mb-6 items-center">
        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-textdark">Filter Vehicles</h3>
        <Button variant="ghost" onClick={clearFilters} className="text-sm md:text-base text-textdark font-normal px-2 md:px-3">
          Clear All
        </Button>
      </div>

      {/* Price Range */}
      <div className="mb-4 md:mb-5 lg:mb-6">
        <label className="text-base md:text-lg lg:text-xl font-medium text-textdark mb-2 md:mb-3 block">Price Range(₹)</label>
        <Slider
          className="mt-2"
          value={filters.price}
          onValueChange={(val) => handleChange("price", val)}
          max={100000}
          step={1000}
        />
        <div className="flex gap-2 mt-3 md:mt-4 lg:mt-6">
          <Input
            placeholder="Min"
            value={filters.price[0] || ''}
            readOnly
            className="text-sm md:text-base border-textdark/20 placeholder:text-textdark/70 text-textdark h-8 md:h-10"
          />
          <Input
            placeholder="Max"
            value={filters.price[1] || ''}
            readOnly
            className="text-sm md:text-base border-textdark/20 placeholder:text-textdark/70 text-textdark h-8 md:h-10"
          />
        </div>
      </div>

      {/* Location */}
      <div className="mb-4 md:mb-5 lg:mb-6">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <label className="text-base md:text-lg lg:text-xl font-medium text-textdark">Location</label>
          <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-textdark" />
        </div>
        <div className="space-y-2 md:space-y-3">
          {locations.map((location) => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={`location-${location}`}
                checked={filters.location.includes(location)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("location", location, checked as boolean)
                }
                className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 border-textdark/20"
              />
              <label
                htmlFor={`location-${location}`}
                className="text-sm md:text-base lg:text-lg text-textdark/70 cursor-pointer"
              >
                {location}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div className="mb-4 md:mb-5 lg:mb-6">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <label className="text-base md:text-lg lg:text-xl font-medium text-textdark">Fuel Type</label>
          <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-textdark" />
        </div>
        <div className="space-y-2 md:space-y-3">
          {fuelTypes.map((fuelType) => (
            <div key={fuelType} className="flex items-center space-x-2">
              <Checkbox
                id={`fuel-${fuelType}`}
                checked={filters.fuelType.includes(fuelType)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("fuelType", fuelType, checked as boolean)
                }
                className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 border-textdark/20"
              />
              <label
                htmlFor={`fuel-${fuelType}`}
                className="text-sm md:text-base lg:text-lg text-textdark/70 cursor-pointer"
              >
                {fuelType}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="mb-4 md:mb-5 lg:mb-6">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <label className="text-base md:text-lg lg:text-xl font-medium text-textdark">Condition</label>
          <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-textdark" />
        </div>
        <div className="space-y-2 md:space-y-3">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition}`}
                checked={filters.condition.includes(condition)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("condition", condition, checked as boolean)
                }
                className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 border-textdark/20"
              />
              <label
                htmlFor={`condition-${condition}`}
                className="text-sm md:text-base lg:text-lg text-textdark/70 cursor-pointer"
              >
                {condition}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Seller Type */}
      <div className="mb-4 md:mb-5 lg:mb-6">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <label className="text-base md:text-lg lg:text-xl font-medium text-textdark">Seller Type</label>
          <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-textdark" />
        </div>
        <div className="space-y-2 md:space-y-3">
          {sellerTypes.map((sellerType) => (
            <div key={sellerType} className="flex items-center space-x-2">
              <Checkbox
                id={`seller-${sellerType}`}
                checked={filters.sellerType.includes(sellerType)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("sellerType", sellerType, checked as boolean)
                }
                className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 border-textdark/20"
              />
              <label
                htmlFor={`seller-${sellerType}`}
                className="text-sm md:text-base lg:text-lg text-textdark/70 cursor-pointer"
              >
                {sellerType}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <Button
        onClick={onApply}
        className="w-full bg-primary hover:bg-primary/90 text-white py-2 md:py-2.5 lg:py-3 rounded-md text-sm md:text-base"
      >
        Apply
      </Button>
    </div>
  );
};

export default FilterComponent;
