# Get Started

install dependencies

```bash
docker run --name toutiao-proxy -it --rm -p 5000:3000 \
            -v $(pwd):/app \
            -v /app/node_modules \
            toutiao-proxy-image

```
