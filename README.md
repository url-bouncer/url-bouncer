# url-bouncer

Static path-state carrier.

Encode:

```sh
node -e "console.log(Buffer.from(process.argv[1], 'utf8').toString('base64url'))" 'https://example.com/'
```

Use:

1. Split the base64url string into 2-character chunks, with a final 1-character chunk if needed.
2. Open `/`.
3. Click chunks in order.
4. Click `DONE`.

Example for `https://example.com/`:

```text
aH R0 cH M6 Ly 9l eG Ft cG xl Lm Nv bS 8
```
