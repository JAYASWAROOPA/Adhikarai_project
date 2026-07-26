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
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { useAuthStore } from '../store/useAuthStore';

const AssistantPage = () => {
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello ${user?.firstName || 'Citizen'}! I am your AI Government Scheme Assistant. I can check your eligibility, recommend tailored schemes, or explain required documents. How can I help you today?`
    }
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

    // Add user message
    const newMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    // Simulate API Response delay
    setTimeout(() => {
      let aiResponse = '';
      const lowercaseText = text.toLowerCase();

      if (lowercaseText.includes('find schemes') || lowercaseText.includes('eligible')) {
        aiResponse = `Let me check your profile. Based on your age (36), income (₹4.5L), and location (Maharashtra), I found 2 highly matching schemes for you:
1. **Pradhan Mantri Awas Yojana** (92% Match) - Subsidy up to ₹2.5L for housing.
2. **PM-KISAN Samman Nidhi** (85% Match) - Support for farming families.
Would you like me to guide you through the documents required for any of these?`;
      } else if (lowercaseText.includes('pmay') || lowercaseText.includes('awas yojana')) {
        aiResponse = `**Pradhan Mantri Awas Yojana** provides housing assistance. Based on your profile, you are eligible!
* **Benefits**: Interest subsidy up to ₹2.5 Lakhs.
* **Documents Needed**: Aadhaar Card, Income Certificate, Address Proof.
Shall I generate the application document checklist for you?`;
      } else if (lowercaseText.includes('document') || lowercaseText.includes('checklist')) {
        aiResponse = `Here is your custom **Document Checklist** for PMAY:
* [x] **Aadhaar Card** (Available in your Profile)
* [ ] **Income Proof** (Requires upload or generation)
* [ ] **Address Proof** (Electricity bill/Ration card)
You can upload missing documents in your Documents dashboard to proceed with verification.`;
      } else {
        aiResponse = `I understand you're asking about government programs. Based on your profile, I can help you check eligibility or find details for schemes like PMAY, PM-KISAN, and state-specific grants. Could you please specify which sector (e.g. Housing, Agriculture, Education) you are interested in?`;
      }

      setMessages((prev) => [...prev, { sender: 'assistant', text: aiResponse }]);
      setLoading(false);
    }, 1200);
  };

  const handleClear = () => {
    setMessages([
      {
        sender: 'assistant',
        text: `Hello ${user?.firstName || 'Citizen'}! I have cleared our chat. How can I help you discover schemes today?`
      }
    ]);
  };

  const quickReplies = [
    'Find schemes for me',
    'Check my eligibility',
    'What documents do I need?',
    'Tell me about PMAY'
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">AI Scheme Assistant</Typography>
          <Typography variant="body2" color="text.secondary">Ask questions about welfare schemes in natural language</Typography>
        </Box>
        <Button startIcon={<DeleteIcon />} color="error" variant="outlined" onClick={handleClear}>
          Clear Conversation
        </Button>
      </Box>

      {/* Chat messages viewport */}
      <Paper elevation={0} variant="outlined" sx={{ flexGrow: 1, p: 3, mb: 2, overflowY: 'auto', bgcolor: 'background.paper', borderRadius: 3 }}>
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
                  maxWidth: '70%',
                  bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.default',
                  color: msg.sender === 'user' ? '#fff' : 'text.primary',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </Typography>
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
                <CircularProgress size={20} color="primary" />
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Stack>
      </Paper>

      {/* Bottom Area */}
      <Box sx={{ mt: 'auto' }}>
        {/* Quick action buttons */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, overflowX: 'auto', pb: 1 }}>
          {quickReplies.map((reply, idx) => (
            <Button
              key={idx}
              variant="outlined"
              size="small"
              color="secondary"
              onClick={() => handleSend(reply)}
              sx={{ whiteSpace: 'nowrap', borderRadius: 4 }}
            >
              {reply}
            </Button>
          ))}
        </Stack>

        {/* Input box */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Type your question about government schemes here..."
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
          <IconButton color="primary" onClick={() => handleSend()} sx={{ p: 1.5, bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AssistantPage;
