# url-bouncer

Cloudflare Pages Function path-state carrier.

Tokens:

```text
https://x.com/ = m0 78 2e 63 6f 6d 2f
```

Encode:

```sh
node -e "const u=process.argv[1]; const out=[]; let s=u; if(s.startsWith('https://')){out.push('m0');s=s.slice(8)}else if(s.startsWith('http://')){out.push('m1');s=s.slice(7)} for(const b of Buffer.from(s,'utf8')) out.push(b.toString(16).padStart(2,'0')); console.log(out.join(' '))" 'https://x.com/'
```

Use:

1. Encode the target URL into tokens.
2. Open `/`.
3. Click each token in order.
4. Click `DONE`.
