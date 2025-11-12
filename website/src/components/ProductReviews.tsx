"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, ThumbsUp, CheckCircle } from 'lucide-react';
import { getProductReviews, createReview, markReviewHelpful, Review } from '@/lib/api/reviews';
import { motion } from 'framer-motion';

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const { user, token } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const loadReviews = async () => {
        setIsLoading(true);
        try {
            const fetchedReviews = await getProductReviews(productId);
            setReviews(fetchedReviews);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!token || !user) {
            alert('Bitte loggen Sie sich ein, um eine Bewertung zu schreiben.');
            return;
        }

        if (rating < 1 || rating > 5) {
            alert('Bitte wähle eine Bewertung zwischen 1 und 5 Sternen.');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createReview({
                product_id: productId,
                rating,
                title: title || undefined,
                comment: comment || undefined,
            }, token);

            if (result.success) {
                alert('Vielen Dank für deine Bewertung!');
                setShowReviewForm(false);
                setTitle('');
                setComment('');
                setRating(5);
                loadReviews();
            } else {
                alert(result.message || 'Fehler beim Erstellen der Bewertung');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Fehler beim Erstellen der Bewertung');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMarkHelpful = async (reviewId: string) => {
        if (!token) return;

        try {
            const success = await markReviewHelpful(reviewId, token);
            if (success) {
                loadReviews();
            }
        } catch (error) {
            console.error('Error marking review helpful:', error);
        }
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        percentage: reviews.length > 0
            ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100
            : 0
    }));

    return (
        <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-primary-700 font-heading mb-2">
                        Kundenbewertungen
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${
                                        star <= Math.round(averageRating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-lg font-semibold font-heading">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-gray-500 font-body">
                            ({reviews.length} {reviews.length === 1 ? 'Bewertung' : 'Bewertungen'})
                        </span>
                    </div>
                </div>
                {user && !showReviewForm && (
                    <Button
                        onClick={() => setShowReviewForm(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-button"
                    >
                        Bewertung schreiben
                    </Button>
                )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-4 font-heading">Deine Bewertung</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="mb-2 block font-body">Bewertung *</Label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors ${
                                                    star <= rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="review-title" className="font-body">Titel (optional)</Label>
                                <Input
                                    id="review-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Kurzer Titel für deine Bewertung"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="review-comment" className="font-body">Deine Bewertung *</Label>
                                <Textarea
                                    id="review-comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Teile deine Erfahrungen mit diesem Produkt..."
                                    rows={5}
                                    className="mt-1"
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    onClick={handleSubmitReview}
                                    disabled={isSubmitting || !comment.trim()}
                                    className="bg-primary-600 hover:bg-primary-700 text-white font-button"
                                >
                                    {isSubmitting ? 'Wird gesendet...' : 'Bewertung absenden'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowReviewForm(false);
                                        setTitle('');
                                        setComment('');
                                        setRating(5);
                                    }}
                                    className="font-button"
                                >
                                    Abbrechen
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Rating Distribution */}
            {reviews.length > 0 && (
                <div className="mb-8">
                    <h3 className="font-semibold mb-4 font-heading">Bewertungsverteilung</h3>
                    <div className="space-y-2">
                        {ratingDistribution.map(({ star, count, percentage }) => (
                            <div key={star} className="flex items-center gap-4">
                                <div className="flex items-center gap-1 w-20">
                                    <span className="text-sm font-body">{star}</span>
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-yellow-400 h-2 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 w-12 text-right font-body">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reviews List */}
            {isLoading ? (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            ) : reviews.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-gray-500 font-body">
                            Noch keine Bewertungen. Sei der Erste!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-semibold font-heading">
                                                    {review.user_name}
                                                </h4>
                                                {review.verified_purchase && (
                                                    <Badge variant="outline" className="text-xs">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Verifizierter Kauf
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${
                                                            star <= review.rating
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                                <span className="text-sm text-gray-500 font-body">
                                                    {new Date(review.created_at).toLocaleDateString('de-DE')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {review.title && (
                                        <h5 className="font-semibold mb-2 font-heading">
                                            {review.title}
                                        </h5>
                                    )}
                                    {review.comment && (
                                        <p className="text-gray-700 mb-4 font-body">
                                            {review.comment}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleMarkHelpful(review.id)}
                                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors font-body"
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                            <span>Hilfreich ({review.helpful_count})</span>
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

