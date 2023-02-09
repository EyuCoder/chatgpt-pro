# ChatGPT clone with DALL.E image generation model

*you can checkout the app [here](https://chatgpt.eyucoder.com/)*

> a demo of the App
<!-- https://user-images.githubusercontent.com/26358650/212903093-08c58f9b-25b5-440d-89e7-7a4b1f36df5a.mp4 -->
<img src="_pics/demo.gif" width="800px" alt="android icon"/>

**Give it a ⭐ if you liked it 😜**

## install

### client
```bash
cd client && npm i
```
### server
```bash
cd server && npm i
```

## Configuration
### Server
1. obtain your openai api key from [here](https://openai.com)
2. `cd server`
3. copy `.env.example` to `.env`
4. add your openai api key inside `.env`
5. make sure you have added `.env` to your `.gitignore` file

### Client
1. `cd client`
2. copy `.env.example` to `.env`
3. add your fiirebase config and server url
4. make sure you have added `.env` to your `.gitignore` file

## run
### to run client and server concurrently
```bash
cd client
npm run dev
```
### to run client only
```bash
cd client
npm start
```
### to run server only
```bash
cd server
npm start
```

## To setup locally with no firebase and redis change branch to [local_setup](https://github.com/EyuCoder/chatgpt-clone/tree/local_setup)
```bash
git checkout local_setup
```

***Tech used***
  - openai API
  - react
  - tailwindcss
  - react-icons
  - react-markdown
  - redis
  - express

## If you find this project helpful, you can buy me a coffee here
<a href="https://www.buymeacoffee.com/eyuel" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## credits
- [OpenAI](https://openai.com) for creating [ChatGPT](https://chat.openai.com/chat)

## 📝 License © [Eyuel](https://linkedin.com/in/eyuel-daniel)

>This project is released under the Apache License 2.0 license.
See [LICENSE](./LICENSE) for details.
