import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProductPageLoading = () => {
  return (
    <section className="px-4 py-16">
      <div className="max-w-6xl mx-auto w-full flex items-start flex-col md:flex-row gap-4">
        {/* mobile-title */}
        <div className="space-y-4 sm:hidden">
          <Skeleton className="h-14" />
          <Skeleton className="h-6" />
        </div>
        {/* top-left */}
        <div className="flex-1">
          <Skeleton className="h-[500px] max-w-[470px]" />
        </div>
        {/* top-right */}
        <div className="max-w-sm space-y-8 flex-1">
          <div className="space-y-4 max-sm:hidden">
            <Skeleton className="h-14" />
            <Skeleton className="h-6" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-4 w-[69%]" />
            <Skeleton className="h-4 w-[75%]" />
          </div>
          <div>
            <Skeleton className="h-12 w-[50%]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPageLoading;
