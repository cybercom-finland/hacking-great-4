vagrant ssh host2 -- 'sudo yum install httpd-tools'
vagrant ssh host2 -- 'ab -t 120 -n 10000000 -c 2 host1/index.html'
# about 8000 req/s
