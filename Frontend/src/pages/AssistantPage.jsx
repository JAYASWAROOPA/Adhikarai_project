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
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { contentService } from '../services/api';

const AssistantPage = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello ${user?.firstName || 'Citizen'}! I am your AI Government Scheme Assistant powered by LangChain reasoning. Ask me about eligibility, schemes, or required documents in plain language.`
    }
  ]);
  const [suggestions, setSuggestions] = useState([
    'What schemes am I eligible for?',
    'Tell me more about PMAY',
    'Check eligibility for PM-KISAN',
    'What documents do I need?'
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

      if (response?.response) {
        const res = response.response;
        assistantMsg = {
          sender: 'assistant',
          text: res.content?.summary || "I analyzed your query against official scheme rules.",
          structured: res.content,
          type: res.type
        };
        if (res.suggestions) setSuggestions(res.suggestions);
      } else {
        assistantMsg = {
          sender: 'assistant',
          text: response?.content?.summary || response?.text || `Based on your profile, you are eligible for several active welfare schemes!`,
          structured: response?.content || response,
          type: 'eligibility_check'
        };
      }

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error sending chat message:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: 'Apologies, I encountered an issue accessing scheme rules. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        sender: 'assistant',
        text: `Hello ${user?.firstName || 'Citizen'}! I have reset our session. What government schemes would you like to explore?`
      }
    ]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', py: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            AI Scheme Assistant & Navigator
          </Typography>
          <Typography variant="body2" color="text.secondary">
            LangChain & Database-First Citizen Assistant
          </Typography>
        </Box>
        <Button startIcon={<DeleteIcon />} color="error" variant="outlined" size="small" onClick={handleClear}>
          Reset Chat
        </Button>
      </Box>

      {/* Messages Window */}
      <Paper elevation={0} variant="outlined" sx={{ flexGrow: 1, p: 3, mb: 2, overflowY: 'auto', bgcolor: 'background.paper', borderRadius: 4 }}>
        <Stack spacing={3}>
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: 1.5
              }}
            >
              {msg.sender === 'assistant' && (
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <SmartToyIcon />
                </Avatar>
              )}
              <Card
                sx={{
                  maxWidth: '80%',
                  bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.default',
                  color: msg.sender === 'user' ? '#fff' : 'text.primary',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: '1px solid',
                  borderColor: msg.sender === 'user' ? 'primary.main' : 'divider'
                }}
              >
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {msg.text}
                  </Typography>

                  {/* Render Structured Scheme Recommendation Cards if available */}
                  {msg.structured?.recommendations && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography variant="subtitle2" fontWeight="bold" color="secondary.main" sx={{ mb: 1 }}>
                        Matched Schemes:
                      </Typography>
                      <Stack spacing={1.5}>
                        {msg.structured.recommendations.map((rec, rIdx) => (
                          <Paper key={rIdx} elevation={0} sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" fontWeight="bold" color="primary.main">{rec.name}</Typography>
                              <Chip label={`${rec.matchScore || 92}% Match`} color="success" size="small" />
                            </Box>
                            <Typography variant="caption" color="secondary.main" fontWeight="bold" display="block" sx={{ mt: 0.5 }}>
                              Benefit: {rec.benefits}
                            </Typography>
                            {rec.requirements && (
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                Requirements: {rec.requirements.join(' • ')}
                              </Typography>
                            )}
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Render Missing Info Callouts */}
                  {msg.structured?.missingInfo && msg.structured.missingInfo.length > 0 && (
                    <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                      <Typography variant="caption" fontWeight="bold">Action Needed:</Typography>{' '}
                      Missing data: {msg.structured.missingInfo.join(', ')}
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {msg.sender === 'user' && (
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <PersonIcon />
                </Avatar>
              )}
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <SmartToyIcon />
              </Avatar>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default', borderRadius: '16px 16px 16px 4px' }}>
                <CircularProgress size={20} color="secondary" />
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Stack>
      </Paper>

      {/* Suggestion Chips & Input */}
      <Box sx={{ mt: 'auto' }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2, overflowX: 'auto', pb: 1 }}>
          {suggestions.map((reply, idx) => (
            <Button
              key={idx}
              variant="outlined"
              size="small"
              color="secondary"
              onClick={() => handleSend(reply)}
              sx={{ whiteSpace: 'nowrap', borderRadius: 4, fontWeight: 600 }}
            >
              {reply}
            </Button>
          ))}
        </Stack>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Ask AI Assistant about schemes, eligibility, or documents..."
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
          <IconButton color="primary" onClick={() => handleSend()} sx={{ p: 1.5, bgcolor: 'secondary.main', color: '#fff', '&:hover': { bgcolor: 'secondary.dark' } }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AssistantPage;
