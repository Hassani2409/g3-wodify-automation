"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Clock, User, BarChart, Calendar, CheckCircle, Info, Loader2, ListPlus 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Mock data for courses - replace with real API calls later
const coursesData = [
  {
    id: '1',
    name: 'CrossFit WOD',
    type: 'crossfit',
    trainer: 'Dave',
    day: 'Montag',
    startTime: '06:00',
    endTime: '07:00',
    level: 'Alle Level',
    spotsTotal: 12,
    spotsBooked: 8,
    description: 'Klassisches CrossFit Training mit täglich wechselnden Workouts',
    price: 'Mitgliedschaft',
  },
  {
    id: '2',
    name: 'CrossFit Foundations',
    type: 'foundations',
    trainer: 'Johannes',
    day: 'Montag',
    startTime: '18:00',
    endTime: '19:00',
    level: 'Anfänger',
    spotsTotal: 8,
    spotsBooked: 5,
    description: 'Perfekt für CrossFit-Einsteiger. Lerne die Grundbewegungen.',
    price: 'Mitgliedschaft',
  },
  {
    id: '3',
    name: 'Olympic Weightlifting',
    type: 'olympic',
    trainer: 'Flo',
    day: 'Montag',
    startTime: '19:00',
    endTime: '20:30',
    level: 'Fortgeschritten',
    spotsTotal: 6,
    spotsBooked: 6,
    description: 'Technikfokussiertes Training für Reißen und Stoßen.',
    price: 'Mitgliedschaft',
  },
  {
    id: '4',
    name: 'CrossFit WOD',
    type: 'crossfit',
    trainer: 'Laura',
    day: 'Dienstag',
    startTime: '06:00',
    endTime: '07:00',
    level: 'Alle Level',
    spotsTotal: 12,
    spotsBooked: 10,
    description: 'Intensives CrossFit Training am Morgen',
    price: 'Mitgliedschaft',
  },
  {
    id: '5',
    name: 'Gymnastics & Mobility',
    type: 'gymnastics',
    trainer: 'Laura',
    day: 'Dienstag',
    startTime: '18:00',
    endTime: '19:00',
    level: 'Alle Level',
    spotsTotal: 8,
    spotsBooked: 3,
    description: 'Entwickle Körperbeherrschung und Beweglichkeit.',
    price: 'Mitgliedschaft',
  },
  {
    id: '6',
    name: 'Strength & Conditioning',
    type: 'strength',
    trainer: 'Leon',
    day: 'Dienstag',
    startTime: '19:00',
    endTime: '20:15',
    level: 'Mittelstufe',
    spotsTotal: 10,
    spotsBooked: 7,
    description: 'Fokus auf Kraftaufbau und athletische Entwicklung.',
    price: 'Mitgliedschaft',
  },
  {
    id: '7',
    name: 'CrossFit WOD',
    type: 'crossfit',
    trainer: 'Dave',
    day: 'Mittwoch',
    startTime: '12:00',
    endTime: '13:00',
    level: 'Alle Level',
    spotsTotal: 12,
    spotsBooked: 4,
    description: 'Mittagstraining für alle Level',
    price: 'Mitgliedschaft',
  },
  {
    id: '8',
    name: 'Yoga & Recovery',
    type: 'yoga',
    trainer: 'Sarah',
    day: 'Mittwoch',
    startTime: '18:30',
    endTime: '19:30',
    level: 'Alle Level',
    spotsTotal: 15,
    spotsBooked: 12,
    description: 'Entspannung und Regeneration für Körper und Geist.',
    price: 'Mitgliedschaft',
  },
  {
    id: '9',
    name: 'CrossFit WOD',
    type: 'crossfit',
    trainer: 'Flo',
    day: 'Donnerstag',
    startTime: '06:00',
    endTime: '07:00',
    level: 'Alle Level',
    spotsTotal: 12,
    spotsBooked: 11,
    description: 'Frühmorgendliches Training mit Flo',
    price: 'Mitgliedschaft',
  },
  {
    id: '10',
    name: 'Olympic Weightlifting',
    type: 'olympic',
    trainer: 'Flo',
    day: 'Donnerstag',
    startTime: '19:00',
    endTime: '20:30',
    level: 'Fortgeschritten',
    spotsTotal: 6,
    spotsBooked: 4,
    description: 'Perfektioniere deine Technik im Gewichtheben.',
    price: 'Mitgliedschaft',
  },
  {
    id: '11',
    name: 'CrossFit WOD',
    type: 'crossfit',
    trainer: 'Johannes',
    day: 'Freitag',
    startTime: '18:00',
    endTime: '19:00',
    level: 'Alle Level',
    spotsTotal: 12,
    spotsBooked: 9,
    description: 'Friday Night Lights - Wochenabschluss mit Power',
    price: 'Mitgliedschaft',
  },
  {
    id: '12',
    name: 'CrossFit WOD',
    type: 'crossfit',
    trainer: 'Laura',
    day: 'Samstag',
    startTime: '09:00',
    endTime: '10:00',
    level: 'Alle Level',
    spotsTotal: 15,
    spotsBooked: 13,
    description: 'Wochenend-Workout für die ganze Community',
    price: 'Mitgliedschaft',
  },
  {
    id: '13',
    name: 'Open Gym',
    type: 'open',
    trainer: 'Betreut',
    day: 'Samstag',
    startTime: '10:00',
    endTime: '12:00',
    level: 'Alle Level',
    spotsTotal: 20,
    spotsBooked: 8,
    description: 'Freies Training mit Betreuung',
    price: 'Mitgliedschaft',
  },
  {
    id: '14',
    name: 'Yoga & Recovery',
    type: 'yoga',
    trainer: 'Sarah',
    day: 'Sonntag',
    startTime: '10:00',
    endTime: '11:00',
    level: 'Alle Level',
    spotsTotal: 15,
    spotsBooked: 8,
    description: 'Entspannter Start in die neue Woche',
    price: 'Mitgliedschaft',
  },
];

// Course type definitions with colors
const courseTypes: Record<string, { label: string; color: string; lightColor: string; textColor: string }> = {
  crossfit: { label: 'CrossFit', color: 'bg-accent-500', lightColor: 'bg-accent-100', textColor: 'text-accent-800' },
  foundations: { label: 'Foundations', color: 'bg-secondary-500', lightColor: 'bg-secondary-100', textColor: 'text-secondary-800' },
  olympic: { label: 'Olympic Lifting', color: 'bg-red-500', lightColor: 'bg-red-100', textColor: 'text-red-800' },
  gymnastics: { label: 'Gymnastics', color: 'bg-purple-500', lightColor: 'bg-purple-100', textColor: 'text-purple-800' },
  strength: { label: 'Strength', color: 'bg-blue-500', lightColor: 'bg-blue-100', textColor: 'text-blue-800' },
  yoga: { label: 'Yoga', color: 'bg-teal-500', lightColor: 'bg-teal-100', textColor: 'text-teal-800' },
  open: { label: 'Open Gym', color: 'bg-gray-500', lightColor: 'bg-gray-100', textColor: 'text-gray-800' }
};

const levels = ['Alle', 'Anfänger', 'Mittelstufe', 'Fortgeschritten', 'Alle Level'];
const days = ['Alle', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const timeSlots = ['Alle', 'Früh (6-9h)', 'Vormittag (9-12h)', 'Mittag (12-15h)', 'Nachmittag (15-18h)', 'Abend (18-21h)'];

interface Course {
  id: string;
  name: string;
  type: string;
  trainer: string;
  day: string;
  startTime: string;
  endTime: string;
  level: string;
  spotsTotal: number;
  spotsBooked: number;
  description: string;
  price: string;
}

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  onBook: (course: Course) => void;
  onJoinWaitlist: (course: Course) => void;
  isBooking: boolean;
  user: any;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  courseName: string;
}

// Course Detail Modal Component
const CourseDetailModal = ({ course, onClose, onBook, onJoinWaitlist, isBooking, user }: CourseDetailModalProps) => {
  if (!course) return null;
  const typeInfo = courseTypes[course.type];
  const spotsLeft = course.spotsTotal - course.spotsBooked;
  const isCourseFull = spotsLeft === 0;

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`h-4 ${typeInfo.color}`} />
          <Card className="relative border-0 shadow-none">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
            <CardContent className="p-8">
              <Badge className={`${typeInfo.color} text-white mb-4 shadow-md text-sm px-3 py-1`}>
                {typeInfo.label}
              </Badge>
              <h2 className="text-3xl font-bold mb-3 text-primary-500 font-heading">
                {course.name}
              </h2>
              <p className="text-lg text-gray-600 mb-6 font-body">
                {course.description}
              </p>

              <div className="space-y-4 text-base mb-8 font-body">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-accent-500" />
                  <strong>{course.day}, {course.startTime} - {course.endTime} Uhr</strong>
                </div>
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-3 text-accent-500" />
                  <strong>Coach:</strong> {course.trainer}
                </div>
                <div className="flex items-center">
                  <BarChart className="w-5 h-5 mr-3 text-accent-500" />
                  <strong>Level:</strong> {course.level}
                </div>
                <div className="flex items-center">
                  <Info className="w-5 h-5 mr-3 text-accent-500" />
                  <strong>{isCourseFull ? 'Kurs ausgebucht' : `${spotsLeft} freie Plätze`}</strong>
                </div>
              </div>

              {user ? (
                <div className="space-y-3">
                  {!isCourseFull ? (
                    <Button
                      onClick={() => onBook(course)}
                      disabled={isBooking}
                      className="w-full text-lg py-3 font-semibold font-button"
                    >
                      {isBooking ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Wird gebucht...
                        </>
                      ) : (
                        `Kurs buchen (${spotsLeft} Plätze frei)`
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onJoinWaitlist(course)}
                      disabled={isBooking}
                      className="w-full text-lg py-3 font-semibold font-button"
                      variant="outline"
                    >
                      {isBooking ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Wird hinzugefügt...
                        </>
                      ) : (
                        <>
                          <ListPlus className="mr-2 h-5 w-5" />
                          Auf die Warteliste
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Button onClick={handleLogin} className="w-full text-lg py-3 font-semibold font-button">
                    Anmelden zum Buchen
                  </Button>
                  <p className="text-center text-sm text-gray-600 font-body">
                    Du musst angemeldet sein, um Kurse zu buchen
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, type, courseName }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-0 shadow-none">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-6 text-secondary-500" />
              <h2 className="text-2xl font-bold mb-4 text-secondary-500 font-heading">
                {type === 'booking' ? 'Erfolgreich gebucht!' : 'Auf Warteliste gesetzt!'}
              </h2>
              <p className="text-lg mb-6 text-foreground font-body">
                {type === 'booking'
                  ? `Du bist für "${courseName}" angemeldet. Wir freuen uns auf dich!`
                  : `Du stehst jetzt auf der Warteliste für "${courseName}". Wir benachrichtigen dich, sobald ein Platz frei wird.`
                }
              </p>
              <Button onClick={onClose} className="font-button">
                Verstanden
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function SchedulePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [showSuccess, setShowSuccess] = useState({ isOpen: false, type: '', courseName: '' });
  const [filters, setFilters] = useState({ day: 'Alle', level: 'Alle', type: 'Alle', timeSlot: 'Alle' });
  const [courses, setCourses] = useState<Course[]>(coursesData); // Start with mock data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses from API on mount
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with your actual backend URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/schedule/classes`);

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();

        if (data.success && data.classes) {
          setCourses(data.classes);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Kurse konnten nicht geladen werden. Verwende Mock-Daten.');
        // Keep using mock data on error
        setCourses(coursesData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on selected filters
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesDay = filters.day === 'Alle' || course.day === filters.day;
      const matchesLevel = filters.level === 'Alle' || course.level === filters.level;
      const matchesType = filters.type === 'Alle' || courseTypes[course.type].label === filters.type;

      let matchesTimeSlot = true;
      if (filters.timeSlot !== 'Alle') {
        const startHour = parseInt(course.startTime.split(':')[0]);
        switch (filters.timeSlot) {
          case 'Früh (6-9h)':
            matchesTimeSlot = startHour >= 6 && startHour < 9;
            break;
          case 'Vormittag (9-12h)':
            matchesTimeSlot = startHour >= 9 && startHour < 12;
            break;
          case 'Mittag (12-15h)':
            matchesTimeSlot = startHour >= 12 && startHour < 15;
            break;
          case 'Nachmittag (15-18h)':
            matchesTimeSlot = startHour >= 15 && startHour < 18;
            break;
          case 'Abend (18-21h)':
            matchesTimeSlot = startHour >= 18 && startHour <= 21;
            break;
          default:
            matchesTimeSlot = true;
        }
      }

      return matchesDay && matchesLevel && matchesType && matchesTimeSlot;
    });
  }, [filters, courses]);

  // Group courses by day for better display
  const coursesByDay = useMemo(() => {
    const daysList = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
    return daysList.reduce((acc, day) => {
      acc[day] = filteredCourses
        .filter(course => course.day === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
      return acc;
    }, {} as Record<string, Course[]>);
  }, [filteredCourses]);

  const handleBookCourse = async (course: Course) => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    setIsBooking(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/schedule/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          class_id: course.id,
          user_id: user.id,
          user_email: user.email,
          user_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.detail || 'Booking failed');
      }

      console.log('Booking successful:', data);
      setShowSuccess({ isOpen: true, type: 'booking', courseName: course.name });
      setSelectedCourse(null);

      // Refresh courses to update availability
      const coursesResponse = await fetch(`${apiUrl}/api/schedule/classes`);
      const coursesData = await coursesResponse.json();
      if (coursesData.success) {
        setCourses(coursesData.classes);
      }
    } catch (error) {
      console.error("Buchungsfehler:", error);
      alert("Es gab ein Problem bei der Buchung. Bitte versuche es erneut oder kontaktiere uns direkt.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleJoinWaitlist = async (course: Course) => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    setIsBooking(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/schedule/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          class_id: course.id,
          user_id: user.id,
          user_email: user.email,
          user_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.detail || 'Waitlist join failed');
      }

      console.log('Waitlist join successful:', data);
      setShowSuccess({ isOpen: true, type: 'waitlist', courseName: course.name });
      setSelectedCourse(null);
    } catch (error) {
      console.error("Wartelisten-Fehler:", error);
      alert("Es gab ein Problem beim Hinzufügen zur Warteliste. Bitte versuche es erneut oder kontaktiere uns direkt.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 text-white bg-linear-to-br from-primary-500 to-secondary-500 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white font-heading">
            Kursplan & Buchung
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-body">
            Finde dein nächstes Workout. Buche direkt online oder nutze unser Wodify-System.
          </p>
        </div>
      </section>

      {/* Wodify Integration Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-foreground">
              Live Kursplan - Wodify Integration
            </h2>
            <p className="text-xl text-muted-foreground font-body">
              Der offizielle G3 Kursplan - immer aktuell, direkt aus unserem Wodify-System.
            </p>
          </div>

          <Card className="bg-linear-to-br from-secondary-50 to-accent-50 border-2 border-dashed border-accent-500">
            <CardContent className="p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <Calendar className="w-20 h-20 mx-auto mb-6 text-primary-500" />
                <h3 className="text-3xl font-bold mb-4 text-primary-500 font-heading">
                  Wodify Kursplan
                </h3>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed font-body">
                  Hier wird der offizielle Wodify-Kursplan eingebettet. Mit dem iFrame-Code aus dem
                  Wodify-Adminbereich erhalten deine Mitglieder direkten Zugang zum Live-System mit:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="font-semibold text-secondary-700 mb-2 font-heading">✓ Live-Synchronisation</div>
                    <div className="text-gray-600 font-body">Alle Änderungen sofort sichtbar</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="font-semibold text-secondary-700 mb-2 font-heading">✓ Direkte Buchungen</div>
                    <div className="text-gray-600 font-body">Kurse buchen ohne Umwege</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="font-semibold text-secondary-700 mb-2 font-heading">✓ Wartelisten</div>
                    <div className="text-gray-600 font-body">Automatische Verwaltung voller Kurse</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="font-semibold text-secondary-700 mb-2 font-heading">✓ Mitglieder-Login</div>
                    <div className="text-gray-600 font-body">Zugang zu persönlichen Buchungen</div>
                  </div>
                </div>

                <div className="bg-gray-100 p-6 rounded-lg text-left">
                  <div className="text-sm font-semibold text-gray-700 mb-3 font-heading">
                    📋 Für die Integration benötigt:
                  </div>
                  <div className="bg-white p-4 rounded border font-mono text-sm text-gray-700 overflow-x-auto">
                    <div className="text-secondary-600 mb-2">// Beispiel iFrame-Code aus Wodify:</div>
                    <code>
                      &lt;iframe
                      <br />
                      &nbsp;&nbsp;src=&quot;https://app.wodify.com/schedule/DEINE_LOCATION_ID&quot;
                      <br />
                      &nbsp;&nbsp;width=&quot;100%&quot;
                      <br />
                      &nbsp;&nbsp;height=&quot;800&quot;
                      <br />
                      &nbsp;&nbsp;frameborder=&quot;0&quot;&gt;
                      <br />
                      &lt;/iframe&gt;
                    </code>
                  </div>
                  <div className="text-xs text-gray-600 mt-2 font-body">
                    Zu finden in: Wodify Admin → Settings → Website Integration
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Schedule Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-foreground">
              Interaktiver Kursplan
            </h2>
            <p className="text-xl text-muted-foreground font-body">
              Überblick über unser Kursangebot - für detaillierte Buchungen nutze den Wodify-Plan oben.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 font-heading">Filter</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 font-body">Tag</label>
                  <Select value={filters.day} onValueChange={(value) => setFilters(prev => ({ ...prev, day: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 font-body">Kurstyp</label>
                  <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alle">Alle Kurstypen</SelectItem>
                      {Object.values(courseTypes).map(type => (
                        <SelectItem key={type.label} value={type.label}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 font-body">Level</label>
                  <Select value={filters.level} onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 font-body">Uhrzeit</label>
                  <Select value={filters.timeSlot} onValueChange={(value) => setFilters(prev => ({ ...prev, timeSlot: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(slot => (
                        <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Type Legend */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 font-heading">Kurstypen</h3>
              <div className="flex flex-wrap gap-3">
                {Object.values(courseTypes).map(type => (
                  <Badge key={type.label} className={`${type.color} text-white text-sm px-3 py-1`}>
                    {type.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Grid by Day */}
          <div className="space-y-8">
            {Object.entries(coursesByDay).map(([day, courses]) => {
              if (courses.length === 0) return null;

              return (
                <div key={day}>
                  <h3 className="text-2xl font-bold mb-6 text-primary-500 font-heading">
                    {day}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => {
                      const typeInfo = courseTypes[course.type];
                      const spotsLeft = course.spotsTotal - course.spotsBooked;
                      const isCourseFull = spotsLeft === 0;

                      return (
                        <motion.div
                          key={course.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card
                            className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4"
                            style={{borderLeftColor: typeInfo.color.replace('bg-', '')}}
                            onClick={() => setSelectedCourse(course)}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <Badge className={`${typeInfo.lightColor} ${typeInfo.textColor} text-xs font-medium`}>
                                  {typeInfo.label}
                                </Badge>
                                <div className="text-right">
                                  <div className="flex items-center text-sm text-foreground">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {course.startTime} - {course.endTime}
                                  </div>
                                </div>
                              </div>

                              <h3 className="text-lg font-bold mb-2 text-primary-500 font-heading">
                                {course.name}
                              </h3>

                              <div className="space-y-2 mb-4 text-sm text-foreground font-body">
                                <div className="flex items-center">
                                  <User className="w-4 h-4 mr-2 text-accent-500" />
                                  <span><strong>Coach:</strong> {course.trainer}</span>
                                </div>
                                <div className="flex items-center">
                                  <BarChart className="w-4 h-4 mr-2 text-accent-500" />
                                  <span><strong>Level:</strong> {course.level}</span>
                                </div>
                                <div className="flex items-center">
                                  <Info className="w-4 h-4 mr-2 text-accent-500" />
                                  <span>
                                    <strong>
                                      {isCourseFull ? 'Ausgebucht' : `${spotsLeft} freie Plätze`}
                                    </strong>
                                  </span>
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 mb-4 line-clamp-2 font-body">
                                {course.description}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="bg-gray-200 rounded-full h-2 mr-4">
                                    <div
                                      className={`h-2 rounded-full ${typeInfo.color}`}
                                      style={{width: `${Math.min((course.spotsBooked / course.spotsTotal) * 100, 100)}%`}}
                                    />
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1 font-body">
                                    {course.spotsBooked}/{course.spotsTotal} gebucht
                                  </div>
                                </div>

                                {user ? (
                                  isCourseFull ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="font-button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCourse(course);
                                      }}
                                    >
                                      <ListPlus className="w-4 h-4 mr-1" />
                                      Warteliste
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      className="font-button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCourse(course);
                                      }}
                                    >
                                      Buchen
                                    </Button>
                                  )
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="font-button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      alert('Bitte melde dich an, um Kurse zu buchen.');
                                    }}
                                  >
                                    Anmelden
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCourses.length === 0 && (
            <Card className="py-12">
              <CardContent className="text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 font-heading">Keine Kurse gefunden</h3>
                <p className="text-gray-600 font-body">
                  Versuche andere Filter-Einstellungen oder kontaktiere uns für weitere Optionen.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Modals */}
      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onBook={handleBookCourse}
        onJoinWaitlist={handleJoinWaitlist}
        isBooking={isBooking}
        user={user}
      />

      <SuccessModal
        isOpen={showSuccess.isOpen}
        onClose={() => setShowSuccess({ isOpen: false, type: '', courseName: '' })}
        type={showSuccess.type}
        courseName={showSuccess.courseName}
      />
    </div>
  );
}

