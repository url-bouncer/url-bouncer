# url-bouncer

Static path-state carrier.

Encode:

```sh
node -e "console.log(Buffer.from(process.argv[1], 'utf8').toString('base64url'))" 'https://example.com/'
```

Use:

1. Base64url-encode the target string without padding.
2. Open `/`.
3. Click each base64url character in order.
4. Click `DONE`.

Example for `https://example.com/`:

```text
a H R 0 c H M 6 L y 9 l e G F t c G x l L m N v b S 8
```
