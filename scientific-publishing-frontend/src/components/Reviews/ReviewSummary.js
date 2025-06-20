import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Grid, Divider,
  CircularProgress, Chip, Rating
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import ReviewService from '../../services/review.service';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReviewSummary = ({ articleId }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchSummary = async () => {
      if (!articleId) return;
      
      setLoading(true);
      try {
        const summaryData = await ReviewService.getArticleReviewsSummary(articleId);
        setSummary(summaryData);
        setError(null);
      } catch (err) {
        console.error('Error fetching review summary:', err);
        setError('Failed to load review summary');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummary();
  }, [articleId]);
  
  const getRecommendationColor = (recommendation) => {
    switch(recommendation) {
      case 'accept': return 'success';
      case 'minor_revisions': return 'info';
      case 'major_revisions': return 'warning';
      case 'reject': return 'error';
      default