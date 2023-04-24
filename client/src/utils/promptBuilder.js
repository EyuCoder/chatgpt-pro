import tokenizer from '../utils/tokenizer'

const promptBuilder = (messages, systemRole) => {
  const tokenLimit = parseInt(process.env.REACT_APP_TOKEN_LIMIT, 10)
  const convo = []
  convo.unshift(systemRole)
  let totalTokens = tokenizer(systemRole.content)

  // eslint-disable-next-line array-callback-return
  messages.map((msg) => {
    console.log('ITEM', msg.text)

    const newMsgToken = tokenizer(msg.text)
    const role = msg.ai ? 'assistant' : 'user'
    const message = {
      role: role,
      content: msg.text,
    }

    while (true) {
      console.log('limit', tokenLimit)
      if (totalTokens + newMsgToken < tokenLimit) {
        console.log('TOKENS', totalTokens + newMsgToken)
        convo.push(message)
        totalTokens += newMsgToken
        break
      } else {
        convo.splice(1, 1)
        console.log('SPLICED OLD MESSAGE', totalTokens)
      }
    }
  })

  return convo
}

export default promptBuilder
