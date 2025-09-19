# Eden Video Generator

Comprehensive video prompt generator for Eden agents with Gene's 10-step template.

## Features
- **3,624-char prompts** with 10-step film creation workflow  
- **Agent-specific**: Solienne, Miyomi, Geppetto, Abraham, Koru, Sue
- **Dual workflow**: Manual (copy/paste) + Automated (Eden v2 API)
- **Helvetica design**: Museum-quality aesthetics

## Usage
```bash
npm install && npm run dev
```

## API
Eden v2: `/v2/tasks/create` with `tool:'create'`, `output:'video'`

## Live
https://eden-video-generator.vercel.app
