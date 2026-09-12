type HostListing = {
  id: number;
  title: string;
  location: string;
  status: HostListingStatus;
  imageUrl?: string;
};

type HostListingStatus = "LIVE" | "DRAFT";

export type { HostListing, HostListingStatus };
