deploy:
	npm run build
	7z a -tzip build.zip build
	pscp build.zip flasherup@91.238.103.109:/home/flasherup/
	ssh flasherup@91.238.103.109 "sudo -S unzip build.zip && sudo -S rm -r /var/www/html/* && sudo -S cp -r build/. /var/www/html && sudo -S rm -r build"