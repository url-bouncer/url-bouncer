1. base64url encode text without padding
2. split into 2-char chunks, with final 1-char chunk if needed
3. open /c/
4. click chunks
5. click DONE

```sh
node -e "console.log(Buffer.from(process.argv[1], 'utf8').toString('base64url'))" 'https://example.com/'
```
