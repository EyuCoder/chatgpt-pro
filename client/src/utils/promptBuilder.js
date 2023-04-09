import tokenizer from '../utils/tokenizer'

const promptBuilder = (messages, systemRole) => {
  const convo = []
  convo.unshift(systemRole)
  let totalTokens = tokenizer(systemRole.content)

  console.log('here is the whole shenanigan', messages)

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
      if (totalTokens + newMsgToken < 2000) {
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
