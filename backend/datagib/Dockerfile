FROM python:3.6
# To enable logging
ENV PYTHONUNBUFFERED 1
# Create server directory
RUN mkdir -p /backend/datagib
WORKDIR /backend/datagib
# Install the server dependencies
COPY requirements.txt /backend/datagib/
RUN pip install -r requirements.txt
## Bundle the source
COPY . /backend/datagib
## Expose port 8000 in the container
EXPOSE 8000
#
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.4.0/wait /wait
RUN chmod +x /wait

CMD /wait python manage.py makemigrations && python manage.py migrate && python manage.py createsu && python manage.py runserver 0.0.0.0:8000
