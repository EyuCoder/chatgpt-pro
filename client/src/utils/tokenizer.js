import GPT3Tokenizer from 'gpt3-tokenizer'

const tokenizer = (str) => {
  const tokenize = new GPT3Tokenizer({ type: 'gpt3' }) // or 'codex'
  const encoded = tokenize.encode(str)
  //const decoded = tokenize.decode(encoded.bpe);
  return encoded.bpe.length
}

export default tokenizer
