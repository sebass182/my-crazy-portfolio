import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

// Single registration point — import gsap/ScrollTrigger/SplitText/useGSAP from here, never from the packages.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

// Keep transforms on the GPU for the whole tween and after it (default 'auto' drops back to 2D on finish,
// which causes a visible re-raster "snap" on text and images).
gsap.config({ force3D: true })

export { gsap, ScrollTrigger, SplitText, useGSAP }
