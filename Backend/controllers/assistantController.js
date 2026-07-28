// Backend/controllers/assistantController.js
const aiAssistantService = require('../services/aiAssistantService');

exports.chatWithAssistant = async (req, res) => {
  try {
    const { message, profile } = req.body;
    const aiResponse = await aiAssistantService.processUserMessage(message, profile);
    res.json({
      success: true,
      response: aiResponse
    });
  } catch (error) {
    console.error('Error in assistantController.chatWithAssistant:', error);
    res.status(500).json({
      success: false,
      message: 'Apologies, I encountered an issue processing your request.'
    });
  }
};
