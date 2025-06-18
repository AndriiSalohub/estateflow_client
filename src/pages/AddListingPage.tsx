import AddListing from "@/components/AddListing";

export default function AddListingPage({ userId }: { userId: string }) {
  return (
    <div className="flex gap-8 p-8 justify-center items-start">
      <AddListing ownerId={userId} />
    </div>
  );
}
