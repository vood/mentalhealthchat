# AI Mental Health Chatbot

![Chat Screen](./screen.jpg | width=256)

This code is 95% written by GPT-4. The only human input was the prompt.

# The challenge

I decided to see if I could write a mobile app by only using GPT-4, in a framework I'm not 100% familiar with. The
result is in this github project.

# End result

I ended up with a working prototype. The chat was working, the auth was working. 
Then I decided to add chat history storage with firebase which is not working yet. Code is written but the app throws an error.
I believe that it is possible to fix this problem by conversing with GPT-4, but I'm not going to spend more time on this.

# About myself

I'm a fullstack software engineer with over 15 years of experience. My tech stack spans from Python, Javascript, React,
Go, little bit of Java and C#.
Most of my career I've spent building data pipelines for startups like People.ai and big tech like Meta.

# The Prompt

```text
{full copy-paste of https://platform.openai.com/docs/guides/chat}
---
The above API documentation for ChatGPT. 

Now write mobile application "ai mental coach", where user can consult with an AI on a mental health-related problem
```

Then followed by the prompts found in the `GPT-HISTORY.md` file.

# Difficulties encountered

1. It took me a while to actually run the final app on my phone. But most of or all were resolved by feeding the errors
   back to GPT-4.
2. GPT-4 has limited context, so as you go deep you have to remove some conversation history (hence not everything is
   captured in the `GPT-HISTORY.md` file).
3. I have spent at least an hour debugging authorization with google issues and firebase, resolved by feeding errors
   back to GPT-4, and my previous experience with firebase/mobile apps.

   


