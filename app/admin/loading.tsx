import { AdminSkeleton } from "@/components/Skeletons";

export default function AdminLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
      <AdminSkeleton />
    </section>
  );
}
