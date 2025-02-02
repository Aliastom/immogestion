function AIAssistant() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);
      const userMessage = {
        role: 'user',
        content: input
      };

      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Utilisation de l'API DeepSeek avec la configuration
      const response = await fetch(`${config.API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          ...config.DEFAULT_HEADERS,
          'Authorization': `Bearer ${config.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: "Vous êtes un conseiller financier et patrimonial expérimenté. Votre rôle est d'aider l'utilisateur à optimiser son patrimoine et ses investissements."
            },
            ...messages,
            userMessage
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. description: ${await response.text()}`);
      }

      const data = await response.json();
      const aiMessage = {
        role: 'assistant',
        content: data.choices[0].message.content
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      reportError(error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-name="ai-assistant" className={`fixed bottom-4 right-4 z-50 ${isOpen ? 'w-96' : 'w-auto'}`}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg"
        >
          <i className="fas fa-robot text-xl"></i>
        </button>
      )}

      {isOpen && (
        <div className="bg-gray-800 rounded-lg shadow-xl flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <i className="fas fa-robot text-purple-500 mr-2"></i>
              <h3 className="font-semibold">Assistant Patrimonial</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder="Posez votre question..."
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
