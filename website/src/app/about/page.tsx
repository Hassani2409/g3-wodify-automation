import { ClubMotion, AboutPreview, FeatureCards, Visit } from '@/components/ClubSections';
import s from '@/components/Club.module.css';
export const metadata = {title:'Über G3',alternates:{canonical:'/about'}};
export default function About(){return <ClubMotion><header className={s.pageTitle}><h1>Willkommen bei G3.</h1><p>Unsere Box liegt etwas versteckt im Berliner Hinterhof. Was dich erwartet: persönliches Training und Menschen, die gemeinsam an sich arbeiten.</p></header><AboutPreview/><FeatureCards/><Visit/></ClubMotion>}
