import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  IconButton,
  Button,
  Avatar,
  Stack,
  Paper,
  CircularProgress,
  Chip,
  Alert,
  Divider,
  Grid
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DescriptionIcon from '@mui/icons-material/Description';
import WarningIcon from '@mui/icons-material/Warning';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { contentService } from '../services/api';

const AssistantPage = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello ${user?.name || 'Rajesh'}! I am your AI Government Scheme Assistant powered by LangChain reasoning. I cross-reference your profile across 500+ Central & State databases in real-time. Ask me about eligibility, schemes, documents, or nearest offices in plain language!`
    }
  ]);

  const [suggestions, setSuggestions] = useState([
    'What schemes am I eligible for?',
    'Tell me about PMAY Housing Scheme',
    'Check PM-KISAN Farmer Grant',
    'Where is my nearest Tahsildar office?'
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const isProfileIncomplete = user?.profileCompletion ? user.profileCompletion < 100 : true;

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await contentService.sendChatMessage(text);
      let assistantMsg = {};

      const resObj = response?.response || response;
      const resType = resObj?.type || 'eligibility_check';
      const content = resObj?.content || {};

      // If profile is incomplete, prepend reminder notice if not present
      let summaryText = content.summary || "I analyzed your request against active government databases.";
      if (isProfileIncomplete && !summaryText.includes("complete your profile")) {
        summaryText = `⚠️ Please complete your profile to receive 100% accurate personalized recommendations.\n\n` + summaryText;
      }

      assistantMsg = {
        sender: 'assistant',
        text: summaryText,
        structured: content,
        type: resType
      };

      if (resObj?.suggestions) setSuggestions(resObj.suggestions);
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error sending chat message:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: 'Apologies, I encountered an issue analyzing scheme database rules. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        sender: 'assistant',
        text: `Hello ${user?.name || 'Citizen'}! Chat session reset. Ask me about any government welfare scheme!`
      }
    ]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', py: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main" display="flex" alignItems="center" gap={1}>
            AI Scheme Assistant & Navigator <Chip label="LangChain Live" color="secondary" size="small" sx={{ fontWeight: 'bold' }} />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Database-First Conversational Intelligence for 500+ Indian Welfare Programs
          </Typography>
        </Box>
        <Button startIcon={<DeleteIcon />} color="error" variant="outlined" size="small" onClick={handleClear}>
          Reset Chat
        </Button>
      </Box>

      {/* Messages Area */}
      <Paper elevation={0} variant="outlined" sx={{ flexGrow: 1, p: 3, mb: 2, overflowY: 'auto', bgcolor: 'background.paper', borderRadius: 4 }}>
        <Stack spacing={3}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                justify: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: 1.5
              }}
            >
              {msg.sender === 'assistant' && (
                <Avatar sx={{ bgcolor: 'primary.main', width: 38, height: 38 }}>
                  <SmartToyIcon />
                </Avatar>
              )}

              <Card
                sx={{
                  maxWidth: '85%',
                  bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.default',
                  color: msg.sender === 'user' ? '#fff' : 'text.primary',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  border: '1px solid',
                  borderColor: msg.sender === 'user' ? 'primary.main' : 'divider'
                }}
              >
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontWeight: 400 }}>
                    {msg.text}
                  </Typography>

                  {/* 1. Scheme Recommendations Cards */}
                  {msg.structured?.recommendations && msg.structured.recommendations.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography variant="subtitle2" fontWeight="bold" color="secondary.main" sx={{ mb: 1 }}>
                        Matched Scheme Recommendations:
                      </Typography>
                      <Stack spacing={2}>
                        {msg.structured.recommendations.map((rec, rIdx) => (
                          <Paper key={rIdx} elevation={0} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary.main">{rec.name}</Typography>
                                <Typography variant="caption" color="text.secondary" display="block">{rec.ministry}</Typography>
                              </Box>
                              <Chip label={`${rec.matchScore || 92}% Match`} color="success" size="small" sx={{ fontWeight: 'bold' }} />
                            </Box>

                            <Typography variant="body2" color="secondary.main" fontWeight="bold" sx={{ mb: 1 }}>
                              Benefit: {rec.benefits}
                            </Typography>

                            {rec.reasons && rec.reasons.length > 0 && (
                              <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                                {rec.reasons.map((reason, rKey) => (
                                  <Typography key={rKey} variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                                    <CheckCircleIcon fontSize="inherit" color="success" /> {reason}
                                  </Typography>
                                ))}
                              </Stack>
                            )}

                            {rec.applyUrl && (
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                startIcon={<AutoFixHighIcon fontSize="small" />}
                                endIcon={<ArrowForwardIcon fontSize="small" />}
                                onClick={() => navigate(rec.applyUrl)}
                                sx={{ fontWeight: 'bold', fontSize: '0.75rem', py: 0.8 }}
                              >
                                Apply via AI Auto-Fill Engine
                              </Button>
                            )}
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* 2. Vault Documents Status Checklist */}
                  {msg.structured?.requiredDocs && msg.structured.requiredDocs.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography variant="subtitle2" fontWeight="bold" color="primary.main" sx={{ mb: 1 }}>
                        Smart Document Vault Status:
                      </Typography>
                      <Grid container spacing={1}>
                        {msg.structured.requiredDocs.map((doc, dIdx) => (
                          <Grid item xs={12} sm={6} key={dIdx}>
                            <Paper elevation={0} sx={{ p: 1.2, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <DescriptionIcon color="primary" fontSize="small" />
                                <Typography variant="caption" fontWeight="bold">{doc.name}</Typography>
                              </Stack>
                              <Chip
                                label={doc.inVault ? 'Verified in Vault' : 'Missing in Vault'}
                                color={doc.inVault ? 'success' : 'warning'}
                                size="small"
                              />
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* 3. Action Needed / Missing Info Banner */}
                  {msg.structured?.missingInfo && msg.structured.missingInfo.length > 0 && (
                    <Alert severity="warning" icon={<WarningIcon />} sx={{ mt: 2, borderRadius: 2 }}>
                      <Typography variant="caption" fontWeight="bold" display="block">Action Required for 100% Eligibility:</Typography>
                      {msg.structured.missingInfo.join(' • ')}
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {msg.sender === 'user' && (
                <Avatar sx={{ bgcolor: 'secondary.main', width: 38, height: 38 }}>
                  <PersonIcon />
                </Avatar>
              )}
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 38, height: 38 }}>
                <SmartToyIcon />
              </Avatar>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default', borderRadius: '18px 18px 18px 4px' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={18} color="secondary" />
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">AI is reasoning against scheme databases...</Typography>
                </Stack>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Stack>
      </Paper>

      {/* Dynamic Suggestion Chips & Chat Input */}
      <Box sx={{ mt: 'auto' }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2, overflowX: 'auto', pb: 1 }}>
          {suggestions.map((reply, idx) => (
            <Button
              key={idx}
              variant="outlined"
              size="small"
              color="secondary"
              onClick={() => handleSend(reply)}
              sx={{ whiteSpace: 'nowrap', borderRadius: 4, fontWeight: 600, px: 2 }}
            >
              {reply}
            </Button>
          ))}
        </Stack>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TextField
            fullWidth
            placeholder="Ask AI Assistant about schemes, eligibility rules, or documents..."
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 4
              }
            }}
          />
          <IconButton
            color="primary"
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            sx={{ p: 1.8, bgcolor: 'secondary.main', color: '#fff', '&:hover': { bgcolor: 'secondary.dark' }, '&.Mui-disabled': { bgcolor: 'action.disabledBackground' } }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AssistantPage;
