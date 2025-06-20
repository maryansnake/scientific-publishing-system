import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Grid, Button, Tabs, Tab,
  Divider, CircularProgress, Chip, Card, CardContent, Alert,
  List, ListItem, ListItemText, Link, Badge, Avatar, IconButton,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  ListItemIcon, FormControl, InputLabel, Select, MenuItem, AlertTitle
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from 'react-toastify';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { AuthContext } from '../../context/AuthContext';
import ArticleService from '../../services/article.service';
import ReviewService from '../../services/review.service';
import FileService from '../../services/file.service';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [article, setArticle] = useState(null);
  const [files, setFiles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [previewFile, setPreviewFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      try {
        const articleData = await ArticleService.getArticleById(id);
        setArticle(articleData);
        
        // Fetch article files
        const filesData = await ArticleService.getArticleFiles(id);
        setFiles(filesData.data);
        
        // If user is editor or admin, fetch reviews and summary
        if (currentUser && (currentUser.roles.includes('editor') || currentUser.roles.includes('admin'))) {
          const reviewsData = await ReviewService.getReviews({ articleId: id });
          setReviews(reviewsData.data);
          
          const summaryData = await ReviewService.getArticleReviewsSummary(id);
          setReviewSummary(summaryData);
        }
      } catch (err) {
        setError('Failed to load article information. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticleData();
  }, [id, currentUser]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  
  const handlePreviewFile = (file) => {
    if (file.mimeType.includes('pdf')) {
      setPreviewFile(file);
    } else {
      window.open(file.fileUrl, '_blank');
    }
  };
  
  const handleDownloadFile = async (file) => {
    try {
      const response = await FileService.downloadFile(file.fileUrl);
      
      // Create a temporary link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('File download started');
    } catch (err) {
      toast.error('Failed to download file');
      console.error(err);
    }
  };
  
  const handleStatusChange = async () => {
    try {
      await ArticleService.updateArticleStatus(id, newStatus);
      setArticle({ ...article, status: newStatus });
      setStatusDialogOpen(false);
      toast.success(`Article status changed to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      toast.error('Failed to update article status');
      console.error(err);
    }
  };
  
  const handleDeleteArticle = async () => {
    try {
      await ArticleService.deleteArticle(id);
      setConfirmDialogOpen(false);
      navigate('/my-articles');
      toast.success('Article deleted successfully');
    } catch (err) {
      toast.error('Failed to delete article');
      console.error(err);
    }
  };
  
  const canEdit = () => {
    if (!currentUser || !article) return false;
    
    // Submitter can edit if article is in draft or revisions_needed status
    if (article.submitterId === currentUser.id && 
        (article.status === 'draft' || article.status === 'revisions_needed')) {
      return true;
    }
    
    // Editors and admins can always edit
    return currentUser.roles.includes('editor') || currentUser.roles.includes('admin');
  };
  
  const canChangeStatus = () => {
    if (!currentUser || !article) return false;
    return currentUser.roles.includes('editor') || currentUser.roles.includes('admin');
  };
  
  const canDelete = () => {
    if (!currentUser || !article) return false;
    
    // Submitter can delete only if article is in draft status
    if (article.submitterId === currentUser.id && article.status === 'draft') {
      return true;
    }
    
    // Admins can always delete
    return currentUser.roles.includes('admin');
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'draft': return 'default';
      case 'submitted': return 'info';
      case 'under_review': return 'warning';
      case 'revisions_needed': return 'warning';
      case 'accepted': return 'success';
      case 'published': return 'success';
      case 'rejected': return 'error';
      case 'withdrawn': return 'error';
      default: return 'default';
    }
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error || !article) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Article not found'}</Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Article Header */}
      <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 2 }}>
              <Box>
                <Chip 
                  label={article.status.replace('_', ' ')}
                  color={getStatusColor(article.status)}
                  sx={{ mb: 2 }}
                />
                <Typography variant="h4" gutterBottom>
                  {article.title}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {article.type && (
                    <Chip 
                      label={article.type.replace('_', ' ')}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {article.keywords && article.keywords.map((keyword, index) => (
                    <Chip 
                      key={index}
                      label={keyword}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {canEdit() && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/articles/${article.id}/edit`)}
                  >
                    Edit
                  </Button>
                )}
                
                {canChangeStatus() && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setStatusDialogOpen(true)}
                  >
                    Change Status
                  </Button>
                )}
                
                {canDelete() && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setConfirmDialogOpen(true)}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Abstract
                </Typography>
                <Typography variant="body1" paragraph dangerouslySetInnerHTML={{__html:article?.abstract}}>
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Article Information
                    </Typography>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Submission Date
                      </Typography>
                      <Typography variant="body2">
                        {new Date(article.submissionDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    {article.journal && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Journal
                        </Typography>
                        <Typography variant="body2">
                          <Link component={RouterLink} to={`/journals/${article.journal.slug}`}>
                            {article.journal.title}
                          </Link>
                        </Typography>
                      </Box>
                    )}
                    
                    {article.issue && article.status === 'published' && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Issue
                        </Typography>
                        <Typography variant="body2">
                          <Link component={RouterLink} to={`/journals/issues/${article.issue.id}`}>
                            {article.issue.title}
                          </Link>
                          {article.pages && (
                            <Typography variant="caption" display="block">
                              Pages: {article.pages}
                            </Typography>
                          )}
                        </Typography>
                      </Box>
                    )}
                    
                    {article.doi && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          DOI
                        </Typography>
                        <Typography variant="body2">
                          <Link href={`https://doi.org/${article.doi}`} target="_blank">
                            {article.doi}
                          </Link>
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
                
                {/* Authors Card */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Authors
                    </Typography>
                    
                    <List dense>
                      {article.authors && article.authors.map((author, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Badge
                              color="primary"
                              badgeContent={author.isCorresponding ? '✓' : 0}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                            >
                              <Avatar>
                                <PersonIcon />
                              </Avatar>
                            </Badge>
                          </ListItemIcon>
                          <ListItemText
                            primary={`${author.firstName} ${author.lastName}`}
                            secondary={author.isCorresponding ? 'Corresponding Author' : `Author #${author.order}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Article Tabs */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="article tabs">
            <Tab label="Files" />
            {(currentUser?.roles.includes('editor') || currentUser?.roles.includes('admin')) && (
              <Tab label="Reviews" />
            )}
            {article.status === 'published' && (
              <Tab label="Citations" />
            )}
          </Tabs>
        </Box>
        
        {/* Files Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={previewFile ? 6 : 12}>
              <Typography variant="h6" gutterBottom>
                Article Files
              </Typography>
              
              {files?.length > 0 ? (
                <List>
                  {files.map((file) => (
                    <Paper key={file.id} sx={{ mb: 2, p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DescriptionIcon sx={{ mr: 2 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1">
                            {file.filename}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" display="block">
                            {file.fileType.replace('_', ' ')} • {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                          {file.description && (
                            <Typography variant="body2">
                              {file.description}
                            </Typography>
                          )}
                        </Box>
                        <Box>
                          <IconButton 
                            onClick={() => handlePreviewFile(file)} 
                            title="Preview"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDownloadFile(file)}
                            title="Download"
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  No files available for this article.
                </Alert>
              )}
            </Grid>
            
            {previewFile && (
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      File Preview: {previewFile.filename}
                    </Typography>
                    <IconButton onClick={() => setPreviewFile(null)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ height: '600px', overflow: 'auto' }}>
                    <Document
                      file={previewFile.fileUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      loading={<CircularProgress />}
                      error={<Alert severity="error">Failed to load PDF file</Alert>}
                    >
                      <Page 
                        pageNumber={pageNumber}
                        width={500}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                    </Document>
                  </Box>
                  
                  {numPages > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                      <IconButton 
                        onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                        disabled={pageNumber <= 1}
                      >
                        <KeyboardArrowUpIcon />
                      </IconButton>
                      <Typography variant="body2" sx={{ mx: 2 }}>
                        Page {pageNumber} of {numPages}
                      </Typography>
                      <IconButton 
                        onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                        disabled={pageNumber >= numPages}
                      >
                        <KeyboardArrowDownIcon />
                      </IconButton>
                    </Box>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </TabPanel>
        
        {/* Reviews Tab (Only for editors/admins) */}
        {(currentUser?.roles.includes('editor') || currentUser?.roles.includes('admin')) && (
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Reviews
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/reviews/create', { state: { articleId: article?.id } })}
                  >
                    Assign New Reviewer
                  </Button>
                </Box>
                
                {reviews?.length > 0 ? (
                  <List>
                    {reviews.map((review) => (
                      <Paper key={review.id} sx={{ mb: 2, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                                {review.reviewer ? review.reviewer.firstName[0] : 'R'}
                              </Avatar>
                              <Typography variant="subtitle1">
                                {review.anonymous 
                                  ? 'Anonymous Reviewer'
                                  : `${review.reviewer?.firstName} ${review.reviewer?.lastName}`
                                }
                              </Typography>
                            </Box>
                            
                            <Chip 
                              label={review.status}
                              size="small"
                              color={
                                review.status === 'completed' ? 'success' :
                                review.status === 'declined' ? 'error' :
                                review.status === 'pending' ? 'warning' : 'default'
                              }
                              sx={{ mr: 1 }}
                            />
                            
                            {review.status === 'completed' && review.recommendation && (
                              <Chip 
                                label={review.recommendation.replace('_', ' ')}
                                size="small"
                                color={
                                  review.recommendation === 'accept' ? 'success' :
                                  review.recommendation === 'minor_revisions' ? 'info' :
                                  review.recommendation === 'major_revisions' ? 'warning' : 'error'
                                }
                              />
                            )}
                          </Box>
                          
                          <Typography variant="caption" color="textSecondary">
                            {review.status === 'completed' && review.completionDate
                              ? `Completed: ${new Date(review.completionDate).toLocaleDateString()}`
                              : `Due: ${new Date(review.dueDate).toLocaleDateString()}`
                            }
                          </Typography>
                        </Box>
                        
                        {review.status === 'completed' && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">
                              Scores
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                              {review.qualityScore && (
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6">{review.qualityScore}/10</Typography>
                                  <Typography variant="caption">Quality</Typography>
                                </Box>
                              )}
                              {review.originalityScore && (
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6">{review.originalityScore}/10</Typography>
                                  <Typography variant="caption">Originality</Typography>
                                </Box>
                              )}
                              {review.relevanceScore && (
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6">{review.relevanceScore}/10</Typography>
                                  <Typography variant="caption">Relevance</Typography>
                                </Box>
                              )}
                              {review.clarityScore && (
                                <Box sx={{ textAlign: 'center' }}>
                                  <Typography variant="h6">{review.clarityScore}/10</Typography>
                                  <Typography variant="caption">Clarity</Typography>
                                </Box>
                              )}
                            </Box>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Typography variant="subtitle2">
                              Comments to Editor
                            </Typography>
                            <Typography variant="body2" paragraph>
                              {review.commentsToEditor || 'No comments to editor'}
                            </Typography>
                            
                            <Typography variant="subtitle2">
                              Comments to Author
                            </Typography>
                            <Typography variant="body2" paragraph>
                              {review.commentsToAuthor || 'No comments to author'}
                            </Typography>
                            
                            {review.fileUrl && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DownloadIcon />}
                                sx={{ mt: 1 }}
                                onClick={() => window.open(review.fileUrl, '_blank')}
                              >
                                Download Review File
                              </Button>
                            )}
                          </Box>
                        )}
                      </Paper>
                    ))}
                  </List>
                ) : (
                  <Alert severity="info">
                    No reviews assigned for this article yet.
                  </Alert>
                )}
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Review Summary
                    </Typography>
                    
                    {reviewSummary ? (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="body2">
                            Completed Reviews:
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {reviewSummary.completedCount}/{reviewSummary.totalCount}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle2">
                          Average Scores
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6">{reviewSummary.averageScores?.quality?.toFixed(1) || '-'}/10</Typography>
                            <Typography variant="caption">Quality</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6">{reviewSummary.averageScores?.originality?.toFixed(1) || '-'}/10</Typography>
                            <Typography variant="caption">Originality</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6">{reviewSummary.averageScores?.relevance?.toFixed(1) || '-'}/10</Typography>
                            <Typography variant="caption">Relevance</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6">{reviewSummary.averageScores?.clarity?.toFixed(1) || '-'}/10</Typography>
                            <Typography variant="caption">Clarity</Typography>
                          </Box>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="subtitle2">
                          Recommendations
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                          {reviewSummary.recommendationCounts?.accept > 0 && (
                            <Chip 
                              label={`Accept: ${reviewSummary.recommendationCounts.accept}`}
                              color="success"
                            />
                          )}
                          {reviewSummary.recommendationCounts?.minor_revisions > 0 && (
                            <Chip 
                              label={`Minor Revisions: ${reviewSummary.recommendationCounts.minor_revisions}`}
                              color="info"
                            />
                          )}
                          {reviewSummary.recommendationCounts?.major_revisions > 0 && (
                            <Chip 
                              label={`Major Revisions: ${reviewSummary.recommendationCounts.major_revisions}`}
                              color="warning"
                            />
                          )}
                          {reviewSummary.recommendationCounts?.reject > 0 && (
                            <Chip 
                              label={`Reject: ${reviewSummary.recommendationCounts.reject}`}
                              color="error"
                            />
                          )}
                        </Box>
                      </>
                    ) : (
                      <Typography variant="body2">
                        No review data available yet.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
                
                {article.status === 'under_review' && reviewSummary?.completedCount > 0 && (
                  <Alert severity="info">
                    <AlertTitle>Editor Decision Required</AlertTitle>
                    Based on the reviews, you need to make a decision on this article.
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setStatusDialogOpen(true)}
                      >
                        Make Decision
                      </Button>
                    </Box>
                  </Alert>
                )}
              </Grid>
            </Grid>
          </TabPanel>
        )}
        
        {/* Citations Tab (only for published articles) */}
        {article.status === 'published' && (
          <TabPanel value={tabValue} index={(currentUser?.roles.includes('editor') || currentUser?.roles.includes('admin')) ? 2 : 1}>
            <Typography variant="h6" gutterBottom>
              How to Cite
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
              <Typography variant="body2" sx={{ mb: 2, fontFamily: 'monospace' }}>
                {`${article.authors?.map(a => `${a.lastName}, ${a.firstName[0]}.`).join(', ')} (${
                  new Date(article.submissionDate).getFullYear()
                }). ${article.title}. ${article.journal?.title}, ${article.doi ? `doi: ${article.doi}` : ''}`}
              </Typography>
              
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(`${article.authors?.map(a => `${a.lastName}, ${a.firstName[0]}.`).join(', ')} (${
                    new Date(article.submissionDate).getFullYear()
                  }). ${article.title}. ${article.journal?.title}, ${article.doi ? `doi: ${article.doi}` : ''}`);
                  toast.success('Citation copied to clipboard');
                }}
              >
                Copy Citation
              </Button>
            </Paper>
            
            <Typography variant="h6" gutterBottom>
              Export Citation
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button variant="outlined" size="small">
                BibTeX
              </Button>
              <Button variant="outlined" size="small">
                EndNote
              </Button>
              <Button variant="outlined" size="small">
                RIS
              </Button>
            </Box>
          </TabPanel>
        )}
      </Box>
      
      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Delete Article?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this article? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteArticle} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Change Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      >
        <DialogTitle>Change Article Status</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Select the new status for this article:
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="submitted">Submitted</MenuItem>
              <MenuItem value="under_review">Under Review</MenuItem>
              <MenuItem value="revisions_needed">Revisions Needed</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="withdrawn">Withdrawn</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleStatusChange}
            color="primary"
            disabled={!newStatus || newStatus === article.status}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`article-tabpanel-${index}`}
      aria-labelledby={`article-tab-${index}`}
      {...other}
      style={{ padding: '24px 0' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default ArticleDetail;