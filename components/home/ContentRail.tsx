import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type { MediaItem } from "@/types/media";
import { PosterGrid } from "@/components/media/PosterGrid";

type ContentRailProps = {
  title: string;
  href: string;
  items: MediaItem[];
};

export function ContentRail({ title, href, items }: ContentRailProps) {
  return (
    <section className="rail">
      <div className="rail-heading">
        <h2>{title}</h2>

        <Link href={href}>
          View All
          <ChevronRight size={16} />
        </Link>
      </div>

      <PosterGrid items={items} />
    </section>
  );
}
