#!/usr/bin/env python


import yaml, json, sys

class DatetimeEncoder(json.JSONEncoder):
    def default(self, obj):
        try:
            return super(DatetimeEncoder, obj).default(obj)
        except TypeError:
            return str(obj)

print "["
with open("0.yaml", "r") as stream:
   try:
      for data in yaml.load_all(stream):
         print(json.dumps(data, cls=DatetimeEncoder))
         print ","
#      print json.dumps(yaml.load_all(stream))
   except yaml.YAMLError as exc:
      print(exc)
print "]"
