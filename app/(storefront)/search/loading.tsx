import { ProductGridSkeleton } from "@/components/Skeletons";

export default function SearchLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <ProductGridSkeleton />
    </section>
  );
}
