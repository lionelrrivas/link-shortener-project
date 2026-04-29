---
agent: instructions-generator
---
Take the information provided and generate a [NAME].instructions.md file for the `/.github/instructions` directory.
Generate an appropriate file name for the [NAME] placeholder based on the content. The instructions should be clear, 
concise, and comprehensive, providing all necessary information for an agent to work effectively in that domain. If no 
information is provided below, prompt the user for more details about the layer of the architecture or coding standards 
they want instructions for. The `.md` file should have front matter with the following format:

```yaml
description: [DESCRIPTION]
```
