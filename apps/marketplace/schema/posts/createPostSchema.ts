import * as z from 'zod';

export const createPostSchema = z.object({
  // Matches PostFormData interface exactly
  vehicleName: z.string().min(1, 'Vehicle name is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  vehicleCategory: z.enum(['HATCHBACK', 'SEDAN', 'SUV', 'TRUCK']),
  location: z.string().min(1, 'Location is required'),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID']),
  kmsDriven: z.coerce.number().int("KMs must be a whole number").min(0, 'KMs driven cannot be negative'),
  seatingCapacity: z.coerce.number().min(1, 'Seating capacity must be at least 1'),
  engineDisplacement: z.coerce.number().int("Engine displacement must be a whole number").min(0, 'Engine displacement must be a positive number'),
  mileage: z.coerce.number().min(0, 'Mileage must be a positive number'),
  maxPower: z.coerce.number().int("Max power must be a whole number").min(0, 'Max power must be a positive number'),
  description: z.string().min(1, 'Description is required').max(500, "Description cannot exceed 500 characters"),
  features: z.union([z.string(), z.array(z.string())]).transform((val) => {
    if (typeof val === 'string') {
      return val.split('\n').map(f => f.trim()).filter(f => f.length > 0);
    }
    return Array.isArray(val) ? val : [];
  }),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits').max(15, 'Contact number cannot exceed 15 digits'),
  yearOfManufacture: z.coerce.number().min(1900).max(new Date().getFullYear()),
  transmission: z.enum(['MANUAL', 'AUTOMATIC']),
  status: z.enum(['DRAFT', 'SOLD', 'PUBLISHED']),
  autoPublish: z.boolean(),
});

export type PostFormData = z.infer<typeof createPostSchema>;
