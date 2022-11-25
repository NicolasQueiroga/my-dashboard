FROM python:3.9-alpine3.13
LABEL maintainer="https://github.com/NicolasQueiroga"

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

COPY ./api /home/api
COPY ./tf /home/tf

WORKDIR /home
EXPOSE 8000

RUN pip install --upgrade pip && \
    apk update && \
    apk add gcc libc-dev make git libffi-dev openssl-dev python3-dev libxml2-dev libxslt-dev && \
    pip install -r /home/api/requirements.txt && \
    wget https://releases.hashicorp.com/terraform/1.3.5/terraform_1.3.5_linux_amd64.zip && \
    unzip terraform_1.3.5_linux_amd64.zip && \
    mv terraform /usr/local/bin/ && \
    rm terraform_1.3.5_linux_amd64.zip