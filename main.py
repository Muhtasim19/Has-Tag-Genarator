import os
from dotenv import load_dotenv
import anthropic

# Load environment variables
load_dotenv()

class HashtagGenerator:
    def __init__(self):
        # Initialize the Anthropic client
        self.client = anthropic.Anthropic(
            api_key=os.getenv('ANTHROPIC_API_KEY')
        )
    
    def generate_hashtags(self, prompt, num_hashtags=5):
        """
        Generate hashtags using AI based on the given prompt
        
        :param prompt: The input topic or theme for hashtag generation
        :param num_hashtags: Number of hashtags to generate (default 5)
        :return: List of generated hashtags
        """
        try:
            # Construct the AI prompt for hashtag generation
            ai_prompt = f"""Generate {num_hashtags} creative and relevant hashtags for the following topic: {prompt}

Rules for hashtags:
- Use CamelCase for multiple words
- Keep hashtags concise and memorable
- Relate directly to the topic
- Avoid using spaces
- Make them engaging and searchable

Example format:
#CreativeTech
#InnovationMatters
"""

            # Send request to Anthropic Claude
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=150,
                messages=[
                    {
                        "role": "user", 
                        "content": ai_prompt
                    }
                ]
            )
            
            # Extract and process the hashtags
            hashtag_text = response.content[0].text
            hashtags = [
                tag.strip() 
                for tag in hashtag_text.split('\n') 
                if tag.startswith('#')
            ]
            
            # Ensure we return exactly the number of requested hashtags
            return hashtags[:num_hashtags]
        
        except Exception as e:
            print(f"Error generating hashtags: {e}")
            return []

def main():
    # Create an instance of the HashtagGenerator
    generator = HashtagGenerator()
    
    while True:
        # Get user input for topic and number of hashtags
        prompt = input("Enter the topic for hashtag generation (or 'quit' to exit): ").strip()
        
        if prompt.lower() == 'quit':
            break
        
        # Get number of hashtags
        while True:
            try:
                num_hashtags = int(input("How many hashtags do you want to generate? (1-10): "))
                if 1 <= num_hashtags <= 10:
                    break
                else:
                    print("Please enter a number between 1 and 10.")
            except ValueError:
                print("Invalid input. Please enter a number.")
        
        # Generate and display hashtags
        hashtags = generator.generate_hashtags(prompt, num_hashtags)
        
        print("\nGenerated Hashtags:")
        for tag in hashtags:
            print(tag)
        print("\n")

if __name__ == "__main__":
    main()
