
# The following forces v0.8.5
# https://github.com/owulveryck/goMarkableStream/

export GORKVERSION=v0.8.5
curl -L -s https://github.com/owulveryck/goMarkableStream/releases/download/$GORKVERSION/goMarkableStream_${GORKVERSION//v}_linux_arm.tar.gz | tar xzvf - -O goMarkableStream_${GORKVERSION//v}_linux_arm/goMarkableStream > goMarkableStream
chmod +x goMarkableStream

