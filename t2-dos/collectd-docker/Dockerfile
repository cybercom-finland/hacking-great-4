FROM centos:7

RUN yum install -y epel-release \
    && yum install -y collectd collectd-write_riemann \
    && yum clean all

COPY collectd.conf /etc/collectd.conf

EXPOSE 25826

CMD collectd -f
