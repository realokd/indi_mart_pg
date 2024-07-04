import type { Icons } from "@/components/icons"

export interface StoredFile {
    id: string
    name: string
    url: string
}

export interface FooterItem {
    title: string
    items: {
        title: string
        href: string
        external?: boolean
    }[]
}

export interface NavItem {
    title: string
    href?: string
    active?: boolean
    disabled?: boolean
    external?: boolean
    icon?: keyof typeof Icons
    label?: string
    description?: string
}

export interface NavItemWithChildren extends NavItem {
    items?: NavItemWithChildren[]
}

export type MainNavItem = NavItemWithChildren
