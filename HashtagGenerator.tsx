import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Copy, RefreshCw } from 'lucide-react';

const AdvancedHashtagGenerator = () => {
  const [postTitle, setPostTitle] = useState('');
  const [customHashtags, setCustomHashtags] = useState('');
  const [numberOfHashtags, setNumberOfHashtags] = useState(30);
  const [generatedHashtags, setGeneratedHashtags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateContextualHashtags = () => {
    if (!postTitle.trim()) {
      alert('Please enter a post title');
      return;
    }

    setIsLoading(true);
    setGeneratedHashtags([]);

    // Contextual hashtag generation logic
    const generateHashtags = () => {
      const words = postTitle.toLowerCase().split(/\s+/);
      const hashtags = new Set();

      // Custom hashtags from user input
      if (customHashtags) {
        customHashtags.split(',').forEach(tag => {
          const cleanTag = `#${tag.trim().replace(/^#/, '').replace(/\s+/g, '')}`;
          hashtags.add(cleanTag);
        });
      }

      // Generate hashtags from post title
      words.forEach(word => {
        if (word.length > 2) {
          hashtags.add(`#${word}`);
          hashtags.add(`#${word.charAt(0).toUpperCase() + word.slice(1)}`);
        }
      });

      // Add full title variations
      hashtags.add(`#${words.join('')}`);
      hashtags.add(`#${words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`);

      // Add domain and context-specific variations
      const contextVariations = [
        `#${postTitle.replace(/\s+/g, '')}Insights`,
        `#${words[0]}Experts`,
        `#${words[words.length - 1]}Trends`,
        `#${words.map(w => w[0]).join('').toUpperCase()}`,
      ];
      contextVariations.forEach(variation => hashtags.add(variation));

      // Generate random variations to reach desired count
      while (hashtags.size < numberOfHashtags) {
        const randomVariation = `#${postTitle.replace(/\s+/g, '')}${Math.random().toString(36).substring(2, 7)}`;
        hashtags.add(randomVariation);
      }

      return Array.from(hashtags).slice(0, numberOfHashtags);
    };

    // Simulate processing time
    setTimeout(() => {
      const hashtags = generateHashtags();
      setGeneratedHashtags(hashtags);
      setIsLoading(false);
    }, 500);
  };

  const copyAllHashtags = () => {
    const hashtagText = generatedHashtags.join(' ');
    navigator.clipboard.writeText(hashtagText);
    alert(`Copied ${generatedHashtags.length} hashtags!`);
  };

  const clearAll = () => {
    setPostTitle('');
    setCustomHashtags('');
    setGeneratedHashtags([]);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="mr-2" /> Contextual Hashtag Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea 
            placeholder="Enter your post title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="w-full min-h-[100px]"
          />

          <div className="flex items-center space-x-2">
            <Input 
              type="number"
              placeholder="Number of Hashtags"
              min="1"
              max="500"
              value={numberOfHashtags}
              onChange={(e) => {
                const value = Math.min(500, Math.max(1, parseInt(e.target.value) || 1));
                setNumberOfHashtags(value);
              }}
              className="w-32"
            />
            <Input 
              placeholder="Custom Hashtags (comma-separated)"
              value={customHashtags}
              onChange={(e) => setCustomHashtags(e.target.value)}
              className="flex-grow"
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={generateContextualHashtags} 
              disabled={isLoading}
              className="flex-grow"
            >
              {isLoading ? 'Generating...' : 'Generate Hashtags'}
            </Button>
            <Button 
              variant="outline"
              onClick={clearAll}
              title="Clear All"
            >
              <RefreshCw size={20} />
            </Button>
          </div>

          {generatedHashtags.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Generated Hashtags:</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={copyAllHashtags}
                >
                  <Copy size={16} className="mr-2" /> Copy All
                </Button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {generatedHashtags.map((hashtag, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-1 bg-gray-100 rounded"
                  >
                    <span className="text-sm">{hashtag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedHashtagGenerator;