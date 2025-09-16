<script setup lang="ts">
/** This is the general purpose heading components */

type HeadingType = 'xsmall' | 'small' | 'base' | 'large' | 'xLarge' | 'xxLarge'
type TextSize = 'small' | 'base' | 'medium' | 'large' | 'xLarge' | 'xxLarge' | 'xxxLarge' | 'xxxxLarge' | 'xxxxxLarge'
type Color = 'primary' | 'black'
type Weight = 'bold' | 'normal' | 'extrabold'
type Transform = '' | 'capitalize' | 'uppercase'

interface Props {
  /** This determine what level of heading this component will be e.g h1,h2 etc */
  type?: HeadingType
  /** This is to add custom styles to overwrite the heading styles */
  overrideStyles?: string
  /** This is heading text size */
  textSize?: TextSize
  /** This is color of the heading */
  color?: Color
  /** This font weight of heading */
  weight?: Weight
  /** This text case of the heading */
  transformText?: Transform
}

const props = withDefaults(defineProps<Props>(), {
  type: 'xxLarge',
  overrideStyles: '',
  textSize: 'large',
  color: 'black',
  weight: 'bold',
  transformText: '',
})

const headingType = computed(() => {
  const sizes = {
    xsmall: '6',
    small: '5',
    base: '4',
    large: '3',
    xLarge: '2',
    xxLarge: '1',
  }

  return sizes[props.type] || '2'
})

const textColor = {
  black: 'text-black',
  primary: 'text-primary',
}

const textSizes = {
  small: 'text-xs md:text-sm',
  base: 'text-xs sm:text-sm md:text-base',
  large: 'text-base md:text-lg',
  medium: 'text-base md:text-[16px]',
  xLarge: 'text-base md:text-xl',
  xxLarge: 'text-lg md:text-2xl',
  xxxLarge: 'text-[20px] sm:text-[25px] md:text-3xl',
  xxxxLarge: 'text-lg md:text-[22px] xl:text-3xl',
  xxxxxLarge: 'text-[25px] sm:text-[30px] xl:text-[40px] 2xl:text-[45px]',
}

const fontWeight = {
  bold: 'font-bold',
  normal: 'font-normal',
  extrabold: 'font-extrabold',
}

const headingStyle = computed(() => {
  if (props.overrideStyles !== '') {
    return props.overrideStyles
  }
  return `${props.transformText} ${textSizes[props.textSize]} ${fontWeight[props.weight]} ${textColor[props.color]}`
})
</script>

<template>
  <component
    :is="`h${headingType}`"
    class="truncate"
    :class="headingStyle"
  >
    <slot />
  </component>
</template>
