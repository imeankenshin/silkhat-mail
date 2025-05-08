import { cva, type VariantProps } from 'class-variance-authority'

export { default as Avatar } from './Avatar.vue'
export { default as AvatarFallback } from './AvatarFallback.vue'
export { default as AvatarImage } from './AvatarImage.vue'

export const avatarVariants = cva('relative flex size-8 shrink-0 overflow-hidden rounded-full', {
  variants: {
    size: {
      sm: 'size-6',
      md: 'size-8',
      lg: 'size-10',
      xl: 'size-12'
    }
  },
  defaultVariants: {
    size: 'md'
  }
})

export type AvatarVariants = VariantProps<typeof avatarVariants>
