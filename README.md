# Get Started

install dependencies

```bash
docker run --name toutiao-proxy -it --rm -p 5000:3000 \
            -v $(pwd):/app \
            -v /app/node_modules \
            toutiao-proxy-image

sudo docker run --name toutiao-proxy --restart always -it \
            -p 4500:3000 \
            xiaohaihuang/toutiao-proxy-image
```
