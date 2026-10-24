import { ClubMotion, CoachPreview, Testimonials } from '@/components/ClubSections';
import s from '@/components/Club.module.css';
export const metadata = {title:'Coaches',alternates:{canonical:'/coaches'}};
export default function Coaches(){return <ClubMotion><header className={s.pageTitle}><h1>Dein Coaching bei G3.</h1><p>Deine Erfahrung, deine Ziele und dein nächster Schritt stehen im Mittelpunkt. Lerne unsere Coaches persönlich in der Box kennen.</p></header><CoachPreview/><Testimonials/></ClubMotion>}
