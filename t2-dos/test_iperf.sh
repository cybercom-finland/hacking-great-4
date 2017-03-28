vagrant ssh host1 -- iperf -s -i 10 &
vagrant ssh host2 -- iperf -c host1 -i 10 -t 60
