run:
	./bin/run-app.sh
letsencrypt:
	./bin/run-letsencrypt.sh
down: 
	./bin/kill-docker.sh
	docker-compose -f docker-letsencrypt.yml down
	docker-compose -f docker-app.yml down
	./bin/kill-docker.sh
clean: 
	docker-compose -f docker-letsencrypt.yml rm -v
	docker-compose -f docker-app.yml rm -v