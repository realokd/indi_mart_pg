import Link from "next/link"

import { siteConfig } from "@/config/site"
import type { getCategories, getFeaturedProducts } from "@/lib/queries/product"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { ContentSection } from "@/components/content-section"
import { Icons } from "@/components/icons"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { ProductCard } from "@/components/product-card"
import { Shell } from "@/components/shell"
import { StoreCard } from "@/components/store-card"

import { CategoryCard } from "./category-card"

interface LobbyProps {
  productsPromise: ReturnType<typeof getFeaturedProducts>
  categoriesPromise: ReturnType<typeof getCategories>
}

export async function Lobby({
  productsPromise,
  categoriesPromise,
}: LobbyProps) {
  // @see the "Parallel data fetching" docs: https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#parallel-data-fetching
  const [ products, categories, stores] = await Promise.all([
    productsPromise,
    categoriesPromise,
  ])

  return (
    <Shell className="max-w-6xl gap-0">
      <PageHeader
        as="section"
        className="mx-auto items-center gap-2 text-center"
        withPadding
      >
        <PageHeaderHeading
          className="animate-fade-up"
          style={{ animationDelay: "0.20s", animationFillMode: "both" }}
        >
          Foundation for your commerce platform
        </PageHeaderHeading>
        <PageHeaderDescription
          className="max-w-[46.875rem] animate-fade-up"
          style={{ animationDelay: "0.30s", animationFillMode: "both" }}
        >
          Skateshop is an open-source platform for building and customizing your
          own commerce platform with ease.
        </PageHeaderDescription>
        <PageActions
          className="animate-fade-up"
          style={{ animationDelay: "0.40s", animationFillMode: "both" }}
        >
          <Link href="/products" className={cn(buttonVariants())}>
            Buy now
          </Link>
          <Link
            href="/dashboard/stores"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Sell now
          </Link>
        </PageActions>
      </PageHeader>
      <section
        className="grid animate-fade-up grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-4"
        style={{ animationDelay: "0.50s", animationFillMode: "both" }}
      >
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </section>
      <ContentSection
        title="Featured products"
        description="Explore products from around the world"
        href="/products"
        linkText="View all products"
        className="pt-14 md:pt-20 lg:pt-24"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ContentSection>
    </Shell>
  )
}
