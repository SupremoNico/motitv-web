import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { PosterGrid } from "@/components/media/PosterGrid";
import type { PosterItem } from "@/components/media/types";

type ContentRailProps = {
  title: string;
  href: string;
  items: PosterItem[];
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
